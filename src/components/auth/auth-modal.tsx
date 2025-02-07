"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Github, Google } from "../global/auth-icons";
import { GeneralSubmitButton } from "../global/submit-buttons";
import { useAuthStore } from "@/lib/store/useAuthStore";

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    description?: string;
}

export function AuthModal({
    isOpen,
    onClose,
    title = "Sign in to continue",
    description = "Choose your preferred sign in method to apply for jobs and access AI matching features.",
}: AuthModalProps) {
    const { socialLogin } = useAuthStore();

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-center text-2xl">{title}</DialogTitle>
                    <DialogDescription className="text-center">
                        {description}
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-4 py-4">
                    <GeneralSubmitButton
                        text="Login with GitHub"
                        icon={<Github />}
                        variant="outline"
                        width="w-full"
                        onClick={() => socialLogin("github")}
                    />

                    <GeneralSubmitButton
                        text="Login with Google"
                        icon={<Google />}
                        variant="outline"
                        width="w-full"
                        onClick={() => socialLogin("google")}
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}