"use client";

import Sidebar from "@/components/Sidebar";
import TopHeader from "@/components/TopHeader";

interface DashboardLayoutProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
}

export default function DashboardLayout({ children, isOpen, onClose }: DashboardLayoutProps) {
    return (
        <>
            <Sidebar isOpen={isOpen} onClose={onClose} />
            {isOpen && <TopHeader onClose={onClose} />}
            <main
                className={`relative pt-12 transition-all duration-300 ${
                isOpen ? "pl-64" : "pl-0"
                }`}
            >
                {children}
            </main>
        </>
    );
}
