import Link from 'next/link'
import React from 'react'
import { BrandLogo } from './brand-logo'

export function Footer() {
    return (
        <footer className="border-t bg-background">
            <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                <div className="flex items-center gap-2">
                   <BrandLogo />
                    <span className="text-sm text-muted-foreground ml-4">
                        © {new Date().getFullYear()} All rights reserved
                    </span>
                </div>

                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <Link href="/privacy" className="hover:text-foreground transition-colors">
                        Privacy Policy
                    </Link>
                    <Link href="/terms" className="hover:text-foreground transition-colors">
                        Terms of Service
                    </Link>
                    <Link href="/contact" className="hover:text-foreground transition-colors">
                        Contact Us
                    </Link>
                </div>
            </div>
        </footer>
    )
}
