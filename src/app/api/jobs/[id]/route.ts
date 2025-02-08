import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/server/db';
import { jobSchema } from '@/lib/zodSchemas';
import { sanitizeHtml } from '@/lib/sanitize-html';
import { authServer } from '@/server/auth/auth-server';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/jobs/[id] - Get a single job
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const session = await authServer()
    const user = session?.user
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const job = await prisma.jobPost.findUnique({
      where: { id:id, company:{userId:user.id}},
      select: {
        benefits: true,
        id: true,
        jobTitle: true,
        jobDescription: true,
        salaryTo: true,
        salaryFrom: true,
        location: true,
        employmentType: true,
        listingDuration: true,
        skills: true,
        status: true,
        level: true,
        company: {
            select: {
                name: true,
                logo: true,
                location: true,
                about: true,
                website: true,
                size: true,
                socialMediaLinks: true,
                industry: true,
            },
        }
    },
    });

    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(job);
  } catch (error) {
    console.error('Error fetching job:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH /api/jobs/[id] - Update a single job
export async function PATCH(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const session = await authServer()
    const user = session?.user
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if(user.userType !== 'COMPANY') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const data = await request.json();

    // Validate the input data
    const validatedData = jobSchema.partial().safeParse(data);
    if (!validatedData.success) {
      return NextResponse.json(
        { error: validatedData.error.errors },
        { status: 400 }
      );
    }

    // Verify job ownership
    const job = await prisma.jobPost.findFirst({
      where: {
        id: (await params).id,
        company: {
          userId: user.id,
        },
      },
    });

    if (!job) {
      return NextResponse.json(
        { error: 'Job not found or unauthorized' },
        { status: 404 }
      );
    }

    // Sanitize HTML content if present
    const sanitizedData = {
      ...validatedData.data,
      ...(validatedData.data.jobDescription && {
        jobDescription: sanitizeHtml(validatedData.data.jobDescription),
      }),
      ...(validatedData.data.companyDescription && {
        companyDescription: sanitizeHtml(validatedData.data.companyDescription),
      }),
    };

    // Update the job
    const updatedJob = await prisma.jobPost.update({
      where: { id: (await params).id },
      data: sanitizedData,
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

    return NextResponse.json(updatedJob);
  } catch (error) {
    console.error('Error updating job:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/jobs/[id] - Delete a single job
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const session = await authServer()
    const user = session?.user
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if(user.userType !== 'COMPANY') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify job ownership
    const job = await prisma.jobPost.findFirst({
      where: {
        id: (await params).id,
        company: {
          userId: user.id,
        },
      },
    });

    if (!job) {
      return NextResponse.json(
        { error: 'Job not found or unauthorized' },
        { status: 404 }
      );
    }

    // Delete the job
    await prisma.jobPost.delete({
      where: { id: (await params).id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting job:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}