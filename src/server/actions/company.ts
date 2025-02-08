'use server';
import * as z from "zod";
import { companySchema } from "@/lib/zodSchemas";
import { requireUser } from "@/hooks/useRequireUser";
import { sanitizeHtml } from "@/lib/sanitize-html";
import { prisma } from "../db";
import { redirect } from "next/navigation";

export async function createCompany(data: z.infer<typeof companySchema>) {
    try {
        const user = await requireUser();
        const validatedData = companySchema.safeParse(data);
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

        await prisma.$transaction(async (tx) => {
            // 1. Create the Company first with explicit userId
            await tx.company.create({
                data: {
                    ...sanitizedData,
                    userId: user.id, // Directly set the relationship
                }
            });

            // 2. Update the User
            await tx.user.update({
                where: { id: user.id },
                data: {
                    onboardingCompleted: true,
                    userType: "COMPANY"
                }
            });
        });

        return redirect("/");
    } catch (error) {
        console.log(error);
        throw error; // Ensure errors propagate for proper handling
    }
}

export async function getCompany(userId: string) {
    const company = await prisma.company.findUnique({
        where: { userId },
        select: {
            name: true,
            location: true,
            about: true,
            logo: true,
            website: true,
            size: true,
            socialMediaLinks: true,
            industry: true,
        }
    });
    if (!company) redirect("/");
    return company;
}

export async function getJobsByCompanyId(companyId: string) {
    const jobs = await prisma.jobPost.findMany({
        where: { companyId },
        include: {
            company: {
                select: {
                    name: true,
                    logo: true,
                }
            }
        }
    });
    return jobs;
}

