"use client";

export default function Sidebar({ isOpen, onClose }: {isOpen: boolean; onClose: () => void}) {
    return (
        <aside
        className={`absolute left-0 top-0 h-full bg-[#0B4C94] text-white shadow-lg transition-all duration-300 ease-in-out ${
            isOpen ? "w-64 opacity-100" : "w-0 opacity-0"
        } overflow-hidden z-50`}
        >
        <div className="p-4 font-bold">LiquosLabs</div>
        <nav className="flex flex-col p-2">
            <button className="bg-[#2575D2] text-white p-2 mb-2 rounded">Customer Listing</button>
            <div className="mt-4 text-xs uppercase opacity-70">Active Alerts</div>
            {/* Alerts list */}
            <div className="flex items-center mt-2">Google <span className="ml-auto">🟢</span></div>
            <div className="flex items-center mt-2">Pinterest <span className="ml-auto">🟠</span></div>
            <div className="flex items-center mt-2">Figma <span className="ml-auto">🟠</span></div>
        </nav>
        </aside>
    );
}
