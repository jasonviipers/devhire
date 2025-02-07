"use client";

import { AnimatePresence, motion, useInView } from "framer-motion";
import React from "react";

export default function IntroText() {
    const ref = React.useRef(null);
    const isInView = useInView(ref);

    const FADE_DOWN_ANIMATION_VARIANTS = {
        hidden: { opacity: 0, y: -10 },
        show: { opacity: 1, y: 0, transition: { type: "spring" } },
    };
    return (
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
                <motion.div
                    initial="hidden"
                    ref={ref}
                    animate={isInView ? "show" : "hidden"}
                    viewport={{ once: true }}
                    variants={{
                        hidden: {},
                        show: {
                            transition: {
                                staggerChildren: 0.15,
                            },
                        },
                    }}
                >
                    <motion.h1
                        variants={FADE_DOWN_ANIMATION_VARIANTS}
                        className="text-4xl font-bold tracking-tight sm:text-6xl"
                    >
                        Find your dream job today
                    </motion.h1>
                    <motion.p
                        variants={FADE_DOWN_ANIMATION_VARIANTS}
                        className="mt-6 text-lg leading-8"
                    >
                        Browse through thousands of job opportunities from top companies worldwide.
                        Your next career move is just a click away.
                    </motion.p>

                    {/* <motion.div
                        variants={FADE_DOWN_ANIMATION_VARIANTS}
                        className="mt-10 flex items-center justify-center gap-x-6 "
                    >
                        <Link href="/jobs" className={cn(buttonVariants({ variant: "default" }))}>
                            Find Jobs
                        </Link>
                        <Link href="/companies" className={cn(buttonVariants({ variant: "outline" }))}>
                            Find Companies
                        </Link>
                    </motion.div> */}
                </motion.div>
            </div>

            <div className="mt-16 flow-root sm:mt-24">
                <motion.div
                    className="rounded-md"
                    initial={{ y: 100, opacity: 0 }} 
                    animate={{ y: 0, opacity: 1 }} 
                    transition={{ type: "spring", stiffness: 50, damping: 20 }} 
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.25 }}
                        >
                        </motion.div>
                    </AnimatePresence>
                </motion.div>
            </div>
        </div>
    );
}