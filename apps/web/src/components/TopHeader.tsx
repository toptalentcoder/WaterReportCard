"use client";

import Image from "next/image";
import React from "react";

interface TopHeaderProps {
  onClose: () => void;
}

export default function TopHeader({ onClose }: TopHeaderProps) {
    return (
        <header className="absolute top-0 left-0 w-full bg-[#091223] h-12 flex items-center justify-between px-4 text-white z-50">

            <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={onClose}
            >
                <Image
                    src="/liquos-logo.png"
                    alt="Hero image"
                    width={32}
                    height={32}
                    className="h-7 w-auto"
                />
                <span className="text-white font-bold">Liquos Labs</span>
            </div>

            <span className="font-bold">Alex Li</span>
        </header>
    );
}
