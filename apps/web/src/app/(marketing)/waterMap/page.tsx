"use client";

import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import FloatingHeader from "../../../components/FloatingHeader";
import { PropertiesTypes } from "@/utils/GeoJSONTypes";
import WaterPopup from "@/components/ui/water_boundaries_popup";
import Sidebar from "@/components/Sidebar";
import Lottie from "lottie-react";
import dropletAnimation from "../../../../public/Sidebar/waterDubble.json";
import DashboardLayout from "@/components/DashboardLayout";
import MainContent from "@/components/MainContent";
import { MAPBOX_ACCESS_TOKEN } from "@/config/apiConfig";
import { FaMoon } from "react-icons/fa";
import { FaRegSun } from "react-icons/fa";

export default function WaterMapPage() {

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedFeatureId, setSelectedFeatureId] = useState<number | string | null>(null);
  const [map, setMap] = useState<mapboxgl.Map | null>(null);

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
      mbMap.setFilter('water_boundaries_selected', ['==', ['get', 'PWSID'], featureId]);

      const popupNode = document.createElement('div');
      const closePopup = () => popup.remove();
      const root = ReactDOM.createRoot(popupNode);
      root.render(<WaterPopup props={props} onClose={closePopup} />);
      const popup = new mapboxgl.Popup({ closeButton: false, className: "custom-popup" })
        .setLngLat(e.lngLat)
        .setDOMContent(popupNode)
        .addTo(mbMap);
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
            ? "mapbox://styles/healer-mapbox/cmc97qmfk02b301s2giwz02xy"
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

      <div className="relative h-screen">
        <div id="map" className="absolute inset-0 w-full h-full" />
      </div>
    </>
  );
}