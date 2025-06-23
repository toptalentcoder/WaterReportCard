"use client";

import Image from "next/image";
import { FiSearch } from "react-icons/fi";
import React, { useState, useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import { MAPBOX_ACCESS_TOKEN } from "@/config/apiConfig";

interface TopHeaderProps {
  onClose: () => void;
  map: mapboxgl.Map | null;             // pass the Map object
  mapboxToken: string;    
}

export default function TopHeader({  onClose, map, mapboxToken }: TopHeaderProps) {

    const [showSearch, setShowSearch] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [results, setResults] = useState<any[]>([]);
    const inputRef = useRef<HTMLInputElement | null>(null);
  
    // Focus the input when it expands
    useEffect(() => {
      if (showSearch) {
        inputRef.current?.focus();
      }
    }, [showSearch]);

    useEffect(() => {
        if (searchValue.length < 3) {
          setResults([]);
          return;
        }
        const controller = new AbortController();
    
        fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
            searchValue
          )}.json?access_token=${MAPBOX_ACCESS_TOKEN}&country=us&limit=5`,
          { signal: controller.signal }
        )
          .then((res) => res.json())
          .then((data) => setResults(data.features || []))
          .catch(() => {});
    
        return () => controller.abort();
    }, [searchValue, MAPBOX_ACCESS_TOKEN]);

    const handleSelectResult = (feature: any) => {
      setSearchValue(feature.place_name);
      setShowSearch(false);
      setResults([]);
      if (map) {
        map.flyTo({ center: feature.center, zoom: 12 });
      }
    };  
    
    return (
        <header className="absolute top-0 left-0 w-full bg-[#091223] h-12 flex items-center justify-between px-4 text-white z-50">

            <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={onClose}
            >
                <Image
                    src="/liquos-logo.png"
                    alt="Hero image"
                    width={32}
                    height={32}
                    className="h-7 w-auto"
                />
                <span className="text-white font-bold">Liquos Labs</span>
            </div>

            {/* Middle: Search */}
      {/* Middle: Search */}
      <div className="relative flex-1 flex justify-center">
        {showSearch ? (
          <div className="relative w-64">
            <input
              ref={inputRef}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search in US..."
              className="w-full bg-white text-black px-3 py-1 rounded-md"
              onBlur={() => setShowSearch(false)}
            />
            {/* Dropdown */}
            {results.length > 0 && (
              <ul className="absolute top-full left-0 w-full bg-white text-black border mt-1 max-h-48 overflow-y-auto z-50 rounded-md shadow-lg">
                {results.map((place) => (
                  <li
                    key={place.id}
                    className="p-2 hover:bg-gray-200 cursor-pointer"
                    onMouseDown={() => handleSelectResult(place)}
                  >
                    {place.place_name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : (
          <button onClick={() => setShowSearch(true)}>
            <FiSearch className="text-xl text-white hover:text-blue-400" />
          </button>
        )}
      </div>

            <span className="font-bold">Alex Li</span>
        </header>
    );
}
