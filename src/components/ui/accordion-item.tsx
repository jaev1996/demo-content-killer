"use client";

import * as React from "react";
import { IconChevronDown } from "@tabler/icons-react";

export function AccordionItem({ title, children, isInitiallyOpen = false }: { title: string, children: React.ReactNode, isInitiallyOpen?: boolean }) {
    const [isOpen, setIsOpen] = React.useState(isInitiallyOpen);

    return (
        <div className={`bg-black/95 rounded-lg border ${isOpen ? 'border-red-600' : 'border-gray-800'}`}>
            <button
                className="accordion-header flex justify-between items-center w-full p-6 text-left"
                onClick={() => setIsOpen(!isOpen)}
            >
                <h3 className={`transition-colors ${isOpen ? 'text-xl font-bold text-red-600' : 'text-lg font-semibold text-white'}`}>
                    {title}
                </h3>
                <IconChevronDown className={`text-red-600 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <div
                className="accordion-content"
                style={{ maxHeight: isOpen ? '500px' : '0' }} // Use a fixed large value
            >
                <div className="p-6 pt-0 text-gray-400">
                    {children}
                </div>
            </div>
        </div>
    );
}
