import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

interface BrandLogoProps {
    className?: string;
}

export const BrandLogo = ({ className }: BrandLogoProps) => (
    <Link href="/" className={cn("flex items-center gap-2", className)}>
        <Image
            src="/logo.png"
            alt="DevHire Logo"
            width={100}
            height={100}
            className="w-12 h-12"
            priority
        />
        <span className="text-lg font-bold">
            Dev<span className="text-primary">Hire</span>
        </span>
    </Link>
);