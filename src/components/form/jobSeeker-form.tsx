"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PlusIcon, XIcon } from "lucide-react";

import Image from "next/image";
import { UploadDropzone } from "@/components/global/UploadThingReExport";
import { jobSeekerSchema } from "@/lib/zodSchemas";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createJobSeeker } from "@/server/actions/job";

const SKILL_OPTIONS = [
  "JavaScript", "TypeScript", "React",
  "Node.js", "Python", "Java",
  "C++", "SQL", "AWS", "Docker",
];

const EXPERIENCE_OPTIONS = [
  "0-1 years",
  "1-3 years",
  "3-5 years",
  "5-10 years",
  "10+ years",
];

export default function JobSeekerForm() {
  const form = useForm<z.infer<typeof jobSeekerSchema>>({
    resolver: zodResolver(jobSeekerSchema),
    defaultValues: {
      about: "",
      resume: "",
      name: "",
      experience: "",
      skills: [],
      socialMediaLinks: [],
    },
  });
  const [pending, setPending] = useState<boolean>(false);
  const [newSocialLink, setNewSocialLink] = useState<string>("");
  async function onSubmit(values: z.infer<typeof jobSeekerSchema>) {
    try {
      setPending(true);
      await createJobSeeker(values);
    } catch (error) {
      if (error instanceof Error && error.message !== "NEXT_REDIRECT") {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setPending(false);
    }
  }

  const addSocialLink = () => {
    if (!newSocialLink) return;
    const currentLinks = form.getValues("socialMediaLinks") || [];
    form.setValue("socialMediaLinks", [...currentLinks, { url: newSocialLink }]);
    setNewSocialLink("");
  };

  const removeSocialLink = (index: number) => {
    const currentLinks = form.getValues("socialMediaLinks") || [];
    form.setValue(
      "socialMediaLinks",
      currentLinks.filter((_, i) => i !== index)
    );
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter your full name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="about"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Short Bio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us about yourself..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="skills"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Skills</FormLabel>
              <FormControl>
                <Select
                  onValueChange={(value) => {
                    const currentSkills = field.value || [];
                    if (!currentSkills.includes(value)) {
                      field.onChange([...currentSkills, value]);
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select skills" />
                  </SelectTrigger>
                  <SelectContent>
                    {SKILL_OPTIONS.map((skill) => (
                      <SelectItem key={skill} value={skill}>
                        {skill}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <div className="flex flex-wrap gap-2 mt-2">
                {field.value?.map((skill, index) => (
                  <div
                    key={index}
                    className="bg-secondary px-3 py-1 rounded-full flex items-center gap-2"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => {
                        field.onChange(field.value?.filter((_, i) => i !== index));
                      }}
                    >
                      <XIcon className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="experience"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Experience</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    {EXPERIENCE_OPTIONS.map((exp) => (
                      <SelectItem key={exp} value={exp}>
                        {exp}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="space-y-4">
          <FormLabel>Social Media Links</FormLabel>
          <div className="flex gap-2">
            <Input
              placeholder="Enter social media link"
              value={newSocialLink}
              onChange={(e) => setNewSocialLink(e.target.value)}
            />
            <Button type="button" onClick={addSocialLink}>
              <PlusIcon className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-2">
            {form.watch("socialMediaLinks")?.map((link, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input value={link.url} disabled />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => removeSocialLink(index)}
                >
                  <XIcon className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
        <FormField
          control={form.control}
          name="resume"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Resume (PDF)</FormLabel>
              <FormControl>
                <div>
                  {field.value ? (
                    <div className="relative w-fit">
                      <Image
                        src="/pdf.png"
                        alt="Company Logo"
                        width={100}
                        height={100}
                        className="rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2"
                        onClick={() => field.onChange("")}
                      >
                        <XIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <UploadDropzone
                      endpoint="resumeUploader"
                      onClientUploadComplete={(res) => {
                        field.onChange(res[0].url);
                        toast.success("Resume uploaded successfully!");
                      }}
                      onUploadError={() => {
                        toast.error("Something went wrong. Please try again.");
                      }}
                    />
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? "Submitting..." : "Continue"}
        </Button>
      </form>
    </Form>
  );
}
