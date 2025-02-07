"use client";

import Link from "next/link";
import { MapPin, User2, Building2 } from "lucide-react";
import Image from "next/image";
import { formatCurrency, formatRelativeTime } from "@/lib/utils";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { JobLevel, JobPostStatus } from "@prisma/client";

interface JobCardProps {
    job: {
        id: string;
        jobTitle: string;
        salaryFrom: number;
        salaryTo: number;
        employmentType: string;
        location: string;
        createdAt: Date;
        status: JobPostStatus;
        level: JobLevel;
        skills: string[];
        benefits: string[];
        company: {
            logo: string | null;
            name: string;
            about: string;
            location: string;
            industry: string;
            size: string;
        };
    };
}

export function JobCard({ job }: JobCardProps) {
    if (job.status === "EXPIRED") {
        return null;
    }

    return (
        <Link href={`/jobs/${job.id}`}>
            <Card className="hover:shadow-lg transition-all duration-300 hover:border-primary">
                <CardHeader>
                    <div className="flex flex-col md:flex-row gap-4">
                        {job.company.logo ? (
                            <Image
                                src={job.company.logo}
                                alt={job.company.name}
                                width={48}
                                height={48}
                                className="size-12 rounded-lg object-cover"
                            />
                        ) : (
                            <div className="bg-muted size-12 rounded-lg flex items-center justify-center">
                                <Building2 className="size-6 text-muted-foreground" />
                            </div>
                        )}
                        
                        <div className="flex flex-col flex-grow gap-2">
                            <div>
                                <h1 className="text-xl font-bold">{job.jobTitle}</h1>
                                <p className="text-sm text-muted-foreground">{job.company.name}</p>
                            </div>
                            
                            <div className="flex flex-wrap items-center gap-2">
                                <Badge variant="secondary">{job.employmentType}</Badge>
                                <Badge variant="secondary">{job.level}</Badge>
                                <Badge>{formatCurrency(job.salaryFrom)} - {formatCurrency(job.salaryTo)}</Badge>
                            </div>
                            
                            <div className="flex flex-wrap gap-2">
                                {job.skills.slice(0, 3).map((skill) => (
                                    <Badge key={skill} variant="outline">{skill}</Badge>
                                ))}
                                {job.skills.length > 3 && (
                                    <Badge variant="outline">+{job.skills.length - 3} more</Badge>
                                )}
                            </div>
                        </div>

                        <div className="md:ml-auto flex flex-col items-end gap-2">
                            <div className="flex items-center gap-2">
                                <MapPin className="size-4" />
                                <span className="text-sm font-medium">{job.location}</span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                {formatRelativeTime(job.createdAt)}
                            </p>
                        </div>
                    </div>

                    <div className="mt-4">
                        <p className="text-sm text-muted-foreground line-clamp-2">
                            {job.company.about}
                        </p>
                    </div>
                </CardHeader>
            </Card>
        </Link>
    );
}