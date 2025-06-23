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
            <ul className="text-sm space-y-1">
                <li>
                    <span className="font-semibold">Population Category:</span>{" "}
                    {props.Pop_Cat_5 || "N/A"}
                </li>
                <li>
                    <span className="font-semibold">Population Served:</span>{" "}
                    {props.Population_Served_Count || "N/A"}
                </li>
                <li>
                    <span className="font-semibold">Primacy Agency:</span>{" "}
                    {props.Primacy_Agency || "N/A"}
                </li>
                <li>
                    <span className="font-semibold">Secondary ID Source:</span>{" "}
                    {props.Secondary_ID_Source || "N/A"}
                </li>
                <li>
                    <span className="font-semibold">Service Area Type:</span>{" "}
                    {props.Service_Area_Type || "N/A"}
                </li>
                <li>
                    <span className="font-semibold">Service Connections:</span>{" "}
                    {props.Service_Connections_Count || "N/A"}
                </li>
            </ul>
        </div>
    );
}
