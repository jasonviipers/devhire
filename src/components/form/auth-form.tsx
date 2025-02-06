'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import * as React from "react";
import { GeneralSubmitButton } from "../global/submit-buttons";
import { Github, Google } from "../global/auth-icons";
import { signIn } from "@/server/auth/auth-client";
import { toast } from "sonner";


export function AuthForm() {
  const handleAuth = async (provider: 'github' | 'google') => {
    try {
      await signIn.social({
        provider: provider,
        fetchOptions: {
          onError: (error) => {
           console.log("Error signing in:", error);
          },
          onSuccess: () => {
            toast.success("Signed in successfully");
          },
        },
        callbackURL: "/onboarding",
      })
    } catch (error) {
      console.error("Error signing in:", error);
    }
  }
  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>
            Login with your preferred account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="flex flex-col gap-4">
              <GeneralSubmitButton
                text="Login with GitHub"
                icon={<Github />}
                variant="outline"
                width="w-full"
                onClick={() => handleAuth('github')}
              />

              <GeneralSubmitButton
                text="Login with Google"
                icon={<Google />}
                variant="outline"
                width="w-full"
                onClick={() => handleAuth('google')}
              />
            </div>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
