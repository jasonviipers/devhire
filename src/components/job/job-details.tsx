'use client';

import { useEffect, useState } from 'react';
import { Job } from '@/types/job-types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, BookmarkIcon, Heart } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useJobStore } from '@/lib/store/useJobStore';
import { getFlagEmoji } from '@/lib/countriesList';
import { Button } from '../ui/button';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { AuthModal } from '../auth/auth-modal';
import { GeneralSubmitButton, SaveJobButton } from '../global/submit-buttons';
import { useSession } from '@/server/auth/auth-client';
import { JsonToHtml } from '../global/JsonToHtml';
import { benefits } from '../global/listOfBenefits';
import Image from 'next/image';
import { cn } from '@/lib/utils';

type JobDetailsProps = {
    id: string;
};

export default function JobDetails({ id }: JobDetailsProps) {
    const [job, setJob] = useState<Job | null>(null);
    const { fetchJobById, isLoading, error, savedJobs, toggleSavedJob } = useJobStore();
    const { isAuthModalOpen, closeAuthModal } = useAuthStore();
    const locationFlag = getFlagEmoji(job?.location || '');
    const { data: session } = useSession();
    const user = session?.user;

    useEffect(() => {
        const loadJob = async () => {
            const jobData = await fetchJobById(id);
            setJob(jobData);
        };
        loadJob();
    }, [id, fetchJobById]);

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <Card>
                    <CardHeader>
                        <Skeleton className="h-8 w-3/4" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Skeleton className="h-4 w-1/4" />
                        <Skeleton className="h-4 w-1/3" />
                        <Skeleton className="h-32 w-full" />
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                        Failed to load job details. Please try again later.
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    if (!job) {
        return (
            <div className="container mx-auto px-4 py-8">
                <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Not Found</AlertTitle>
                    <AlertDescription>
                        The job posting you're looking for doesn't exist or has been removed.
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8">
            <div className="grid lg:grid-cols-[1fr,400px] gap-8">
                <div className="space-y-8">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-3xl font-bold">{job.jobTitle}</h1>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="font-medium">{job.company.name}</span>

                                <Badge className="rounded-full" variant="secondary">
                                    {job.employmentType}
                                </Badge>
                                <span className="hidden md:inline text-muted-foreground">
                                    &bull;
                                </span>
                                <Badge className="rounded-full">
                                    {locationFlag && <span className="mr-1">{locationFlag}</span>}
                                    {job.location} Only
                                </Badge>
                            </div>
                        </div>
                        {/* Save Job Button user is logged in WIP */}
                        {user && (
                            <Button
                                variant={savedJobs.includes(job.id) ? "default" : "outline"}
                                size="sm"
                                onClick={() => toggleSavedJob(job.id)}
                                className="transition-colors duration-200"
                            >
                                <BookmarkIcon className={cn("mr-2 h-4 w-4", savedJobs.includes(job.id) && "fill-current")} />
                                {savedJobs.includes(job.id) ? "Saved" : "Save Job"}
                            </Button>

                        )}
                    </div>
                    <section>
                        <JsonToHtml json={JSON.parse(job.jobDescription)} />
                    </section>
                    <section>
                        <h3 className="font-semibold mb-4">
                            Benefits{" "}
                            <span className="text-sm text-muted-foreground font-normal">
                                (green is offered and red is not offered)
                            </span>
                        </h3>
                        <div className="flex flex-wrap gap-3">
                            {benefits.map((benefit) => {
                                const isOffered = job.benefits.includes(benefit.id);
                                return (
                                    <Badge
                                        key={benefit.id}
                                        variant={isOffered ? "default" : "outline"}
                                        className={`text-sm px-4 py-1.5 rounded-full ${!isOffered && " opacity-75 cursor-not-allowed"
                                            }`}
                                    >
                                        <span className="flex items-center gap-2">
                                            {benefit.icon}
                                            {benefit.label}
                                        </span>
                                    </Badge>
                                );
                            })}
                        </div>
                    </section>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Apply Now Card */}
                    <Card className="p-6">
                        <div className="space-y-4">
                            <div>
                                <div className="flex items-center justify-between">
                                    <h3 className="font-semibold">Apply now</h3>
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Please let {job.company.name} know you found this job on
                                    DevHire. This helps us grow!
                                </p>
                            </div>
                            <form>
                                <input type="hidden" name="jobId" value={job.id} />
                                <GeneralSubmitButton text="Apply now" />
                            </form>
                        </div>

                    </Card>

                    {/* Job Details Card */}
                    <Card className="p-6">
                        <div className="space-y-4">
                            <h3 className="font-semibold">About the job</h3>

                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">
                                        Apply before
                                    </span>
                                    <span className="text-sm">
                                        {/* {new Date(
                                            job.createdAt.getTime() +
                                            job.listingDuration * 24 * 60 * 60 * 1000
                                        ).toLocaleDateString("en-US", {
                                            month: "long",
                                            day: "numeric",
                                            year: "numeric",
                                        })} */}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">
                                        Posted on
                                    </span>
                                    <span className="text-sm">
                                        {/* {job.createdAt.toLocaleDateString("en-US", {
                                            month: "long",
                                            day: "numeric",
                                            year: "numeric",
                                        })} */}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">
                                        Employment type
                                    </span>
                                    <span className="text-sm">{job.employmentType}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">
                                        Location
                                    </span>
                                    <Badge variant="secondary">{job.location}</Badge>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Company Card */}
                    <Card className="p-6">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Image
                                    src={
                                        job.company.logo ??
                                        `https://avatar.vercel.sh/${job.company.name}`
                                    }
                                    alt={job.company.name}
                                    width={48}
                                    height={48}
                                    className="rounded-full size-12"
                                />
                                <div>
                                    <h3 className="font-semibold">{job.company.name}</h3>
                                    <p className="text-sm text-muted-foreground line-clamp-3">
                                        {job.company.about}
                                    </p>
                                </div>
                            </div>
                            <Button variant="outline" className="w-full">
                                View company
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}