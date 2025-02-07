"use client";

import React, { useState, JSX } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Building, LucideIcon, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BrandLogo } from '@/components/global/brand-logo';
import CompanyForm from './company-form';
import JobSeekerForm from './jobSeeker-form';


type UserType = "COMPANY" | "JOB_SEEKER" | null;

interface UserTypeCardProps {
  type: Exclude<UserType, null>;
  title: string;
  description: string;
  icon: LucideIcon | ((props: { className?: string }) => JSX.Element);
}

const OnboardingForm = () => {
  const [step, setStep] = useState<number>(1);
  const [userType, setUserType] = useState<UserType>(null);

  const handleUserTypeSelect = (type: Exclude<UserType, null>) => {
    setUserType(type);
    setStep(2);
  };

  const goBack = () => {
    if (step > 1) {
      setStep(step - 1);
      if (step === 2) setUserType(null);
    }
  };

  const UserTypeCard: React.FC<UserTypeCardProps> = ({ type, title, description, icon: Icon }) => (
    <button
      onClick={() => handleUserTypeSelect(type)}
      className="w-full p-6 rounded-lg border border-border hover:border-primary transition-all duration-200 bg-card text-left group"
      type="button"
    >
      <div className="flex items-start gap-4">
        <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
          <Icon />
        </div>
        <div className="space-y-1">
          <h3 className="font-semibold text-lg">{title}</h3>
          <p className="text-muted-foreground text-sm">{description}</p>
        </div>
      </div>
    </button>
  );

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <CardHeader className="p-0">
              <CardTitle className="text-2xl font-bold">Welcome to DevHire</CardTitle>
              <CardDescription>Choose how you want to use the platform</CardDescription>
            </CardHeader>
            <div className="grid gap-4">
              <UserTypeCard
                type="COMPANY"
                title="I'm hiring"
                description="Post jobs and find the perfect candidate for your company"
                icon={Building}
              />
              <UserTypeCard
                type="JOB_SEEKER"
                title="I'm looking for work"
                description="Browse jobs and find your next opportunity"
                icon={User}
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={goBack}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <h2 className="text-2xl font-bold">
                  {userType === 'COMPANY' ? 'Company Profile' : 'Personal Profile'}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {userType === 'COMPANY'
                    ? 'Tell us about your company'
                    : 'Tell us about yourself'}
                </p>
              </div>
            </div>
            <Separator />
            {userType === 'COMPANY' ? <CompanyForm /> : <JobSeekerForm />}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen w-full py-10 px-4 flex flex-col items-center justify-center">
      <div className="w-full max-w-2xl space-y-8">
        <div className="flex flex-col items-center gap-2">
          <BrandLogo />
          <Progress value={(step / 2) * 100} className="w-full max-w-md h-1" />
        </div>
        <Card>
          <CardContent className="p-6">{renderStep()}</CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OnboardingForm;