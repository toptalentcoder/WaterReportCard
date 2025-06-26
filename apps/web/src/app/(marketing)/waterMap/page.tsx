"use client";

import React, { useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import FloatingHeader from "../../../components/FloatingHeader";
import { PropertiesTypes } from "@/utils/GeoJSONTypes";
import Lottie from "lottie-react";
import dropletAnimation from "../../../../public/Sidebar/waterDubble.json";
import DashboardLayout from "@/components/DashboardLayout";
import { MAPBOX_ACCESS_TOKEN } from "@/config/apiConfig";
import Image from "next/image";
import { FaCity } from "react-icons/fa";
import { PiMapPinAreaBold } from "react-icons/pi";


export default function WaterMapPage() {

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedFeatureId, setSelectedFeatureId] = useState<number | string | null>(null);
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const [selectedFeatureProps, setSelectedFeatureProps] = useState<PropertiesTypes | null>(null);

  const addWaterLayers = (mbMap: mapboxgl.Map) => {
    mbMap.addSource('water_boundaries', {
      type: 'vector',
      tiles: ['http://34.220.51.42:2018/tiles/{z}/{x}/{y}.pbf'],
      minzoom: 5,
      maxzoom: 14
    });

    mbMap.addLayer({
      id: 'water-fill',
      type: 'line',
      source: 'water_boundaries',
      'source-layer': 'water_boundaries',
      paint: { "line-color": "#193A5C", "line-width": 1 }
    });

    mbMap.addLayer({
      id: 'water_boundaries_borders',
      type: 'fill',
      source: 'water_boundaries',
      'source-layer': 'water_boundaries',
      paint: { 'fill-color': '#1084EF', 'fill-opacity': 0.5 }
    });

    mbMap.addLayer({
      id: 'water_boundaries_selected',
      type: 'fill',
      source: 'water_boundaries',
      'source-layer': 'water_boundaries',
      paint: { 'fill-color': '#FF0000', 'fill-opacity': 0.7 },
      filter: ['==', ['get', 'PWSID'], '']
    });

    // Set up click and hover listeners
    mbMap.on('click', 'water_boundaries_borders', (e) => {
      if (!e.features || !e.features[0]) return;
      const feature = e.features[0];
      const props = feature.properties as PropertiesTypes;

      const featureId = props.PWSID ?? null;
      setSelectedFeatureId(featureId);
      console.log(props)
      setSelectedFeatureProps(props);
      mbMap.setFilter('water_boundaries_selected', ['==', ['get', 'PWSID'], featureId]);

    //   const popupNode = document.createElement('div');
    //   const closePopup = () => popup.remove();
    //   const root = ReactDOM.createRoot(popupNode);
    //   root.render(<WaterPopup props={props} onClose={closePopup} />);
    //   const popup = new mapboxgl.Popup({ closeButton: false, className: "custom-popup" })
    //     .setLngLat(e.lngLat)
    //     .setDOMContent(popupNode)
    //     .addTo(mbMap);
    });

    mbMap.on('mouseenter', 'water_boundaries_borders', () => mbMap.getCanvas().style.cursor = 'pointer');
    mbMap.on('mouseleave', 'water_boundaries_borders', () => mbMap.getCanvas().style.cursor = '');
  };

  useEffect(() => {
    if (!MAPBOX_ACCESS_TOKEN) {
      throw new Error("Missing Mapbox access token.");
    }

    mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;
    const mbMap = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/healer-mapbox/cmbsc8mmn010v01s568xue36m",
      zoom: 2,
      center: [-100, 40],
      attributionControl: false
    });

    mbMap.on('load', () => {
      mbMap.flyTo({ center: [-112.074, 33.6], zoom: 9.4, duration: 1500 });
      addWaterLayers(mbMap); // add layers initially

      // Nav control
      const nav = new mapboxgl.NavigationControl();
      mbMap.addControl(nav, "bottom-right");

      // Dark/Light switcher
      let isDark = true;
      const styleToggle = document.createElement('button');
      styleToggle.title = "Toggle light/dark style";
      styleToggle.innerHTML = "🌙";
      styleToggle.style.position = "absolute";
      styleToggle.style.top = "50%";
      styleToggle.style.right = "1rem";
      styleToggle.style.transform = "translateY(-50%)";
      styleToggle.style.zIndex = "10";
      styleToggle.style.padding = "0.5rem";
      styleToggle.style.border = "none";
      styleToggle.style.borderRadius = "50%";
      styleToggle.style.cursor = "pointer";
      styleToggle.style.fontSize = "24px";
      styleToggle.style.background = "#ffffffaa";
      mbMap.getContainer().appendChild(styleToggle);

      styleToggle.onclick = () => {
        isDark = !isDark;
        mbMap.setStyle(
          isDark
            ? "mapbox://styles/healer-mapbox/cmbsc8mmn010v01s568xue36m"
            : "mapbox://styles/healer-mapbox/cmc97ganw01es01rxfaol63ob"
        );

        styleToggle.innerHTML = isDark ? "🌙" : "☀️";

        mbMap.once('styledata', () => addWaterLayers(mbMap));
      };
    });

    return () => mbMap.remove();
  }, []);

  return (
    <>
      {sidebarOpen ? (
        <DashboardLayout
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          map={map} // <- pass the map instance
          mapboxToken={MAPBOX_ACCESS_TOKEN!} // <- pass the token
        >
          <div></div>
        </DashboardLayout>
      ) : (
        <>
          <FloatingHeader />

          <div
            className="absolute left-4 top-1/2 -translate-y-1/2 w-16 h-16 cursor-pointer z-20"
            onClick={() => setSidebarOpen(true)}
          >
            <Lottie animationData={dropletAnimation} loop={true} style={{ width: "200%", height: "200%" }} />
          </div>
        </>
      )}

      {selectedFeatureProps && (
        <div
          className="absolute right-5 top-0 mt-20 w-72 bg-gradient-to-b from-[#DE63CB] to-[#A39AA2] shadow-xl z-20"
          style={{ height: 'calc(100vh - 6rem)' }}
        >
          <div className="flex justify-between">
            <Image
              src="/WaterReportCard/logo.png"
              width={100}
              height={100}
              alt="Liquos Logo"
              className="w-40"
            />
            <button
                className="absolute top-2 right-2 text-slate-400 hover:text-slate-600 text-white font-bold text-2xl"
                onClick={() => setSelectedFeatureProps(null)}
                title="Close popup"
            >
                ✕
            </button>
          </div>
          
          <div className="relative flex items-center mt-5 w-full">
            {/* White pill */}
            <div className="w-full mr-6 h-12 bg-white rounded-3xl flex items-center justify-between text-gray-800 px-3">
              <div className="pl-6">CWS</div>
              <div className="font-bold">{selectedFeatureProps.Primacy_Agency}</div>
            </div>

            {/* Icon overlapping pill */}
            <div className="absolute left-0 -translate-x-1/2 bg-white rounded-full w-18 h-18 flex justify-center items-center z-10">
              <PiMapPinAreaBold className="text-gray-600 w-10 h-10" />
            </div>
          </div>

          <div className="relative flex items-center mt-10 w-full mb-6">
            {/* White pill */}
            <div className="w-full mr-6 h-12 bg-white rounded-3xl flex items-center justify-between text-gray-800 px-3">
              <div className="pl-6">City Served</div>
              <div className="font-bold">{selectedFeatureProps.Primacy_Agency}</div>
            </div>

            {/* Icon overlapping pill */}
            <div className="absolute left-0 -translate-x-1/2 bg-white rounded-full w-18 h-18 flex justify-center items-center z-10">
              <FaCity className="text-gray-600 w-10 h-10" />
            </div>
          </div>

          {/* Collapsible Section */}
          <details className="mt-4 pt-2 px-6">
            <summary className="cursor-pointer flex items-center justify-between text-lg font-semibold">
              <div className="flex items-center">
                <span>Water Report</span>
                <Image
                  src="/WaterReportCard/waterBubble.svg"
                  width={10}
                  height={10}
                  alt="Liquos Logo"
                  className="w-24"
                />
              </div>
              <span>▼</span>
            </summary>
            <ul className="mt-2 space-y-1 text-white text-sm">
              <li>
                  <span className="font-semibold">Population Category:</span>{" "}
                  {selectedFeatureProps.Pop_Cat_5 || "N/A"}
              </li>
              <li>
                  <span className="font-semibold">Population Served:</span>{" "}
                  {selectedFeatureProps.Population_Served_Count || "N/A"}
              </li>
              <li>
                  <span className="font-semibold">Primacy Agency:</span>{" "}
                  {selectedFeatureProps.Primacy_Agency || "N/A"}
              </li>
              <li>
                  <span className="font-semibold">Secondary ID Source:</span>{" "}
                  {selectedFeatureProps.Secondary_ID_Source || "N/A"}
              </li>
              <li>
                  <span className="font-semibold">Service Area Type:</span>{" "}
                  {selectedFeatureProps.Service_Area_Type || "N/A"}
              </li>
              <li>
                  <span className="font-semibold">Service Connections:</span>{" "}
                  {selectedFeatureProps.Service_Connections_Count || "N/A"}
              </li>
            </ul>
          </details>
        </div>
      )}


      <div className="relative h-screen">
        <div id="map" className="absolute inset-0 w-full h-full" />
      </div>
    </>
  );
}