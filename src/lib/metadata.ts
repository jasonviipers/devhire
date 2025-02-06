import { env } from "@/env";
import type { Metadata } from "next/types";

export function createMetadata(override: Metadata): Metadata {
    return {
        ...override,
        openGraph: {
            title: override.title ?? undefined,
            description: override.description ?? undefined,
            siteName:'DevHire',
            url: env.NEXT_PUBLIC_URL,
            images: [
                {
                    url: env.NEXT_PUBLIC_URL + "/favicon.ico",
                    width: 800,
                    height: 600,
                    alt: "DevHire Logo",
                },
            ],
            ...override.openGraph,
        },
        twitter: {
            card: "summary_large_image",
            title: override.title ?? undefined,
            description: override.description ?? undefined,
            images: [
                {
                    url: env.NEXT_PUBLIC_URL + "/favicon.ico",
                    width: 800,
                    height: 600,
                    alt: "DevHire Logo",
                },
            ],
            ...override.twitter,
        },
    }
}