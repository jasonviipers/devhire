import { CreateJobForm } from '@/components/form/create-job-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { requireUser } from '@/hooks/useRequireUser';
import { getCompany } from '@/server/actions/company';
import Image from 'next/image';
import React from 'react'

const companies = [
  { id: 0, name: "ArcJet", logo: '/arcjet.jpg' },
  { id: 1, name: "Inngest", logo: '/inngest-locale.png' },
  { id: 2, name: "ArcJet", logo: '/arcjet.jpg' },
  { id: 3, name: "Inngest", logo: '/inngest-locale.png' },
];

const testimonials = [
  {
    quote: "We found our ideal candidate within 48 hours of posting. The quality of applicants was exceptional!",
    author: "Sarah Chen",
    company: "TechCorp",
  },
  {
    quote: "The platform made hiring remote talent incredibly simple. Highly recommended!",
    author: "Mark Johnson",
    company: "StartupX",
  },
];

const stats = [
  { value: "10k+", label: "Monthly active job seekers" },
  { value: "48h", label: "Average time to hire" },
  { value: "95%", label: "Satisfaction rate" },
  { value: "500+", label: "Companies" },
];

export default async function PostJobPage() {
  const session = await requireUser('COMPANY');
  const data = await getCompany(session.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CreateJobForm
            companyName={data.name}
            companyLocation={data.location}
            companyAbout={data.about}
            companyLogo={data.logo}
            companyWebsite={data.website}
            companySocialMediaLinks={data.socialMediaLinks}
            companySize={data.size}
            companyIndustry={data.industry}
          />
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-xl font-semibold">
                Trusted by Industry Leaders
              </CardTitle>
              <CardDescription className="text-sm">
                Join thousands of companies hiring top talent
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              {companies.map((company) => (
                <div
                  key={company.id}
                  className="flex items-center justify-center"
                >
                  <Image
                    src={company.logo}
                    alt={company.name}
                    height={80}
                    width={80}
                    className="opacity-75 transition-opacity hover:opacity-100 rounded-lg"
                  />{" "}
                </div>
              ))}
            </div>
              <div className="space-y-4">
                {testimonials.map((testimonial, index) => (
                  <blockquote
                    key={index}
                    className="border-l-2 border-primary pl-3 py-1"
                  >
                    <p className="text-sm text-muted-foreground">
                      "{testimonial.quote}"
                    </p>
                    <footer className="mt-1 text-xs font-medium">
                      {testimonial.author}, {testimonial.company}
                    </footer>
                  </blockquote>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3">
                {stats.map((stat, index) => (
                  <div key={index} className="p-3 bg-muted rounded-lg">
                    <div className="text-lg font-semibold">{stat.value}</div>
                    <div className="text-xs text-muted-foreground">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
