"use client";

import { motion, Variants, useMotionValue, useTransform, animate } from "framer-motion";
import * as React from "react";
import { useTranslations } from "next-intl";

const pathVariants: Variants = {
    hidden: {
        pathLength: 0,
        opacity: 0,
    },
    visible: {
        pathLength: 1,
        opacity: 1,
        transition: {
            duration: 2,
            ease: "easeInOut",
        },
    },
};

const circleVariants: Variants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
        scale: 1,
        opacity: 1,
        transition: { duration: 0.5, delay: 1.5 },
    },
};

function TooltipCircle({ cx, cy, label, value, color }: { cx: number, cy: number, label: string, value: string, color: string }) {
    const [isHovered, setIsHovered] = React.useState(false);
    const numericValue = React.useMemo(() => parseFloat(value.replace('%', '')), [value]);
    const count = useMotionValue(0);
    const rounded = useTransform(count, (latest) => Math.round(latest));
    const displayText = useTransform(rounded, (latest) => `${numericValue > 0 ? '+' : ''}${latest}%`);

    React.useEffect(() => {
        const controls = animate(count, isHovered ? numericValue : 0, {
            duration: isHovered ? 0.5 : 0.2,
            ease: "easeOut"
        });
        return controls.stop;
    }, [isHovered, numericValue, count]);

    const isNearTop = cy < 40;
    const tooltipY = isNearTop ? cy + 12 : cy - 42;

    return (
        <g onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
            <motion.circle
                cx={cx}
                cy={cy}
                r="5"
                fill={color}
                stroke="rgba(0,0,0,0.5)"
                strokeWidth="2"
                variants={circleVariants}
                initial="hidden"
                whileInView="visible"
                whileHover={{ scale: 1.2 }}
                viewport={{ once: true, amount: 0.8 }}
            />
            <motion.g
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : -10 }}
                transition={{ duration: 0.2 }}
                style={{ pointerEvents: 'none' }}
            >
                <rect x={cx - 40} y={tooltipY} width="80" height="32" rx="5" fill="black" stroke={color} strokeWidth="1" />
                <text x={cx} y={tooltipY + 13} textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">{label}</text>
                <motion.text x={cx} y={tooltipY + 26} textAnchor="middle" fill="white" fontSize="10">{displayText}</motion.text>
            </motion.g>
        </g>
    );
}

export function EarningsChart() {
    const t = useTranslations("LandingPage.earnings");

    // Definimos los puntos para las líneas del gráfico.
    // "M" es mover a, "C" es curva cúbica de Bézier.
    // La línea "Sin Protección" es más plana y baja. (Coordenadas Y más altas = más bajo en el gráfico)
    const withoutPath = "M0,90 C50,95 100,85 150,90 C200,95 250,85 300,90";

    // La línea "Con PrivaClean" es ascendente. (Coordenadas Y más bajas = más alto en el gráfico)
    const withPath = "M0,90 C50,80 100,85 150,60 C200,35 250,40 300,10";

    return (
        <div className="bg-card text-card-foreground p-8 rounded-lg border border-border w-full max-w-6xl mx-auto">
            <div className="relative">
                <div className="relative h-64 md:h-96">
                    <svg width="100%" height="100%" viewBox="0 0 350 140" preserveAspectRatio="none" className="absolute top-0 left-0" overflow="visible">
                        {/* Eje Y (Ingresos) */}
                        <text x="30" y="10" textAnchor="end" fill="rgb(156 163 175)" fontSize="10">€20k</text>
                        <line x1="35" y1="10" x2="345" y2="10" stroke="rgb(55 65 81)" strokeWidth="0.5" strokeDasharray="2,2" />
                        <text x="30" y="37" textAnchor="end" fill="rgb(156 163 175)" fontSize="10">€15k</text>
                        <line x1="35" y1="37" x2="345" y2="37" stroke="rgb(55 65 81)" strokeWidth="0.5" strokeDasharray="2,2" />
                        <text x="30" y="64" textAnchor="end" fill="rgb(156 163 175)" fontSize="10">€10k</text>
                        <line x1="35" y1="64" x2="345" y2="64" stroke="rgb(55 65 81)" strokeWidth="0.5" strokeDasharray="2,2" />
                        <text x="30" y="90" textAnchor="end" fill="rgb(156 163 175)" fontSize="10">€5k</text>
                        <line x1="35" y1="90" x2="345" y2="90" stroke="rgb(55 65 81)" strokeWidth="0.5" strokeDasharray="2,2" />

                        <g transform="translate(40, 0)">
                            {/* Area y línea "Sin Protección" */}
                            <defs>
                                <linearGradient id="gradient-without" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="rgb(100 116 139 / 0.4)" />
                                    <stop offset="100%" stopColor="rgb(100 116 139 / 0.05)" />
                                </linearGradient>
                            </defs>
                            <motion.path d={`${withoutPath} L300,110 L0,110 Z`} fill="url(#gradient-without)" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 1, delay: 1 }} />
                            <motion.path d={withoutPath} fill="none" stroke="rgb(100 116 139)" strokeWidth="1.5" variants={pathVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.5 }} transition={{ delay: 0.5 }} />

                            {/* Area y línea "Con PrivaClean" */}
                            <defs>
                                <linearGradient id="gradient-with" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="rgb(220 38 38 / 0.5)" />
                                    <stop offset="100%" stopColor="rgb(220 38 38 / 0.05)" />
                                </linearGradient>
                            </defs>
                            <motion.path d={`${withPath} L300,110 L0,110 Z`} fill="url(#gradient-with)" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 1, delay: 0.5 }} />
                            <motion.path d={withPath} fill="none" stroke="#DC2626" strokeWidth="2" variants={pathVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.5 }} />

                            {/* Tooltips en los picos (coordenadas ajustadas) */}
                            <TooltipCircle cx={280} cy={89} label="Estancado" value="-15" color="rgb(100 116 139)" />
                            <TooltipCircle cx={280} cy={19} label="Ganancia" value="+45" color="#DC2626" />
                        </g>

                        {/* Eje X (Tiempo) */}
                        <text x="40" y="125" textAnchor="middle" fill="rgb(156 163 175)" fontSize="10">{t('axisXStart')}</text>
                        <text x="190" y="125" textAnchor="middle" fill="rgb(156 163 175)" fontSize="10">{t('axisXMid')}</text>
                        <text x="340" y="125" textAnchor="middle" fill="rgb(156 163 175)" fontSize="10">{t('axisXEnd')}</text>
                    </svg>
                </div>
                <div className="flex justify-center md:justify-start gap-6 mt-4">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-muted-foreground"></div>
                        <span className="text-sm text-muted-foreground font-medium">{t('withoutLabel')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-600"></div>
                        <span className="text-sm text-foreground font-bold">{t('withLabel')}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}