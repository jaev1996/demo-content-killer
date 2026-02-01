"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const logos = [
    { id: 1, src: "/images/insta-150x150.webp", size: 80, x: "-30%", y: "-25%", blur: 0, depth: 1, delay: 0.1 },
    { id: 2, src: "/images/facebook-150x150.webp", size: 60, x: "28%", y: "-35%", blur: 4, depth: 0.7, delay: 0.4 },
    { id: 3, src: "/images/google-150x150.webp", size: 70, x: "-25%", y: "25%", blur: 1, depth: 0.9, delay: 0.2 },
    { id: 4, src: "/images/reddit-150x150.webp", size: 90, x: "25%", y: "20%", blur: 0, depth: 1.1, delay: 0.5 },
    { id: 5, src: "/images/tt-150x150.webp", size: 65, x: "-15%", y: "-38%", blur: 2, depth: 0.8, delay: 0.3 },
    { id: 6, src: "/images/dsc-150x150.webp", size: 55, x: "35%", y: "5%", blur: 5, depth: 0.6, delay: 0.6 },
    { id: 7, src: "/images/sc.png", size: 75, x: "18%", y: "-15%", blur: 3, depth: 0.75, delay: 0.7 },
    { id: 8, src: "/images/insta-150x150.webp", size: 50, x: "40%", y: "-30%", blur: 6, depth: 0.5, delay: 0.8 },
    { id: 9, src: "/images/reddit-150x150.webp", size: 45, x: "-35%", y: "-15%", blur: 7, depth: 0.4, delay: 0.9 },
    { id: 10, src: "/images/tt-150x150.webp", size: 55, x: "10%", y: "35%", blur: 4, depth: 0.65, delay: 1.0 },
    { id: 11, src: "/images/google-150x150.webp", size: 40, x: "-10%", y: "-45%", blur: 8, depth: 0.3, delay: 1.1 },
];

export function ScanSection() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isMounted, setIsMounted] = useState(false);
    const [hoveredId, setHoveredId] = useState<number | null>(null);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"],
    });

    const titleY = useTransform(scrollYProgress, [0, 1], [50, -50]);

    return (
        <section
            ref={containerRef}
            className="relative w-full py-32 md:py-48 overflow-hidden bg-background flex items-center justify-center min-h-[700px]"
        >
            {/* Background radial gradient */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.04)_0%,transparent_70%)] dark:bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.08)_0%,transparent_70%)] pointer-events-none" />

            {/* Floating Logos Cloud */}
            <div className="absolute inset-0 w-full h-full flex items-center justify-center overflow-visible pointer-events-none">
                {logos.map((logo, index) => (
                    <motion.div
                        key={logo.id}
                        className="absolute pointer-events-auto cursor-pointer flex items-center justify-center"
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{
                            duration: 0.8,
                            delay: logo.delay,
                            type: "spring",
                            stiffness: 100
                        }}
                        style={{
                            left: `calc(50% + ${logo.x})`,
                            top: `calc(50% + ${logo.y})`,
                            filter: `blur(${logo.blur}px)`,
                            zIndex: Math.floor(logo.depth * 10),
                        }}
                        onMouseEnter={() => setHoveredId(logo.id)}
                        onMouseLeave={() => setHoveredId(null)}
                    >
                        <motion.div
                            animate={isMounted ? {
                                y: [0, -15, 0],
                                x: [0, 10, 0],
                                rotate: [0, 5, -5, 0],
                            } : {}}
                            transition={{
                                duration: 4 + (index % 3),
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                            className="relative transition-all duration-300"
                            style={{
                                width: logo.size,
                                height: logo.size,
                                opacity: hoveredId === null || hoveredId === logo.id ? 1 : 0.4,
                                scale: hoveredId === logo.id ? 1.2 : 1,
                            }}
                        >
                            <Image
                                src={logo.src}
                                alt={`Platform logo ${logo.id}`}
                                fill
                                className="object-contain drop-shadow-2xl"
                            />
                        </motion.div>
                    </motion.div>
                ))}
            </div>

            {/* Central Content */}
            <motion.div
                style={{ y: titleY }}
                className="relative z-10 text-center space-y-6 px-4 py-12 rounded-full"
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    className="space-y-2"
                >
                    <motion.h2
                        className="text-5xl md:text-8xl font-black text-foreground tracking-tighter leading-[0.85] uppercase transition-colors"
                    >
                        GLOBAL SCAN & <br />
                        <span className="text-red-600 dark:text-red-500">INSTANT TAKEDOWN</span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-2xl md:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500 dark:from-purple-400 dark:to-pink-400 italic tracking-tight"
                    >
                        Secure & Anonymous Protection
                    </motion.p>
                </motion.div>

                <div className="relative h-1 w-64 md:w-96 mx-auto mt-8 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                        animate={{ x: ["-100%", "100%"] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 w-32 bg-gradient-to-r from-transparent via-red-500 to-transparent blur-[2px]"
                    />
                </div>
            </motion.div>

            {/* Partículas solo en cliente */}
            {isMounted && (
                <div className="absolute inset-0 pointer-events-none">
                    {[...Array(6)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute rounded-full bg-red-500/5 dark:bg-red-600/20"
                            style={{
                                width: 100 + (i * 50),
                                height: 100 + (i * 30),
                                left: `${(i * 17) % 100}%`,
                                top: `${(i * 23) % 100}%`,
                                filter: "blur(80px)",
                            }}
                            animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.1, 0.2, 0.1],
                            }}
                            transition={{
                                duration: 10 + i * 2,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}
