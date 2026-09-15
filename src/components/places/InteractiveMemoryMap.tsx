"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
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
  Heart,
  Calendar,
  X,
} from "lucide-react";

interface InteractiveMemoryMapProps {
  places: Place[];
  selectedPlace: Place | null;
  onSelectPlace: (place: Place) => void;
  className?: string;
  onOpenDetail?: (place: Place) => void;
}

type MapLayerType = "voyager" | "dark" | "positron" | "satellite" | "topo" | "osm";

interface TileProviderConfig {
  name: string;
  url: string;
  attribution: string;
  subdomains?: string;
  maxZoom: number;
}

const TILE_PROVIDERS: Record<MapLayerType, TileProviderConfig> = {
  voyager: {
    name: "Romantic Light",
    url: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: "abcd",
    maxZoom: 20,
  },
  dark: {
    name: "Cosmic Night",
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: "abcd",
    maxZoom: 20,
  },
  positron: {
    name: "Golden Dawn",
    url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: "abcd",
    maxZoom: 20,
  },
  satellite: {
    name: "Satellite View",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: "Tiles &copy; Esri &mdash; Source: Esri, USGS",
    maxZoom: 19,
  },
  topo: {
    name: "Topography",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
    attribution: "Tiles &copy; Esri",
    maxZoom: 19,
  },
  osm: {
    name: "OpenStreetMap",
    url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
  },
};

// Tamil Nadu geographic center and default boundary limits
const TAMIL_NADU_CENTER: [number, number] = [11.1271, 78.6569];
const TAMIL_NADU_BOUNDS: [[number, number], [number, number]] = [
  [8.08, 76.2],
  [13.55, 80.35],
];

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
  const routeGroupRef = useRef<any>(null);
  // Store marker instances keyed by place id for fast visual state updates
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markerMapRef = useRef<Map<string, any>>(new Map());

  const [mapStyle, setMapStyle] = useState<MapLayerType>("voyager");
  const [showLayerMenu, setShowLayerMenu] = useState(false);
  const [isMapReady, setIsMapReady] = useState(false);

  // Filter out any invalid / zero coordinates to prevent map distortion
  const validPlaces = places.filter(
    (p) =>
      typeof p.lat === "number" &&
      typeof p.lng === "number" &&
      !isNaN(p.lat) &&
      !isNaN(p.lng) &&
      !(p.lat === 0 && p.lng === 0) &&
      p.lat >= -90 &&
      p.lat <= 90 &&
      p.lng >= -180 &&
      p.lng <= 180
  );

  // Helper to create reliable tile layers with graceful fallback
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const createTileLayer = useCallback((L: any, styleKey: MapLayerType) => {
    const provider = TILE_PROVIDERS[styleKey] || TILE_PROVIDERS.voyager;
    const layer = L.tileLayer(provider.url, {
      attribution: provider.attribution,
      maxZoom: provider.maxZoom || 19,
      subdomains: provider.subdomains || "abc",
      crossOrigin: true,
      keepBuffer: 6,
      updateWhenIdle: false,
      updateWhenZooming: true,
    });

    // Graceful one-time fallback on tile network error
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    layer.on("tileerror", (event: any) => {
      if (event?.tile && event?.coords && !event.tile.dataset?.fallbackAttempted) {
        event.tile.dataset.fallbackAttempted = "true";
        const { z, x, y } = event.coords;
        const sub = ["a", "b", "c", "d"][(x + y) % 4];
        event.tile.src = `https://${sub}.basemaps.cartocdn.com/rastertiles/voyager/${z}/${x}/${y}.png`;
      }
    });

    return layer;
  }, []);

  // 1. Initialize Map on Mount
  useEffect(() => {
    let isMounted = true;
    let resizeObserver: ResizeObserver | null = null;
    const timeouts: NodeJS.Timeout[] = [];

    async function initMap() {
      if (!mapContainerRef.current || mapInstanceRef.current) return;

      const L = (await import("leaflet")).default;
      if (!isMounted || !mapContainerRef.current) return;

      // Determine initial center
      const initialLat = validPlaces.length > 0 ? validPlaces[0].lat : TAMIL_NADU_CENTER[0];
      const initialLng = validPlaces.length > 0 ? validPlaces[0].lng : TAMIL_NADU_CENTER[1];

      const map = L.map(mapContainerRef.current, {
        center: [initialLat, initialLng],
        zoom: 7.5,
        zoomControl: false,
        attributionControl: false,
        scrollWheelZoom: true,
        fadeAnimation: true,
      });

      // Add Tile Layer
      const tileLayer = createTileLayer(L, mapStyle);
      tileLayer.addTo(map);
      tileLayerRef.current = tileLayer;

      // Layer groups for markers & route lines
      markersGroupRef.current = L.layerGroup().addTo(map);
      routeGroupRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;

      // Responsive ResizeObserver to ensure Leaflet handles container resizing smoothly
      if (window.ResizeObserver && mapContainerRef.current) {
        resizeObserver = new ResizeObserver(() => {
          if (mapInstanceRef.current) {
            mapInstanceRef.current.invalidateSize({ debounceMoveend: true });
          }
        });
        resizeObserver.observe(mapContainerRef.current);
      }

      // Staggered size invalidations to catch Framer Motion entrance animations
      [60, 180, 350, 700].forEach((delay) => {
        const t = setTimeout(() => {
          if (mapInstanceRef.current) {
            mapInstanceRef.current.invalidateSize();
          }
        }, delay);
        timeouts.push(t);
      });

      // Fit bounds to all places on initial map load
      if (validPlaces.length > 0) {
        const latLngs: [number, number][] = validPlaces.map((p) => [p.lat, p.lng]);
        const bounds = L.latLngBounds(latLngs);
        map.fitBounds(bounds, {
          padding: [50, 50],
          maxZoom: 10,
          animate: false,
        });
      } else {
        const defaultBounds = L.latLngBounds(TAMIL_NADU_BOUNDS);
        map.fitBounds(defaultBounds, {
          padding: [40, 40],
          maxZoom: 9,
          animate: false,
        });
      }

      setIsMapReady(true);
    }

    initMap();

    return () => {
      isMounted = false;
      timeouts.forEach(clearTimeout);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 2. Switch Tile Layer when style changes
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;

    import("leaflet").then((L) => {
      if (mapInstanceRef.current && tileLayerRef.current) {
        mapInstanceRef.current.removeLayer(tileLayerRef.current);
      }
      const newTileLayer = createTileLayer(L.default, mapStyle);
      newTileLayer.addTo(mapInstanceRef.current);
      tileLayerRef.current = newTileLayer;
    });
  }, [mapStyle, createTileLayer]);

  // 3. Render Markers & Routes when validPlaces change
  useEffect(() => {
    if (!isMapReady || !mapInstanceRef.current) return;

    import("leaflet").then((L) => {
      const map = mapInstanceRef.current;
      const markersGroup = markersGroupRef.current;
      const routeGroup = routeGroupRef.current;
      if (!map || !markersGroup || !routeGroup) return;

      markersGroup.clearLayers();
      routeGroup.clearLayers();
      markerMapRef.current.clear();

      if (validPlaces.length === 0) {
        const bounds = L.default.latLngBounds(TAMIL_NADU_BOUNDS);
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 8 });
        return;
      }

      const latLngs: [number, number][] = [];

      validPlaces.forEach((place) => {
        latLngs.push([place.lat, place.lng]);
        const isSelected = selectedPlace?.id === place.id;

        // Custom HTML Pin Icon
        const customIcon = L.default.divIcon({
          className: `custom-romantic-pin ${isSelected ? "is-selected" : ""}`,
          html: `
            <div class="pin-wrapper" id="pin-${place.id}">
              <span class="pin-label">${place.title}</span>
              <div class="pin-core">
                <div class="pin-dot"></div>
                ${isSelected ? '<div class="pin-pulse"></div>' : ""}
              </div>
            </div>
          `,
          iconSize: [32, 44],
          iconAnchor: [16, 44],
        });

        const marker = L.default
          .marker([place.lat, place.lng], { icon: customIcon, riseOnHover: true })
          .addTo(markersGroup);

        marker.on("click", (e) => {
          L.default.DomEvent.stopPropagation(e);
          onSelectPlace(place);
          map.flyTo([place.lat, place.lng], Math.max(map.getZoom(), 11), {
            duration: 1.1,
            easeLinearity: 0.25,
          });
        });

        markerMapRef.current.set(place.id, marker);
      });

      // Draw Journey Route Polyline connecting places
      if (latLngs.length > 1) {
        // Glowing Ambient Outer Line
        const glowLine = L.default.polyline(latLngs, {
          color: "#FF2A6D",
          weight: 7,
          opacity: 0.35,
          lineCap: "round",
          lineJoin: "round",
        });

        // Core Dotted Connection Line
        const mainLine = L.default.polyline(latLngs, {
          color: "#E11D48",
          weight: 2.5,
          opacity: 0.9,
          dashArray: "6, 8",
          lineCap: "round",
          lineJoin: "round",
        });

        glowLine.addTo(routeGroup);
        mainLine.addTo(routeGroup);
      }
    });
  }, [validPlaces, isMapReady, onSelectPlace, selectedPlace?.id]);

  // 4. Smooth Fly-to when selectedPlace changes
  useEffect(() => {
    if (!isMapReady || !mapInstanceRef.current || !selectedPlace) return;

    if (
      typeof selectedPlace.lat === "number" &&
      typeof selectedPlace.lng === "number" &&
      !isNaN(selectedPlace.lat) &&
      !isNaN(selectedPlace.lng)
    ) {
      mapInstanceRef.current.flyTo(
        [selectedPlace.lat, selectedPlace.lng],
        Math.max(mapInstanceRef.current.getZoom(), 11),
        {
          duration: 1.1,
          easeLinearity: 0.25,
        }
      );
    }
  }, [selectedPlace, isMapReady]);

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
    if (!mapInstanceRef.current) return;

    import("leaflet").then((L) => {
      if (validPlaces.length > 0) {
        const latLngs: [number, number][] = validPlaces.map((p) => [p.lat, p.lng]);
        const bounds = L.default.latLngBounds(latLngs);
        mapInstanceRef.current.fitBounds(bounds, {
          padding: [50, 50],
          maxZoom: 10,
          animate: true,
        });
      } else {
        const bounds = L.default.latLngBounds(TAMIL_NADU_BOUNDS);
        mapInstanceRef.current.fitBounds(bounds, {
          padding: [40, 40],
          maxZoom: 8,
          animate: true,
        });
      }
    });
  };

  return (
    <div
      className={`relative w-full h-[520px] sm:h-[620px] rounded-3xl overflow-hidden border border-rose-300/40 shadow-glass select-none group bg-[#dbe7ec] ${className}`}
    >
      {/* Actual Leaflet Map Canvas */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Top Left HUD: Coordinates & Location Info */}
      <div className="absolute top-4 left-4 z-[400] flex flex-col gap-1.5 pointer-events-none">
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 border border-rose-300/60 backdrop-blur-md text-xs shadow-md">
          <Compass className="w-3.5 h-3.5 text-rose-500 animate-spin-slow" />
          <span className="font-mono text-rose-700 text-[11px] font-semibold">
            {selectedPlace
              ? `${selectedPlace.lat.toFixed(4)}° N, ${selectedPlace.lng.toFixed(4)}° E`
              : "Tamil Nadu Memory Constellation"}
          </span>
          <span className="px-1.5 py-0.2 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold font-mono">
            {validPlaces.length} Pins
          </span>
        </div>

        {selectedPlace && (
          <div className="px-3 py-1 rounded-xl bg-white/90 border border-rose-200/80 backdrop-blur-sm text-[11px] font-serif italic text-charcoal-800 shadow-sm inline-flex items-center gap-1.5 self-start">
            <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
            <span>
              Focus: {selectedPlace.city || selectedPlace.location_name},{" "}
              {selectedPlace.country || "India"}
            </span>
          </div>
        )}
      </div>

      {/* Top Right Controls: Layers, Fit All, Zoom */}
      <div className="absolute top-4 right-4 z-[400] flex flex-col items-end gap-2">
        {/* Layer Style Switcher Button */}
        <div className="relative">
          <button
            onClick={() => setShowLayerMenu((prev) => !prev)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/95 hover:bg-white border border-rose-300/60 text-charcoal-800 hover:text-rose-600 shadow-md backdrop-blur-md transition-all text-xs font-medium cursor-pointer"
            title="Change Map Style"
          >
            <Layers className="w-4 h-4 text-rose-500" />
            <span className="hidden sm:inline font-sans">
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
                className="absolute right-0 top-11 w-48 rounded-2xl bg-white/98 border border-rose-200/90 shadow-2xl backdrop-blur-xl p-1.5 space-y-1 z-50"
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
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors cursor-pointer ${
                      mapStyle === key
                        ? "bg-rose-50 text-rose-700 font-semibold border border-rose-200"
                        : "text-charcoal-700 hover:bg-rose-50/60"
                    }`}
                  >
                    <span>{TILE_PROVIDERS[key].name}</span>
                    {mapStyle === key && (
                      <span className="w-2 h-2 rounded-full bg-rose-500 shadow-xs" />
                    )}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Action Buttons: Fit All / Reset View, Zoom In, Zoom Out */}
        <div className="flex flex-col gap-1.5">
          <button
            onClick={handleFitAll}
            className="w-9 h-9 rounded-xl bg-white/95 hover:bg-white border border-rose-300/60 text-charcoal-800 hover:text-rose-600 flex items-center justify-center backdrop-blur-md shadow-md transition-all cursor-pointer"
            title="Fit All Tamil Nadu Pins"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleZoomIn}
            className="w-9 h-9 rounded-xl bg-white/95 hover:bg-white border border-rose-300/60 text-charcoal-800 hover:text-rose-600 flex items-center justify-center backdrop-blur-md shadow-md transition-all cursor-pointer"
            title="Zoom In"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="w-9 h-9 rounded-xl bg-white/95 hover:bg-white border border-rose-300/60 text-charcoal-800 hover:text-rose-600 flex items-center justify-center backdrop-blur-md shadow-md transition-all cursor-pointer"
            title="Zoom Out"
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
            className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-sm z-[400] p-4 rounded-2xl bg-white/95 border border-rose-300/70 shadow-2xl backdrop-blur-xl space-y-3"
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
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-rose-600 uppercase tracking-wider mb-0.5 font-bold">
                    <Sparkles className="w-3 h-3 text-rose-500" />
                    <span>{selectedPlace.category}</span>
                  </div>
                  <button
                    onClick={() => onSelectPlace(null as unknown as Place)}
                    className="p-1 text-charcoal-400 hover:text-rose-600 rounded-md transition-colors"
                    title="Dismiss"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
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
              <span className="text-[11px] font-mono text-charcoal-500 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-rose-400" />
                {formatDate(selectedPlace.visited_date)}
              </span>

              {onOpenDetail && (
                <button
                  onClick={() => onOpenDetail(selectedPlace)}
                  className="text-xs text-rose-600 hover:text-rose-700 font-sans font-semibold flex items-center gap-1 hover:underline cursor-pointer"
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
