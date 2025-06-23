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

export default function WaterMapPage() {

  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const initialZoom = window.innerWidth <= 768 ? 1 : 2;
    const initialZoomFlyTo = window.innerWidth <= 768 ? 8 : 9.4;

    if (!process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN) {
      throw new Error("Missing Mapbox access token in environment variables");
    }

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

    const map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/healer-mapbox/cmbsc8mmn010v01s568xue36m",
      zoom: initialZoom,
      center: [-100, 40], //starting over North America
    });

    map.on("load", () => {
      setTimeout(function () {
        map.flyTo({
          center: [-112.074, 33.6], // Target center coordinates [longitude, latitude]
          zoom: initialZoomFlyTo, // Target zoom level
          duration: 1500, // Duration of the zoom animation in milliseconds (5 seconds)
        });
      }, 1000);

      map.addSource('water_boundaries', {
        type: 'vector',
        tiles: ['http://34.220.51.42:2018/tiles/{z}/{x}/{y}.pbf'],
        minzoom: 5,
        maxzoom: 14
      });

      map.addLayer({
        id: 'water-fill',
        type: 'line',
        source: 'water_boundaries',
        'source-layer': 'water_boundaries',
        paint: {
          "line-color": "#193A5C", // Specify your desired line color
          "line-width": 1, // Adjust the width value to make the line thicker or thinner
        }
      })

      map.addLayer({
        id: 'water_boundaries_borders',
        type: 'fill',
        source: 'water_boundaries',
        'source-layer': 'water_boundaries',
        paint: {
          'fill-color': '#1084EF',
          'fill-opacity': 0.5
        }
      })

      // Add zoom and rotation controls to the map.
      const nav = new mapboxgl.NavigationControl();
      map.addControl(nav, "bottom-right");

      map.on('click', 'water_boundaries_borders', (e) => {
        if (!e.features || !e.features[0]) return;
      
        const feature = e.features[0];
        const props = feature.properties as PropertiesTypes;
      
        // Prepare a div for the popup
        const popupNode = document.createElement('div');
        const closePopup = () => popup.remove();

        const root = ReactDOM.createRoot(popupNode);
        root.render(<WaterPopup props={props} onClose={closePopup} />);

        const popup = new mapboxgl.Popup({ closeButton: false, className: "custom-popup" })
          .setLngLat(e.lngLat)
          .setDOMContent(popupNode)
          .addTo(map);
      });
      
      // Change the cursor to a pointer when the mouse is over the places layer.
      map.on('mouseenter', 'water_boundaries_borders', () => {
        map.getCanvas().style.cursor = 'pointer';
      });

      map.on('mouseleave', 'water_boundaries_borders', () => {
        map.getCanvas().style.cursor = '';
      });
    });

  }, []);

  return (
    <>
      {sidebarOpen ? (
        <DashboardLayout isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)}>
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