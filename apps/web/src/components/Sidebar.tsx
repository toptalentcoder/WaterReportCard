"use client";

export default function Sidebar({ isOpen, onClose }: {isOpen: boolean; onClose: () => void}) {
    return (
        <aside
            className={`absolute left-0 top-0 min-h-full bg-[#091223] text-white transition-all duration-300 ease-in-out ${
                isOpen ? "w-1/6 opacity-100" : "w-0 opacity-0"
            } overflow-hidden z-50`}
        >
            <div className="p-4 font-bold h-12">LiquosLabs</div>
            <nav className="flex flex-col p-2">
                <button className="bg-[#2575D2] text-white p-2 mb-2 rounded text-sm">Customer Listing</button>

                <hr className="text-gray-100 mt-5 mb-3"/>
                <div className="mt-4 text-xs uppercase opacity-70">Active Alerts</div>
                {/* Alerts list */}
                <div className="flex items-center mt-2 text-sm">Google <span className="ml-auto">🟢</span></div>
                <div className="flex items-center mt-2 text-sm">Pinterest <span className="ml-auto">🟠</span></div>
                <div className="flex items-center mt-2 text-sm">Figma <span className="ml-auto">🟠</span></div>
            </nav>
        </aside>
    );
}
