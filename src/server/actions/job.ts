'use server';
import * as z from "zod";
import { prisma } from "../db";
import { jobSeekerSchema } from "@/lib/zodSchemas";
import { requireUser } from "@/hooks/useRequireUser";
import { sanitizeHtml } from "@/lib/sanitize-html";
import { redirect } from "next/navigation";

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