import OnboardingForm from '@/components/onboarding-form';
import { Card } from '@/components/ui/card';

export default function OnboardingPage() {
  return (
    <main className="container flex min-h-screen items-center justify-center py-12">
      <div className="w-full max-w-2xl">
        <OnboardingForm />
      </div>
    </main>
  );
}
