"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
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
import Image from "next/image";
import { PlusIcon, XIcon } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UploadDropzone } from "@/components/global/UploadThingReExport";
import { companySchema } from "@/lib/zodSchemas";
import { CountrySelector } from "../global/country-selector";
import { createCompany } from "@/server/actions/company";

const companySizes = ["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"];
const industries = [
  "Technology",
  "Finance",
  "Healthcare",
  "Education",
  "Manufacturing",
  "Retail",
  "Other",
];
export default function CompanyForm() {
  const form = useForm<z.infer<typeof companySchema>>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      about: "",
      location: "",
      website: "",
      logo: "",
      name: "",
      size: "",
      industry: "",
      socialMediaLinks: [],
    },
  });

  const [pending, setPending] = useState<boolean>(false);
  const [newSocialLink, setNewSocialLink] = useState<string>("");

  async function onSubmit(values: z.infer<typeof companySchema>) {
    try {
      setPending(true);
      await createCompany(values);
    } catch (error) {
      console.log(error);
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter company name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="location"
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="size"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Size</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select company size" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {companySizes.map((size) => (
                      <SelectItem value={size} key={size}>
                        {size} employees
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="industry"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Industry</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {industries.map((industry) => (
                      <SelectItem value={industry} key={industry}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="website"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Website</FormLabel>
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
          name="about"
          render={({ field }) => (
            <FormItem>
              <FormLabel>About</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us about your company..."
                  className="resize-none min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="logo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Logo</FormLabel>
              <FormControl>
                <div>
                  {field.value ? (
                    <div className="relative w-fit">
                      <Image
                        src={field.value}
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
                      endpoint="imageUploader"
                      onClientUploadComplete={(res) => {
                        field.onChange(res[0].url);
                        toast.success("Logo uploaded successfully!");
                      }}
                      onUploadError={() => {
                        toast.error("Upload failed. Please try again.");
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
          {pending ? "Submitting..." : "Create Company Profile"}
        </Button>
      </form>
    </Form>
  );
}
