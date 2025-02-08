import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/server/db';
import { jobSchema } from '@/lib/zodSchemas';
import { JobPostStatus } from '@prisma/client';
import { sanitizeHtml } from '@/lib/sanitize-html';
import { authServer } from '@/server/auth/auth-server';
import { stripe } from '@/lib/stripe';
import { jobListingDurationPricing } from '@/lib/pricingTiers';
import { env } from '@/env';

// GET /api/jobs - List jobs with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    const jobTypes = searchParams.get('jobTypes')?.split(',').filter(Boolean) || [];
    const location = searchParams.get('location') || '';
    const query = searchParams.get('query') || '';
    const minSalary = parseInt(searchParams.get('minSalary') || '0');
    const maxSalary = parseInt(searchParams.get('maxSalary') || '999999999');

    const skip = (page - 1) * pageSize;

    // Build the where clause based on filters
    const where = {
      status: JobPostStatus.ACTIVE,
      ...(jobTypes.length > 0 && {
        employmentType: {
          in: jobTypes,
        },
      }),
      ...(location && location !== 'worldwide' && {
        location: {
          contains: location,
          mode: 'insensitive' as const,
        },
      }),
      ...(query && {
        OR: [
          {
            jobTitle: {
              contains: query,
              mode: 'insensitive' as const,
            },
          },
          {
            jobDescription: {
              contains: query,
              mode: 'insensitive' as const,
            },
          },
        ],
      }),
      AND: [
        {
          salaryFrom: {
            gte: minSalary,
          },
        },
        {
          salaryTo: {
            lte: maxSalary,
          },
        },
      ],
    };

    // Execute queries in parallel
    const [jobs, totalCount] = await Promise.all([
      prisma.jobPost.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          id: true,
          jobTitle: true,
          location: true,
          employmentType: true,
          salaryFrom: true,
          salaryTo: true,
          createdAt: true,
          status: true,
          level: true,
          skills: true,
          benefits: true,
          company: {
            select: {
              name: true,
              logo: true,
              location: true,
              about: true,
              industry: true,
              size: true,
            },
          },
        },
      }),
      prisma.jobPost.count({ where }),
    ]);

    return NextResponse.json({
      jobs,
      currentPage: page,
      totalPages: Math.ceil(totalCount / pageSize),
      totalCount,
    });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/jobs - Create a new job
export async function POST(request: NextRequest) {
  try {
    const session = await authServer()
    const user = session?.user
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (user.userType !== 'COMPANY') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const data = await request.json();
    console.log('data from api/jobs route:', data)
    // Validate the input data
    const validatedData = jobSchema.safeParse(data);
    if (!validatedData.success) {
      return NextResponse.json(
        { error: validatedData.error.errors },
        { status: 400 }
      );
    }

    // Sanitize HTML content and remove company-specific fields
    const {
      companyDescription, companyLocation,
      companyName, companyWebsite,
      companySize, companyIndustry,
      companyLogo, companySocialMediaLinks,
      ...jobData
    } = validatedData.data;

    const sanitizedData = {
      ...jobData,
      jobDescription: sanitizeHtml(jobData.jobDescription),
    };

    // Get the company associated with the user
    const company = await prisma.company.findUnique({
      where: { userId: user.id },
       include: { user: true }
    });

    if (!company) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      );
    }
    // Stripe Customer ID
    let stripeCustomerId = company.user.stripeCustomerId;
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name || undefined,
      });

      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId: customer.id },
      });
      stripeCustomerId = customer.id;
    }
    // Create the job post
    const job = await prisma.jobPost.create({
      data: {
        ...sanitizedData,
        companyId: company.id,
      },
      include: {
        company: {
          select: {
            name: true,
            logo: true,
            location: true,
            about: true,
            industry: true,
            size: true,
          },
        },
      },
    });

    const pricingTier = jobListingDurationPricing.find(
      (t: { days: number }) => t.days === validatedData.data.listingDuration
    );
    if (!pricingTier) throw new Error("Invalid listing duration");
    const Createsession = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      line_items: [{
        price_data: {
          product_data: {
            name: `Job Posting - ${pricingTier.days} Days`,
            description: pricingTier.description,
          },
          currency: "USD",
          unit_amount: pricingTier.price * 100,
        },
        quantity: 1,
      }],
      mode: "payment",
      metadata: { jobId: job.id },
      success_url: `${env.NEXT_PUBLIC_URL}/payment/success?job_id=${job.id}`,
      cancel_url: `${env.NEXT_PUBLIC_URL}/payment/cancel`,
    });
    if (!Createsession.url) throw new Error("Payment failed");
    console.log("Job posted successfully from stripe:", Createsession.url);
    return NextResponse.json(job, { status: 201 });
  } catch (error) {
    console.error('Error creating job:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH /api/jobs - Batch update jobs (e.g., expire old listings)
export async function PATCH(request: NextRequest) {
  try {
    const session = await authServer()
    const user = session?.user
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (user.userType !== 'COMPANY') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { jobIds, updates } = await request.json();

    if (!Array.isArray(jobIds) || !updates) {
      return NextResponse.json(
        { error: 'Invalid request format' },
        { status: 400 }
      );
    }

    // Verify ownership of all jobs
    const jobs = await prisma.jobPost.findMany({
      where: {
        id: { in: jobIds },
        company: {
          userId: user.id,
        },
      },
    });

    if (jobs.length !== jobIds.length) {
      return NextResponse.json(
        { error: 'Unauthorized or jobs not found' },
        { status: 403 }
      );
    }

    // Perform batch update
    const updatedJobs = await prisma.jobPost.updateMany({
      where: {
        id: { in: jobIds },
      },
      data: updates,
    });

    return NextResponse.json(updatedJobs);
  } catch (error) {
    console.error('Error updating jobs:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/jobs - Batch delete jobs
export async function DELETE(request: NextRequest) {
  try {
    const session = await authServer()
    const user = session?.user
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (user.userType !== 'COMPANY') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { jobIds } = await request.json();

    if (!Array.isArray(jobIds)) {
      return NextResponse.json(
        { error: 'Invalid request format' },
        { status: 400 }
      );
    }

    // Verify ownership of all jobs
    const jobs = await prisma.jobPost.findMany({
      where: {
        id: { in: jobIds },
        company: {
          userId: user.id,
        },
      },
    });

    if (jobs.length !== jobIds.length) {
      return NextResponse.json(
        { error: 'Unauthorized or jobs not found' },
        { status: 403 }
      );
    }

    // Delete the jobs
    await prisma.jobPost.deleteMany({
      where: {
        id: { in: jobIds },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting jobs:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}