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
    // La línea "Sin Protección" es más plana y baja.
    const withoutPath = "M0,80 C50,85 100,75 150,80 C200,85 250,75 300,80";

    // La línea "Con PrivaClean" es ascendente.
    const withPath = "M0,80 C50,70 100,75 150,50 C200,25 250,30 300,10";

    return (
        <div className="bg-gray-900/50 p-8 rounded-lg border border-gray-800 w-full max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 items-center">
                {/* Columna de Texto */}
                <div className="md:col-span-1 text-center md:text-left">
                    <h3 className="text-2xl md:text-3xl font-bold text-white">{t('valuePropositionTitle')}</h3>
                    <p className="mt-3 text-gray-400">{t('valuePropositionDescription')}</p>
                    <div className="flex justify-center md:justify-start gap-6 mt-8">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                            <span className="text-sm text-gray-400 font-medium">{t('withoutLabel')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-600"></div>
                            <span className="text-sm text-white font-bold">{t('withLabel')}</span>
                        </div>
                    </div>
                </div>

                {/* Columna del Gráfico */}
                <div className="md:col-span-2 relative h-56 md:h-80">
                    <svg width="100%" height="100%" viewBox="0 0 350 120" preserveAspectRatio="none" className="absolute top-0 left-0" overflow="visible">
                        {/* Eje Y (Ingresos) */}
                        <text x="30" y="10" textAnchor="end" fill="rgb(156 163 175)" fontSize="10">$15k</text>
                        <line x1="35" y1="10" x2="345" y2="10" stroke="rgb(55 65 81)" strokeWidth="0.5" strokeDasharray="2,2" />
                        <text x="30" y="80" textAnchor="end" fill="rgb(156 163 175)" fontSize="10">$5k</text>
                        <line x1="35" y1="80" x2="345" y2="80" stroke="rgb(55 65 81)" strokeWidth="0.5" strokeDasharray="2,2" />

                        <g transform="translate(40, 0)">
                            {/* Area y línea "Sin Protección" */}
                            <defs>
                                <linearGradient id="gradient-without" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="rgb(100 116 139 / 0.4)" />
                                    <stop offset="100%" stopColor="rgb(100 116 139 / 0)" />
                                </linearGradient>
                            </defs>
                            <motion.path d={`${withoutPath} L300,100 L0,100 Z`} fill="url(#gradient-without)" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 1, delay: 1 }} />
                            <motion.path d={withoutPath} fill="none" stroke="rgb(100 116 139)" strokeWidth="1.5" variants={pathVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.5 }} transition={{ delay: 0.5, ...pathVariants.visible?.transition }} />

                            {/* Area y línea "Con PrivaClean" */}
                            <defs>
                                <linearGradient id="gradient-with" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="rgb(220 38 38 / 0.5)" />
                                    <stop offset="100%" stopColor="rgb(220 38 38 / 0)" />
                                </linearGradient>
                            </defs>
                            <motion.path d={`${withPath} L300,100 L0,100 Z`} fill="url(#gradient-with)" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 1, delay: 0.5 }} />
                            <motion.path d={withPath} fill="none" stroke="#DC2626" strokeWidth="2" variants={pathVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.5 }} />

                            {/* Tooltips en los picos (coordenadas ajustadas) */}
                            <TooltipCircle cx={280} cy={80} label="Estancado" value="-15" color="rgb(100 116 139)" />
                            <TooltipCircle cx={280} cy={10} label="Ganancia" value="+45" color="#DC2626" />
                        </g>

                        {/* Eje X (Tiempo) */}
                        <text x="40" y="115" textAnchor="middle" fill="rgb(156 163 175)" fontSize="10">{t('axisXStart')}</text>
                        <text x="190" y="115" textAnchor="middle" fill="rgb(156 163 175)" fontSize="10">{t('axisXMid')}</text>
                        <text x="340" y="115" textAnchor="middle" fill="rgb(156 163 175)" fontSize="10">{t('axisXEnd')}</text>
                    </svg>
                </div>
            </div>
        </div>
    );
}