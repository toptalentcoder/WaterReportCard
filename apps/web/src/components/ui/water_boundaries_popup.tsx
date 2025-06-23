"use client";

import { PropertiesTypes } from "@/utils/GeoJSONTypes";

interface WaterPopupProps {
    props: PropertiesTypes;
    onClose?: () => void;
}

export default function WaterPopup({ props, onClose }: WaterPopupProps) {
    return (
        <div className="p-4 w-64 rounded-lg bg-white shadow-xl text-slate-800 relative">
            {/* Close icon */}
            {onClose && (
                <button
                    className="absolute top-2 right-2 text-slate-400 hover:text-slate-600"
                    onClick={onClose}
                    title="Close popup"
                >
                    ✕
                </button>
            )}

            <h4 className="text-lg font-semibold mb-2 border-b border-slate-200 pb-1">💧 Water Report</h4>
            <p><span className="font-medium">CWS Name:</span> {props.CWS_NAME || "N/A"}</p>
            <p><span className="font-medium">County:</span> {props.COUNTY || "N/A"}</p>
            <p><span className="font-medium">City:</span> {props.CITY_SRVD || "N/A"}</p>
            <p><span className="font-medium">Phone:</span> {props.PHONE || "N/A"}</p>
        </div>
    );
}
