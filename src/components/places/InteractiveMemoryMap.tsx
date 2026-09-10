"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import "leaflet/dist/leaflet.css";
import { Place } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import {
  MapPin,
  Compass,
  Plus,
  Minus,
  RotateCcw,
  Sparkles,
  ExternalLink,
  Layers,
} from "lucide-react";

interface InteractiveMemoryMapProps {
  places: Place[];
  selectedPlace: Place | null;
  onSelectPlace: (place: Place) => void;
  className?: string;
  onOpenDetail?: (place: Place) => void;
}

type MapLayerType = "topo" | "osm" | "satellite" | "hot" | "street";

const TILE_PROVIDERS: Record<
  MapLayerType,
  { url: string; attribution: string; name: string }
> = {
  topo: {
    name: "Romantic Topo",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
    attribution: "Tiles &copy; Esri",
  },
  osm: {
    name: "OpenStreetMap",
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
  satellite: {
    name: "Satellite Imagery",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: "Tiles &copy; Esri &mdash; Source: Esri, USGS, AeroGRID",
  },
  hot: {
    name: "Vibrant Warm",
    url: "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>, HOT',
  },
  street: {
    name: "City Streets",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
    attribution: "Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ",
  },
};

export function InteractiveMemoryMap({
  places,
  selectedPlace,
  onSelectPlace,
  className = "",
  onOpenDetail,
}: InteractiveMemoryMapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapInstanceRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tileLayerRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markersGroupRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const polylineRef = useRef<any>(null);

  const [mapStyle, setMapStyle] = useState<MapLayerType>("topo");
  const [showLayerMenu, setShowLayerMenu] = useState(false);
  const [isMapReady, setIsMapReady] = useState(false);

  // Initialize Leaflet Map
  useEffect(() => {
    let isMounted = true;
    let handleResize: (() => void) | null = null;

    async function initMap() {
      if (!mapContainerRef.current || mapInstanceRef.current) return;

      const L = (await import("leaflet")).default;

      if (!isMounted || !mapContainerRef.current) return;

      // Default center around Tamil Nadu
      const initialLat = places.length > 0 ? places[0].lat : 11.1271;
      const initialLng = places.length > 0 ? places[0].lng : 78.6569;

      const map = L.map(mapContainerRef.current, {
        center: [initialLat, initialLng],
        zoom: 7,
        zoomControl: false,
        attributionControl: false,
      });

      // Add Tile Layer
      const initialProvider = TILE_PROVIDERS[mapStyle];
      const tileLayer = L.tileLayer(initialProvider.url, {
        attribution: initialProvider.attribution,
        maxZoom: 19,
        subdomains: "abcd",
      }).addTo(map);

      tileLayerRef.current = tileLayer;
      markersGroupRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;

      handleResize = () => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      };
      window.addEventListener("resize", handleResize);

      setTimeout(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      }, 100);

      setTimeout(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      }, 350);

      setIsMapReady(true);
    }

    initMap();

    return () => {
      isMounted = false;
      if (handleResize) {
        window.removeEventListener("resize", handleResize);
      }
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Switch Tile Layer
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;

    import("leaflet").then((L) => {
      const provider = TILE_PROVIDERS[mapStyle];
      if (tileLayerRef.current) {
        mapInstanceRef.current.removeLayer(tileLayerRef.current);
      }
      const newTileLayer = L.default
        .tileLayer(provider.url, {
          attribution: provider.attribution,
          maxZoom: 19,
          subdomains: "abcd",
        })
        .addTo(mapInstanceRef.current);
      tileLayerRef.current = newTileLayer;
    });
  }, [mapStyle]);

  // Update Markers & Polyline when places change
  useEffect(() => {
    if (!isMapReady || !mapInstanceRef.current) return;

    import("leaflet").then((L) => {
      const map = mapInstanceRef.current;
      const markersGroup = markersGroupRef.current;
      if (!markersGroup) return;

      markersGroup.clearLayers();

      if (polylineRef.current) {
        map.removeLayer(polylineRef.current);
        polylineRef.current = null;
      }

      if (places.length === 0) return;

      const latLngs: [number, number][] = [];

      places.forEach((place) => {
        const isSelected = selectedPlace?.id === place.id;
        latLngs.push([place.lat, place.lng]);

        // Custom HTML Pin Icon
        const customIcon = L.default.divIcon({
          className: `custom-romantic-pin ${isSelected ? "is-selected" : ""}`,
          html: `
            <div class="pin-wrapper">
              <span class="pin-label">${place.title}</span>
              <div class="pin-core">
                <div class="pin-dot"></div>
                ${isSelected ? '<div class="pin-pulse"></div>' : ""}
              </div>
            </div>
          `,
          iconSize: [30, 42],
          iconAnchor: [15, 42],
        });

        const marker = L.default
          .marker([place.lat, place.lng], { icon: customIcon })
          .addTo(markersGroup);

        marker.on("click", (e) => {
          L.default.DomEvent.stopPropagation(e);
          onSelectPlace(place);
          map.flyTo([place.lat, place.lng], Math.max(map.getZoom(), 10), {
            duration: 1.2,
          });
        });
      });

      // Draw Journey Route Polyline
      if (latLngs.length > 1) {
        // Glowing Background Line
        const glowLine = L.default.polyline(latLngs, {
          color: "#FF2A6D",
          weight: 6,
          opacity: 0.35,
          lineCap: "round",
          lineJoin: "round",
        });

        // Core Dotted Connection Line
        const mainLine = L.default.polyline(latLngs, {
          color: "#E11D48",
          weight: 2.5,
          opacity: 0.85,
          dashArray: "6, 8",
          lineCap: "round",
          lineJoin: "round",
        });

        const routeGroup = L.default.featureGroup([glowLine, mainLine]);
        routeGroup.addTo(map);
        polylineRef.current = routeGroup;
      }

      // Auto-fit Bounds with generous padding
      if (latLngs.length > 0) {
        const bounds = L.default.latLngBounds(latLngs);
        map.fitBounds(bounds, {
          padding: [50, 50],
          maxZoom: 11,
          animate: true,
        });
      }
    });
  }, [places, selectedPlace, isMapReady, onSelectPlace]);

  // Zoom / Control Handlers
  const handleZoomIn = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomOut();
    }
  };

  const handleFitAll = () => {
    if (!mapInstanceRef.current || places.length === 0) return;
    import("leaflet").then((L) => {
      const latLngs: [number, number][] = places.map((p) => [p.lat, p.lng]);
      const bounds = L.default.latLngBounds(latLngs);
      mapInstanceRef.current.fitBounds(bounds, {
        padding: [60, 60],
        maxZoom: 11,
        animate: true,
      });
    });
  };

  return (
    <div
      className={`relative w-full h-[520px] sm:h-[620px] rounded-3xl overflow-hidden border border-rose-300/40 shadow-glass select-none group ${className}`}
    >
      {/* Actual Leaflet Map Canvas */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Top Left HUD: Coordinates & Location Info */}
      <div className="absolute top-4 left-4 z-[400] flex flex-col gap-1 pointer-events-none">
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 border border-rose-300/50 backdrop-blur-md text-xs shadow-md">
          <Compass className="w-3.5 h-3.5 text-rose-500 animate-spin-slow" />
          <span className="font-mono text-rose-700 text-[11px] font-semibold">
            {selectedPlace
              ? `${selectedPlace.lat.toFixed(4)}° N, ${selectedPlace.lng.toFixed(4)}° E`
              : "Tamil Nadu Memory Constellation"}
          </span>
        </div>
        {selectedPlace && (
          <span className="text-[11px] font-serif italic text-charcoal-800 pl-2 drop-shadow-sm font-semibold">
            Focus: {selectedPlace.city || selectedPlace.location_name},{" "}
            {selectedPlace.country || ""}
          </span>
        )}
      </div>

      {/* Top Right Controls: Layers, Fit All, Zoom */}
      <div className="absolute top-4 right-4 z-[400] flex flex-col items-end gap-2">
        {/* Layer Style Switcher Button */}
        <div className="relative">
          <button
            onClick={() => setShowLayerMenu((prev) => !prev)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/95 hover:bg-white border border-rose-300/50 text-charcoal-800 hover:text-rose-600 shadow-md backdrop-blur-md transition-all text-xs font-medium"
            title="Change Map Style"
          >
            <Layers className="w-4 h-4 text-rose-500" />
            <span className="hidden sm:inline">
              {TILE_PROVIDERS[mapStyle].name}
            </span>
          </button>

          {/* Layer Options Dropdown */}
          <AnimatePresence>
            {showLayerMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -4 }}
                className="absolute right-0 top-11 w-44 rounded-2xl bg-white/98 border border-rose-200/80 shadow-2xl backdrop-blur-xl p-1.5 space-y-1 z-50"
              >
                {(
                  Object.keys(TILE_PROVIDERS) as Array<MapLayerType>
                ).map((key) => (
                  <button
                    key={key}
                    onClick={() => {
                      setMapStyle(key);
                      setShowLayerMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                      mapStyle === key
                        ? "bg-rose-50 text-rose-700 font-semibold border border-rose-200"
                        : "text-charcoal-700 hover:bg-rose-50/50"
                    }`}
                  >
                    <span>{TILE_PROVIDERS[key].name}</span>
                    {mapStyle === key && (
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    )}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Action Buttons: Fit All, Zoom In, Zoom Out */}
        <div className="flex flex-col gap-1.5">
          <button
            onClick={handleFitAll}
            className="w-9 h-9 rounded-xl bg-white/95 hover:bg-white border border-rose-300/50 text-charcoal-800 hover:text-rose-600 flex items-center justify-center backdrop-blur-md shadow-md transition-all"
            title="Fit All Places (Reset View)"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleZoomIn}
            className="w-9 h-9 rounded-xl bg-white/95 hover:bg-white border border-rose-300/50 text-charcoal-800 hover:text-rose-600 flex items-center justify-center backdrop-blur-md shadow-md transition-all"
            title="Zoom in"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="w-9 h-9 rounded-xl bg-white/95 hover:bg-white border border-rose-300/50 text-charcoal-800 hover:text-rose-600 flex items-center justify-center backdrop-blur-md shadow-md transition-all"
            title="Zoom out"
          >
            <Minus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Floating Selected Memory Card (Bottom Overlay) */}
      <AnimatePresence>
        {selectedPlace && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-sm z-[400] p-4 rounded-2xl bg-white/95 border border-rose-300/60 shadow-2xl backdrop-blur-xl space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top thumbnail & Title */}
            <div className="flex items-start gap-3">
              {selectedPlace.photo_url && (
                <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-rose-200 shadow-sm">
                  <Image
                    src={selectedPlace.photo_url}
                    alt={selectedPlace.title}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
              )}

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-rose-600 uppercase tracking-wider mb-0.5 font-bold">
                  <Sparkles className="w-3 h-3 text-rose-500" />
                  <span>{selectedPlace.category}</span>
                </div>
                <h4 className="font-serif text-lg text-charcoal-900 font-bold truncate">
                  {selectedPlace.title}
                </h4>
                <p className="text-[11px] text-rose-600 truncate flex items-center gap-1 font-medium">
                  <MapPin className="w-3 h-3 shrink-0" />
                  <span>{selectedPlace.location_name}</span>
                </p>
              </div>
            </div>

            {/* Snippet */}
            <p className="text-xs text-charcoal-700 font-sans line-clamp-2 leading-relaxed">
              {selectedPlace.description}
            </p>

            {/* Action Bar */}
            <div className="pt-2 border-t border-rose-100 flex items-center justify-between text-xs">
              <span className="text-[11px] font-mono text-charcoal-500">
                {formatDate(selectedPlace.visited_date)}
              </span>

              {onOpenDetail && (
                <button
                  onClick={() => onOpenDetail(selectedPlace)}
                  className="text-xs text-rose-600 hover:text-rose-700 font-sans font-semibold flex items-center gap-1 hover:underline"
                >
                  <span>Open Full Memory</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

