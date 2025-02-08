import { JobLevel, JobPostStatus } from "@prisma/client";

export interface Job {
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
    jobDescription: string;
    listingDuration: number;
    company: {
      logo: string | null;
      name: string;
      about: string;
      location: string;
      industry: string;
      size: string;
      website: string;
      socialMediaLinks: { url: string }[];
    };
  }
  

  export interface Company {
    id: string;
    name: string;
    location: string;
    about: string;
    logo: string;
    website: string;
    size: string;
    industry: string;
    socialMediaLinks: { url: string }[];
  }
  
  export interface JobFilters {
    page: number;
    jobTypes: string[];
    location: string;
    query: string;
    minSalary?: number;
    maxSalary?: number;
  }