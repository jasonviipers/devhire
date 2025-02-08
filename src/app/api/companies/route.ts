import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/server/db';
import { companySchema } from '@/lib/zodSchemas';
import { requireUser } from '@/hooks/useRequireUser';
import { sanitizeHtml } from '@/lib/sanitize-html';

interface RouteParams {
    params: Promise<{ id: string }>;
}

// GET /api/companies/[id] - Get a single company
export async function GET(request: NextRequest, { params }: RouteParams) {
    const { id } = await params;
    try {
        const company = await prisma.company.findUnique({
            where: { id },

            include: {
                socialMediaLinks: true,
                JobPost: {
                    where: { status: 'ACTIVE' },
                    orderBy: { createdAt: 'desc' },
                    take: 5,
                    select: {
                        id: true,
                        jobTitle: true,
                        location: true,
                        employmentType: true,
                        createdAt: true,
                    },
                },
                _count: {
                    select: {
                        JobPost: true,
                    },
                },

            },
        });

        if (!company) {
            return NextResponse.json(
                { error: 'Company not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(company);
    } catch (error) {
        console.error('Error fetching company:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// PATCH /api/companies/[id] - Update a company
export async function PATCH(
    request: NextRequest,
    { params }: RouteParams
) {
    try {
        const user = await requireUser();
        const data = await request.json();
        const { id } = await params;
        // Validate the input data
        const validatedData = companySchema.partial().safeParse(data);
        if (!validatedData.success) {
            return NextResponse.json(
                { error: validatedData.error.errors },
                { status: 400 }
            );
        }

        const { socialMediaLinks, ...restValidatedData } = validatedData.data;
        // Verify company ownership
        const company = await prisma.company.findFirst({
            where: {
                id: id,
                userId: user.id,
            },
        });

        if (!company) {
            return NextResponse.json(
                { error: 'Company not found or unauthorized' },
                { status: 404 }
            );
        }

        // Sanitize HTML content if present
        const sanitizedData = {
            ...restValidatedData,
            ...(restValidatedData.about && {
                about: sanitizeHtml(restValidatedData.about),
            }),
        };

        // Update the company with proper handling of socialMediaLinks
        const updatedCompany = await prisma.company.update({
            where: { id: id },
            data: {
                ...sanitizedData,
                // Conditionally add socialMediaLinks operation if present
                ...(socialMediaLinks && {
                    socialMediaLinks: {
                        deleteMany: {},
                        create: socialMediaLinks,
                    },
                }),
            },
            include: {
                socialMediaLinks: true,
            },
        });

        return NextResponse.json(updatedCompany);
    } catch (error) {
        console.error('Error updating company:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// DELETE /api/companies/[id] - Delete a company
export async function DELETE(
    request: NextRequest,
    { params }: RouteParams
) {
    try {
        const user = await requireUser();
        const { id } = await params;
        // Verify company ownership
        const company = await prisma.company.findFirst({
            where: {
                id: id,
                userId: user.id,
            },
        });

        if (!company) {
            return NextResponse.json(
                { error: 'Company not found or unauthorized' },
                { status: 404 }
            );
        }

        // Delete the company and all related data
        await prisma.$transaction([
            // Delete all jobs
            prisma.jobPost.deleteMany({
                where: { companyId: id },
            }),
            // Delete social media links
            prisma.socialMediaLink.deleteMany({
                where: { companyId: id },
            }),

            // Delete the company
            prisma.company.delete({
                where: { id: id },
            }),
            // Update user type

            prisma.user.update({
                where: { id: user.id },
                data: { userType: 'JOB_SEEKER' },
            }),
        ]);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting company:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}