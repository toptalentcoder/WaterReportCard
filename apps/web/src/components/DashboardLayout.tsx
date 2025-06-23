"use client";

import Sidebar from "@/components/Sidebar";
import TopHeader from "@/components/TopHeader";

interface DashboardLayoutProps {
    children: React.ReactNode;
    isOpen: boolean;
    onClose: () => void;
    map: mapboxgl.Map | null;
    mapboxToken: string;
}
  
export default function DashboardLayout({
    children,
    isOpen,
    onClose,
    map,
    mapboxToken,
}: DashboardLayoutProps) {
    return (
        <>
            <Sidebar isOpen={isOpen} onClose={onClose} />
            {isOpen && <TopHeader onClose={onClose} map={map} mapboxToken={mapboxToken} />}
            <main
                className={`relative pt-12 transition-all duration-300 ${
                isOpen ? "ml-1/6" : "pl-0"
                }`}
            >
                {children}
            </main>
        </>
    );
}
