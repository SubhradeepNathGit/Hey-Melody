"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface Option {
    value: string;
    label: string;
}

interface CustomDropdownProps {
    options: Option[];
    value: string;
    onChange: (value: string) => void;
    label?: string;
    className?: string;
}

export default function CustomDropdown({
    options,
    value,
    onChange,
    label,
    className = "",
}: CustomDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find((opt) => opt.value === value);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            {label && (
                <p className="text-xs uppercase tracking-wider text-zinc-400 mb-2 font-semibold px-1">
                    {label}
                </p>
            )}

            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`
          flex items-center justify-between
          w-full h-10 sm:h-11 rounded-xl 
          bg-black/40 border border-white/10 px-4
          text-sm text-zinc-200 
          transition-all duration-200
          hover:bg-white/5 hover:border-white/20
          focus:outline-none focus:ring-2 focus:ring-cyan-500/30
          ${isOpen ? "ring-2 ring-cyan-500/50 border-cyan-500/50" : ""}
        `}
            >
                <span className="truncate">{selectedOption?.label || "Select..."}</span>
                <ChevronDown
                    className={`w-4 h-4 text-zinc-400 transition-transform duration-300 ${isOpen ? "rotate-180 text-cyan-400" : ""}`}
                />
            </button>

            {/* Options Dropdown */}
            <div
                className={`
          absolute left-0 right-0 mt-2 z-50
          bg-zinc-900/95 backdrop-blur-xl
          border border-white/10 rounded-xl
          shadow-2xl overflow-hidden
          transition-all duration-200 origin-top
          ${isOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-2 pointer-events-none"}
        `}
            >
                <div className="p-1.5 space-y-1">
                    {options.map((option, idx) => (
                        <button
                            key={`${option.value}-${idx}`}
                            type="button"
                            onClick={() => {
                                onChange(option.value);
                                setIsOpen(false);
                            }}
                            className={`
                w-full text-left px-3 py-2.5 rounded-lg text-sm
                transition-all duration-150
                ${value === option.value
                                    ? "bg-cyan-500/20 text-cyan-300 font-medium"
                                    : "text-zinc-400 hover:bg-white/5 hover:text-white"
                                }
              `}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
