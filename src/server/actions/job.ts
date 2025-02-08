'use server';
import * as z from "zod";
import { prisma } from "../db";
import { jobSchema, jobSeekerSchema } from "@/lib/zodSchemas";
import { requireUser } from "@/hooks/useRequireUser";
import { sanitizeHtml } from "@/lib/sanitize-html";
import { redirect } from "next/navigation";
import { stripe } from "@/lib/stripe";
import { jobListingDurationPricing } from "@/lib/pricingTiers";
import { env } from "@/env";
import { JobPostStatus } from "@prisma/client";

export async function createJobSeeker(data: z.infer<typeof jobSeekerSchema>) {
    try {
        const user = await requireUser();

        const validatedData = jobSeekerSchema.safeParse(data);
        if (!validatedData.success) {
            throw new Error(validatedData.error.errors.map(e => e.message).join(", "));
        }

        const sanitizedData = {
            ...validatedData.data,
            about: sanitizeHtml(validatedData.data.about),
            socialMediaLinks: validatedData.data.socialMediaLinks ? {
                create: validatedData.data.socialMediaLinks
            } : undefined,
        };

        await prisma.user.update({
            where: { id: user.id },
            data: {
                onboardingCompleted: true,
                userType: "JOB_SEEKER",
                JobSeeker: { create: sanitizedData },
            },
        });

        return redirect("/job-seeker");
    } catch (error) {
        console.log(error);
    }
}

export async function createJob(data: z.infer<typeof jobSchema>) {
    try {
        console.log('from create job:', data)
        const user = await requireUser("COMPANY");


        const validatedData = jobSchema.safeParse(data);
        if (!validatedData.success) {
            throw new Error(validatedData.error.errors.map(e => e.message).join(", "));
        }

        const sanitizedData = {
            ...validatedData.data,
            companyDescription: sanitizeHtml(validatedData.data.companyDescription),
            jobDescription: sanitizeHtml(validatedData.data.jobDescription),
            companySocialMediaLinks: validatedData.data.companySocialMediaLinks ? {
                create: validatedData.data.companySocialMediaLinks
            } : undefined,
        };

        const company = await prisma.company.findUnique({
            where: { userId: user.id },
            include: { user: true },
        });

        if (!company) {
            throw new Error("Company not found");
        }

        if (!user.email) throw new Error("User email required");

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

        const jobPost = await prisma.jobPost.create({
            data: {
                ...sanitizedData,
                companyId: company.id,
                status: "ACTIVE",
            },
        });

        const pricingTier = jobListingDurationPricing.find(
            (t: { days: number }) => t.days === validatedData.data.listingDuration
        );
        if (!pricingTier) throw new Error("Invalid listing duration");

        const session = await stripe.checkout.sessions.create({
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
            metadata: { jobId: jobPost.id },
            success_url: `${env.NEXT_PUBLIC_URL}/payment/success?job_id=${jobPost.id}`,
            cancel_url: `${env.NEXT_PUBLIC_URL}/payment/cancel`,
        });

        if (!session.url) throw new Error("Payment failed");

        console.log("Job posted successfully from stripe:", session.url);
        return jobPost;
    } catch (error) {
        console.log(error);
        throw new Error("Failed to create job");
    }
}

export async function getJobs(
    page: number = 1,
    pageSize: number = 10,
    jobTypes: string[] = [],
    location: string = ""
) {
    const skip = (page - 1) * pageSize;

    const where = {
        status: JobPostStatus.ACTIVE,
        ...(jobTypes.length > 0 && {
            employmentType: {
                in: jobTypes,
            },
        }),
        ...(location &&
            location !== "worldwide" && {
            location: location,
        }),
    };

    const [data, totalCount] = await Promise.all([
        prisma.jobPost.findMany({
            skip,
            take: pageSize,
            where,
            select: {
                jobTitle: true,
                id: true,
                salaryFrom: true,
                salaryTo: true,
                employmentType: true,
                location: true,
                createdAt: true,
                company: {
                    select: {
                        name: true,
                        logo: true,
                        location: true,
                        about: true,
                        socialMediaLinks: true,
                        industry: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        }),
        prisma.jobPost.count({ where }),
    ]);

    return {
        jobs: data,
        totalPages: Math.ceil(totalCount / pageSize),
        currentPage: page,
    };
}
