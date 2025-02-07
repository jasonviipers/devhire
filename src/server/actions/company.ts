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
            await tx.user.update({
                where: { id: user.id },
                data: {
                    onboardingCompleted: true,
                    userType: "COMPANY",
                    Company: { create: sanitizedData },
                },
            });
        });
        return redirect("/")
    } catch (error) {
        console.log(error);
    }
}