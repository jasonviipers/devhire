import { headers } from "next/headers";
import { env } from "@/env";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/server/db";

// Track processed events for idempotency
const processedEvents = new Set<string>();

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();

  try {
    // Verify request origin
    const origin = headersList.get("origin");
    if (origin && !origin.includes(env.NEXT_PUBLIC_URL)) {
      console.warn("[SECURITY] Invalid origin:", origin);
      return new Response("Unauthorized", { status: 403 });
    }

    const signature = headersList.get("stripe-signature")!;
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      env.STRIPE_WEBHOOK_SECRET
    );

    // Idempotency check
    if (processedEvents.has(event.id)) {
      return NextResponse.json({ received: true });
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const customerId = session.customer as string;
      const { jobId, userId } = session.metadata || {};

      // Validate metadata
      if (!jobId || !userId) {
        console.error("Missing metadata in session:", session.metadata);
        return new Response("Invalid metadata", { status: 400 });
      }

      // Atomic transaction for data consistency
      await prisma.$transaction(async (tx) => {
        const user = await tx.user.findUnique({
          where: { stripeCustomerId: customerId },
          include: { Company: true }
        });

        if (!user?.Company) {
          throw new Error("User or company not found");
        }

        // Validate job ownership
        const updatedJob = await tx.jobPost.update({
          where: {
            id: jobId,
            companyId: user.Company.id,
            status: "DRAFT"
          },
          data: { status: "ACTIVE" }
        });

        if (!updatedJob) {
          throw new Error(`Job post ${jobId} not found or already active`);
        }
      });

      processedEvents.add(event.id);
    }

    return NextResponse.json({ received: true });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("Webhook error:", err);
      return new Response(`Webhook Error: ${err.message}`, { status: 400 });
    } else {
      console.error("Unknown error:", err);
      return new Response("Unknown Error", { status: 500 });
    }
  }
}