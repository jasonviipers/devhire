import { z } from "zod";
import { isValidUrl } from "./utils";

// =====================
// User Schemas
// =====================
export const userSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  email: z.string().email("Invalid email address").optional(),
  image: z.string().optional(),
  onboardingCompleted: z.boolean().optional(),
  userType: z.enum(["COMPANY", "JOB_SEEKER"]).optional(),
});

export const authProviderSchema = z.enum(["email", "google", "github"]);

// =====================
// Social Media Schema
// =====================
export const socialMediaLinkSchema = z.object({
  url: z.string().refine(isValidUrl, { message: "Please enter a valid URL" }),
});

// =====================
// Company Schemas
// =====================
export const companySchema = z.object({
  name: z.string().min(2, "Company name must be at least 2 characters"),
  location: z.string().min(2, "Location must be at least 2 characters"),
  about: z.string().min(10, "Please provide more information about your company"),
  logo: z.string().min(1, "Please upload a logo"),
  website: z.string().refine(isValidUrl, { message: "Please enter a valid website URL" }),
  size: z.string().min(1, "Company size is required"),
  industry: z.string().min(1, "Industry is required"),
  socialMediaLinks: z.array(socialMediaLinkSchema).optional(),
});

// =====================
// Job Seeker Schemas
// =====================
export const jobSeekerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  about: z.string().min(10, "Please provide more information about yourself"),
  resume: z.string().min(1, "Please upload a resume"),
  skills: z.array(z.string()).min(1, "Please select at least one skill"),
  experience: z.string().optional(),
  socialMediaLinks: z.array(socialMediaLinkSchema).optional(),
});

// =====================
// Job Post Schemas
// =====================
export const jobLevelSchema = z.enum([
  "ENTRY_LEVEL", "MID_LEVEL", "SENIOR_LEVEL", "INTERN", "MANAGER"
]);

export const jobPostStatusSchema = z.enum(["DRAFT", "ACTIVE", "EXPIRED"]).default("ACTIVE");

export const jobSchema = z.object({
  jobTitle: z.string().min(2, "Job title must be at least 2 characters"),
  employmentType: z.string().min(1, "Employment type is required"),
  location: z.string().min(1, "Location is required"),
  salaryFrom: z.number().min(0, "Minimum salary must be a positive number"),
  salaryTo: z.number().min(0, "Maximum salary must be a positive number"),
  jobDescription: z.string().min(100, "Description must be at least 100 characters"),
  listingDuration: z.number().min(1, "Listing duration must be at least 1 day"),
  level: jobLevelSchema,
  skills: z.array(z.string()).min(1, "At least one required skill"),
  benefits: z.array(z.string()).min(1, "At least one benefit required"),
  status: jobPostStatusSchema.default("ACTIVE"),
  companyDescription: z.string().min(100, "Description must be at least 100 characters"),
  companyLocation: z.string().min(1, "Location is required"),
  companyName: z.string().min(1, "Company name is required"),
  companyWebsite: z.string().refine(isValidUrl, { message: "Please enter a valid website URL" }),
  companySocialMediaLinks: z.array(socialMediaLinkSchema).optional(),
  companySize: z.string().min(1, "Company size is required"),
  companyIndustry: z.string().min(1, "Industry is required"),
  companyLogo: z.string().min(1, "Please upload a logo"),
});

// =====================
// Application Schemas
// =====================
export const applicationStatusSchema = z.enum([
  "APPLIED", "IN_REVIEW", "INTERVIEWED", "REJECTED", "OFFERED", "ACCEPTED"
]);

export const applicationSchema = z.object({
  jobId: z.string().uuid(),
  // resume: z.string().min(100, "Resume text must be at least 100 characters"),
});

// =====================
// Notification Schema
// =====================
export const notificationSchema = z.object({
  read: z.boolean().default(false),
});

// =====================
// Utility Schemas
// =====================
export const paymentMetadataSchema = z.object({
  jobId: z.string().uuid(),
  userId: z.string().cuid(),
  companyId: z.string().uuid()
});

export const savedJobPostSchema = z.object({
  jobId: z.string().uuid(),
});

// =====================
// AI History Schema
// =====================
export const aiHistorySchema = z.object({
  prompt: z.string().min(10, "Prompt must be at least 10 characters"),
});

// =====================
// Query Parameter Schemas
// =====================
export const jobSearchParamsSchema = z.object({
  query: z.string().optional(),
  location: z.string().optional(),
  minSalary: z.number().optional(),
  maxSalary: z.number().optional(),
  employmentType: z.array(z.string()).optional(),
  skills: z.array(z.string()).optional(),
});