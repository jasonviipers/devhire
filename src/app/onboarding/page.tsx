import OnboardingForm from '@/components/form/onboarding-form';
import { requireUser } from '@/hooks/useRequireUser';
import { prisma } from '@/server/db';
import { redirect } from 'next/navigation';

export default async function OnboardingPage() {
  const user = await requireUser()
  await checkIfOnboardingCompleted(user.id);
  console.log(user)
  return (
    <div className="min-h-screen w-screen py-10 flex flex-col items-center justify-center">
      <OnboardingForm />
    </div>
  )
}

async function checkIfOnboardingCompleted(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      onboardingCompleted: true,
    },
  });

  if (user?.onboardingCompleted === true) {
    redirect("/");
  }
}
