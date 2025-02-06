import { env } from '@/env';
import { prisma } from '@/server/db';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from "better-auth/adapters/prisma";

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: 'postgresql',
    }),
    account: {
        accountLinking: {
            trustedProviders: ["google", "github"],
        },
    },
    socialProviders: {
        github: {
            clientId: env.AUTH_GITHUB_ID,
            clientSecret: env.AUTH_GITHUB_SECRET,
        },
        google: {
            clientId: env.AUTH_GOOGLE_CLIENT_ID,
            clientSecret: env.AUTH_GOOGLE_CLIENT_SECRET,
        },
    },
    session: {
        expiresIn: 60 * 60 * 12, // Reduced to 12 hours
        updateAge: 60 * 60 * 2, // Update session every 2 hours
        freshAge: 60 * 60 * 24, // Refresh session every 24 hours
        cookieCache:{
            enabled: true,
            maxAge: 60 * 60 * 24 * 30, 
        }
    },
    rateLimit: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 50, // Reduced to 50 requests per windowMs
        
    },
})
