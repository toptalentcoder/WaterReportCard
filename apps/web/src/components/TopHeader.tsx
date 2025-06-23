"use client";

import React from "react";

interface TopHeaderProps {
  onClose: () => void;
}

export default function TopHeader({ onClose }: TopHeaderProps) {
    return (
        <header className="absolute top-0 left-0 w-full bg-[#0B4C94] h-12 flex items-center justify-between px-4 text-white z-50 shadow-md">
            <span className="font-bold">Customer Name Here: LivingWaters SoCal</span>
            <button
                className="p-2 hover:bg-blue-700 rounded"
                onClick={onClose}
                aria-label="Close Dashboard"
            >
                ✕ Close
            </button>
        </header>
    );
}
