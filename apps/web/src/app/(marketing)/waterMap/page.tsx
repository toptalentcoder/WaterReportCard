"use client";

import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";


import FloatingHeader from "../../../components/FloatingHeader";
import { CgClose } from "react-icons/cg";
import { PropertiesTypes } from "@/utils/GeoJSONTypes";

function WaterMapPage() {
  const [loading, setLoading] = useState(true);
  const [waterPolygonProperties, setWaterPolygonProperties] =
    useState<PropertiesTypes | null>(null);

  const hoveredPolygonId = useRef(null);

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

      map.addSource("water-munis", {
        type: "geojson",
        data: "https://opendata.arcgis.com/datasets/9992e59e46bb466584f9694f897f350a_0.geojson",
        promoteId: "OBJECTID",
      });

      // Add zoom and rotation controls to the map.
      const nav = new mapboxgl.NavigationControl();
      map.addControl(nav, "bottom-right");

      /* adding the BaseLayers for Polygon + Stroke 'Line' */
      map.addLayer({
        id: "polygons",
        type: "fill",
        source: "water-munis",
        layout: {},
        paint: {
          "fill-color": [
            "case",
            ["boolean", ["feature-state", "hover"], false],
            // "#B7FCF0",
            // "#3581C8",
            // "#2186E4",
            // "#1563AC",
            "#1084EF",
            [
              "interpolate",
              ["linear"],
              ["to-number", ["get", "OBJECTID"]],
              800,
              // "#28B2FF",
              "#82A5DB",
              2000,
              // "#001AFF", // Let's assume the maximum OBJECTID is about 2000
              "#82A5DB", // Let's assume the maximum OBJECTID is about 2000
            ],
          ],
          "fill-outline-color": ["rgba", 200, 100, 240, 1],
          "fill-opacity": [
            "case",
            ["boolean", ["feature-state", "hover"], false],
            0.2,
            0.2,
          ],
        },
      });

      map.addLayer({
        id: "polygon-borders",
        type: "line",
        source: "water-munis",
        paint: {
          "line-color": "#193A5C", // Specify your desired line color
          "line-width": 2, // Adjust the width value to make the line thicker or thinner
        },
      });

      /* Adding functionality to the map */
      map.on("mousemove", "polygons", (e) => {
        if (e.features && e.features[0].properties) {
          const properties = e.features[0].properties;

          // Update the waterPolygonProperties state
          setWaterPolygonProperties(properties as PropertiesTypes);

          // De-emphasize the previously hovered polygon, if any
          if (hoveredPolygonId.current) {
            map.setFeatureState(
              { source: "water-munis", id: hoveredPolygonId.current },
              { hover: false }
            );
          }

          // Emphasize the new hovered polygon
          const newHoveredPolygonId = properties.OBJECTID;
          hoveredPolygonId.current = newHoveredPolygonId;

          map.setFeatureState(
            { source: "water-munis", id: newHoveredPolygonId },
            { hover: true }
          );
        } else {
          console.log("No properties found");
        }
      });

      // Change the cursor to a pointer when the mouse is over the places layer.
      map.on("mouseenter", "polygons", () => {
        map.getCanvas().style.cursor = "pointer";
      });

      // Change it back to a pointer when it leaves.
      map.on("mouseleave", "polygons", () => {
        map.getCanvas().style.cursor = "";
      });
    });

    map.on("idle", () => {
      // The 'idle' event is emitted when the map has finished loading all sources and rendering all layers
      // So, we can use this event to set loading to false
      setLoading(false);
    });
  }, []);

  return (
    <>
      {/* <Header /> */}
      <FloatingHeader />
      <div className="relative h-screen">
        {loading && (
          <p className="flex flex-col fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 z-10 w-2/5 lg:w-1/5 rounded-lg shadow-md text-center mt-4 text-lg font-semibold mb-2 backdrop-blur-md ">
            Loading...
          </p>
        )}
        {waterPolygonProperties && (
          // <div className="absolute top-24 left-1/2 transform -translate-x-1/2 lg:right-14 p-4 z-10 flex flex-col w-1/5 rounded-lg shadow-md backdrop-blur-md">
          <div className="absolute top-24 p-4 z-10 flex flex-col w-11/12 md:w-1/2 lg:w-1/5 mx-auto left-1/2 lg:left-auto transform -translate-x-1/2 lg:translate-x-0 lg:right-14 rounded-lg shadow-md backdrop-blur-md">
            <div className="flex flex-row items-center justify-between">
              <p className="text-lg font-semibold mb-2">Water Report Card</p>

              <button
                className="lg:hidden mb-2 p-1 self-end flex flex-row items-center"
                onClick={() => {
                  /* Close logic here */
                  setWaterPolygonProperties(null);
                }}
              >
                <p className="text-slate-500 hover:text-slate-700 active:text-slate-600 font-medium mr-1">
                  Close
                </p>
                <CgClose
                  className="h-4 w-4 text-slate-500 hover:text-slate-700 active:text-slate-600"
                  aria-hidden="true"
                />
              </button>
            </div>
            <p>
              <b>CWS Name: </b>
              {waterPolygonProperties.CWS_NAME}
            </p>
            <p>
              <b>County:</b> {waterPolygonProperties.COUNTY}
            </p>
            <p>
              <b>City Served:</b> {waterPolygonProperties.CITY_SRVD}
            </p>
            <p>
              <b>Phone #:</b> {waterPolygonProperties.PHONE}
            </p>
            <p>
              <b>Id:</b> {waterPolygonProperties.OBJECTID}
            </p>
          </div>
        )}
        {/* <menu className="absolute top-8 left-8 p-4 z-10 flex flex-col bg-slate-50 rounded-lg shadow-md text-center mt-4 text-sm font-medium mb-2">
          <ul>
            <li className="text-xs">Menu:</li>
            <li>
              <Link href="/marketing" className="hover:text-slate-500">
                Marketing
              </Link>
            </li>
            <li>
              <Link href="/devices" className="hover:text-slate-500">
                My Devices
              </Link>
            </li>
          </ul>
        </menu> */}
        <div id="map" className="absolute inset-0 w-full h-full" />
      </div>
    </>
  );
}

export default WaterMapPage;