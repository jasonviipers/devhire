import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/server/db';
import { JobPostStatus } from '@prisma/client';

interface RouteParams {
    params: {
        id: string;
    };
}

// GET /api/companies/[id]/jobs - Get all jobs for a company
export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const page = parseInt(searchParams.get('page') || '1');
        const pageSize = parseInt(searchParams.get('pageSize') || '10');
        const status = searchParams.get('status') || 'ACTIVE';

        const skip = (page - 1) * pageSize;

        const [jobs, totalCount] = await Promise.all([
            prisma.jobPost.findMany({
                where: {
                    companyId: params.id,
                    status: status as any,
                },
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
                    _count: {
                        select: {
                            Application: true,
                        },
                    },

                },
            }),
            prisma.jobPost.count({
                where: {
                    companyId: params.id,
                    status: status as JobPostStatus,
                },
            }),
        ]);

        return NextResponse.json({
            jobs,
            currentPage: page,
            totalPages: Math.ceil(totalCount / pageSize),
            totalCount,
        });
    } catch (error) {
        console.error('Error fetching company jobs:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}