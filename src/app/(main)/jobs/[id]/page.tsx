import { use } from "react";
import JobDetails from "@/components/job/job-details";

type JobPageProps = {
  params: Promise<{ id: string }>;
};

export default function JobPage({ params }: JobPageProps) {
  const { id } = use(params);
  return <JobDetails id={id} />;
}

