import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import { createMetadata } from "@/lib/metadata";
import { Providers } from "@/provider/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = createMetadata({
  title: {
    template: '%s | DevHire',
    default: 'DevHire - Find Your Next Career Opportunity',
  },
  description: 'Find and apply to the best job opportunities in your field.',
  applicationName: 'DevHire',
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
