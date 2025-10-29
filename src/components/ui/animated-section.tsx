"use client";

import { motion, useInView } from "framer-motion";
import * as React from "react";

export function AnimatedSection({ children, className = "", id }: { children: React.ReactNode, className?: string, id?: string }) {
    const ref = React.useRef(null);
    const inView = useInView(ref, { once: true, amount: 0.2 });

    return (
        <motion.section
            ref={ref}
            id={id}
            className={className}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            variants={{
                visible: { transition: { staggerChildren: 0.2 } }
            }}
        >
            {children}
        </motion.section>
    );
}
