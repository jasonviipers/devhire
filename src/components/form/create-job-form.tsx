"use client";
import { countryList } from "@/lib/countriesList";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
    Form, FormControl, FormField,
    FormItem, FormLabel, FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import {
    Select, SelectContent, SelectGroup,
    SelectItem, SelectLabel, SelectTrigger, SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { PlusIcon, XIcon } from "lucide-react";
import { Button } from "../ui/button";
import Image from "next/image";
import { UploadDropzone } from "../global/UploadThingReExport";
import { useState } from "react";
import { z } from "zod";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { jobSchema, socialMediaLinkSchema } from "@/lib/zodSchemas";
import dynamic from "next/dynamic";
import { SalaryRangeSelector } from "../selector/salary-range-selector";
import { JobStatusSelector } from "../selector/job-status-selector";
import BenefitsSelector from "../selector/benefits-selector";
import { JobListingDurationSelector } from "../job/JobListingDurationSelector";
import { useToast } from "@/hooks/use-toast";
import { CountrySelector } from "../global/country-selector";
import { useJobStore } from "@/lib/store/useJobStore";

const JobDescriptionEditor = dynamic(
    () => import('../richTextEditor/JobDescriptionEditor').then(mod => mod.default),
    {
        ssr: false,
        loading: () => (
            <div className="min-h-[300px] p-4 border rounded-lg bg-card animate-pulse">
                <div className="h-8 bg-muted rounded mb-4 w-1/3" />
                <div className="h-4 bg-muted rounded mb-2 w-1/4" />
                <div className="h-4 bg-muted rounded mb-2 w-1/2" />
            </div>
        )
    }
);

interface CreateJobFormProps {
    companyName: string;
    companyLocation: string;
    companyAbout: string;
    companyLogo: string;
    companyWebsite: string;
    companySocialMediaLinks: z.infer<typeof socialMediaLinkSchema>[];
    companySize: string;
    companyIndustry: string;
}

export function CreateJobForm({
    companyName, companyLocation, companyAbout,
    companyLogo, companyWebsite, companySocialMediaLinks,
    companySize, companyIndustry
}: CreateJobFormProps) {
    const [pending, setPending] = useState(false);
    const form = useForm<z.infer<typeof jobSchema>>({
        resolver: zodResolver(jobSchema),
        defaultValues: {
            benefits: [],
            companyDescription: companyAbout,
            companyLocation: companyLocation,
            companyName: companyName,
            companyWebsite: companyWebsite,
            companySocialMediaLinks: companySocialMediaLinks,
            companySize: companySize,
            companyIndustry: companyIndustry,
            companyLogo: companyLogo,
            jobTitle: "",
            location: "",
            jobDescription: "",
            employmentType: "",
            level: "INTERN",
            skills: [],
            salaryFrom: 0,
            salaryTo: 0,
            listingDuration: 30,
            status: "ACTIVE",
        }
    })
    const { toast } = useToast();
    const { createJob } = useJobStore();
    async function onSubmit(values: z.infer<typeof jobSchema>) {
        try {
            setPending(true);
            await createJob(values);
            toast({
                title: "Job posted successfully",
                description: "Your job has been posted successfully. You can view it in your job listings."
            });
        } catch (error) {
            console.log(error);
            if (error instanceof Error && error.message !== "NEXT_REDIRECT") {


                toast({
                    title: "Error",
                    description: "Something went wrong. Please try again."
                });
            }
        }
    }

    console.log(form.formState.errors)

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}
                className="col-span-1   lg:col-span-2  flex flex-col gap-8" >
                <Card>
                    <CardHeader>
                        <CardTitle>Job Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="jobTitle"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Job Title</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Job Title" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="employmentType"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Employment Type</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Employment Type" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>Employment Type</SelectLabel>
                                                    <SelectItem value="full-time">Full Time</SelectItem>
                                                    <SelectItem value="part-time">Part Time</SelectItem>
                                                    <SelectItem value="contract">Contract</SelectItem>
                                                    <SelectItem value="internship">Internship</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="level"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Level</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Level" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>Level</SelectLabel>
                                                    <SelectItem value="ENTRY_LEVEL">Entry Level</SelectItem>
                                                    <SelectItem value="MID_LEVEL">Mid Level</SelectItem>
                                                    <SelectItem value="SENIOR_LEVEL">Senior Level</SelectItem>
                                                    <SelectItem value="INTERN">Intern</SelectItem>
                                                    <SelectItem value="MANAGER">Manager</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="location"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Location</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Location" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>Worldwide</SelectLabel>
                                                    <SelectItem value="worldwide">
                                                        <span>🌍</span>
                                                        <span className="pl-2">Worldwide / Remote</span>
                                                    </SelectItem>
                                                </SelectGroup>
                                                <SelectGroup>
                                                    <SelectLabel>Location</SelectLabel>
                                                    {countryList.map((country) => (
                                                        <SelectItem value={country.name} key={country.code}>
                                                            <span>{country.flagEmoji}</span>
                                                            <span className="pl-2">{country.name}</span>
                                                        </SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <FormItem>
                                <FormLabel>Salary Range</FormLabel>
                                <FormControl>
                                    <SalaryRangeSelector
                                        control={form.control}
                                        maxSalary={1000000}
                                        minSalary={1000}
                                    />
                                </FormControl>
                                <FormMessage>
                                    {form.formState.errors.salaryFrom?.message ||
                                        form.formState.errors.salaryTo?.message}
                                </FormMessage>
                            </FormItem>
                            <JobStatusSelector control={form.control} />
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="skills"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-semibold">Required Skills</FormLabel>
                                        <FormControl>
                                            <div className="space-y-2">
                                                {field.value?.map((skill, index) => (
                                                    <div key={index} className="flex gap-2">
                                                        <Input
                                                            value={skill}
                                                            onChange={(e) => {
                                                                const newSkills = [...field.value];
                                                                newSkills[index] = e.target.value;
                                                                field.onChange(newSkills);
                                                            }}
                                                            placeholder="Enter a skill"
                                                            className="flex-1"
                                                        />
                                                        <Button
                                                            type="button"
                                                            variant="destructive"
                                                            size="icon"
                                                            onClick={() => {
                                                                const newSkills = field.value.filter((_, i) => i !== index);
                                                                field.onChange(newSkills);
                                                            }}
                                                        >
                                                            <XIcon className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                ))}
                                                <Button
                                                    type="button"
                                                    variant="secondary"
                                                    className="w-full"
                                                    onClick={() => {
                                                        const newSkills = [...field.value];
                                                        newSkills.push("");
                                                        field.onChange(newSkills);
                                                    }}
                                                >
                                                    <PlusIcon className="h-4 w-4 mr-2" />
                                                    Add Skill
                                                </Button>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="jobDescription"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-semibold">Job Description</FormLabel>
                                    <FormControl>
                                        <JobDescriptionEditor field={field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="benefits"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-semibold">Benefits</FormLabel>
                                    <FormControl>
                                        <BenefitsSelector field={field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Company Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="companyName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Company Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Company Name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="companySize"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Company Size</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Company Size" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>Company Size</SelectLabel>
                                                    <SelectItem value="1-10">1-10 employees</SelectItem>
                                                    <SelectItem value="11-50">11-50 employees</SelectItem>
                                                    <SelectItem value="51-200">51-200 employees</SelectItem>
                                                    <SelectItem value="201-500">201-500 employees</SelectItem>
                                                    <SelectItem value="501-1000">501-1000 employees</SelectItem>
                                                    <SelectItem value="1000+">1000+ employees</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="companyWebsite"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Company Website</FormLabel>
                                        <FormControl>
                                            <div className="flex ">
                                                <span className="flex items-center justify-center px-3 border border-r-0 border-input rounded-l-md bg-muted text-muted-foreground text-sm">
                                                    https://
                                                </span>
                                                <Input
                                                    {...field}
                                                    placeholder="Company Website"
                                                    className="rounded-l-none"
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="companyLocation"
                                render={({ field }) => (
                                    <CountrySelector
                                        control={form.control}
                                        name="location"
                                        label="Location"
                                        defaultValue={field.value}
                                        error={form.formState.errors.location?.message}
                                    />
                                )}
                            />
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="companyIndustry"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Industry</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="Industry"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        {/* WIP */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="companySocialMediaLinks"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Company Social Media Links</FormLabel>
                                        <FormControl>
                                            <div className="space-y-2">
                                                {field.value?.map((link, index) => (
                                                    <div key={index} className="flex gap-2">
                                                        <Input
                                                            value={link.url}
                                                            onChange={(e) => {
                                                                const newLinks = [...field.value ?? []];
                                                                newLinks[index] = { url: e.target.value };
                                                                field.onChange(newLinks);
                                                            }}
                                                            placeholder="Social Media URL"
                                                        />
                                                        <Button
                                                            type="button"
                                                            variant="destructive"
                                                            onClick={() => {
                                                                const newLinks = field.value?.filter((_, i) => i !== index);
                                                                field.onChange(newLinks);
                                                            }}
                                                        >
                                                            <XIcon className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                ))}
                                                <Button
                                                    type="button"
                                                    variant="secondary"
                                                    onClick={() => {
                                                        const newLinks = [...(field.value ?? [])];
                                                        newLinks.push({ url: "" });
                                                        field.onChange(newLinks);
                                                    }}
                                                >
                                                    <PlusIcon className="h-4 w-4" />
                                                    Add link
                                                </Button>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="companyDescription"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Company Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Company Description"
                                            className="min-h-[120px]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="companyLogo"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Company Logo</FormLabel>
                                    <FormControl>
                                        <div>
                                            {field.value ? (
                                                <div className="relative w-fit">
                                                    <Image src={field.value} alt="Company Logo"
                                                        width={100} height={100} className="rounded-lg" />
                                                    <Button type="button" variant="destructive"
                                                        size="icon" className="absolute -top-2 -right-2 "
                                                        onClick={() => field.onChange("")}
                                                    >
                                                        <XIcon className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            ) : (
                                                <UploadDropzone
                                                    endpoint="imageUploader"
                                                    onClientUploadComplete={(res) => {
                                                        field.onChange(res[0].url);
                                                        toast({
                                                            title: "Logo uploaded successfully!",
                                                        })
                                                    }}

                                                    onUploadError={() => {
                                                        toast({
                                                            title: "Something went wrong. Please try again.",
                                                            description: "Please try again.",
                                                            variant: "destructive"
                                                        })
                                                    }}
                                                />


                                            )}
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Job Listing Duration</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <FormField
                            control={form.control}
                            name="listingDuration"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <JobListingDurationSelector field={field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                </Card>
                <Button type="submit" className="w-full" disabled={pending}>
                    {pending ? "Submitting..." : "Continue"}
                </Button>
            </form>
        </Form>
    )
}

