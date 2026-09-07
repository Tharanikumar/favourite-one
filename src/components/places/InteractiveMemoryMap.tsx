"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Place } from "@/lib/supabase/types";
import { formatDate } from "@/lib/utils";
import {
  MapPin,
  Compass,
  Plus,
  Minus,
  RotateCcw,
  Sparkles,
  ExternalLink,
} from "lucide-react";

interface InteractiveMemoryMapProps {
  places: Place[];
  selectedPlace: Place | null;
  onSelectPlace: (place: Place) => void;
  className?: string;
  onOpenDetail?: (place: Place) => void;
}

export function InteractiveMemoryMap({
  places,
  selectedPlace,
  onSelectPlace,
  className = "",
  onOpenDetail,
}: InteractiveMemoryMapProps) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [hoveredPlace, setHoveredPlace] = useState<Place | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const mapRef = useRef<HTMLDivElement | null>(null);

  // Projection: converts GPS lat/lng (-90..90, -180..180) to 0..1000 x 0..500 coordinates
  const projectCoordinates = (lat: number, lng: number) => {
    const x = ((lng + 180) / 360) * 1000;
    // Mercator-like latitude scaling
    const latRad = (lat * Math.PI) / 180;
    const mercN = Math.log(Math.tan(Math.PI / 4 + latRad / 2));
    const y = 250 - (mercN / Math.PI) * 125;
    return { x, y: Math.max(20, Math.min(480, y)) };
  };

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.35, 3.5));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.35, 0.8));
  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  // Pan to selected place when clicking a pin
  const handleMarkerClick = (place: Place, e: React.MouseEvent) => {
    e.stopPropagation();
    onSelectPlace(place);
    const coords = projectCoordinates(place.lat, place.lng);
    // Center smoothly around marker
    const centerX = 500 - coords.x;
    const centerY = 250 - coords.y;
    setPan({ x: centerX * 0.5, y: centerY * 0.5 });
    if (zoom < 1.4) setZoom(1.6);
  };

  // Generate constellation connection lines between places
  const pathCoordinates = places.map((p) => projectCoordinates(p.lat, p.lng));
  const pathD = pathCoordinates.reduce((acc, curr, idx) => {
    return idx === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`;
  }, "");

  return (
    <div
      ref={mapRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className={`relative w-full h-[520px] sm:h-[600px] rounded-3xl bg-gradient-to-b from-[#FFF0F3] via-[#FFEAEF] to-[#FFF5F7] border border-rose-400/30 shadow-glass overflow-hidden select-none cursor-grab active:cursor-grabbing group ${className}`}
    >
      {/* Delicate Grid & Star Petals Background */}
      <div className="absolute inset-0 bg-[radial-gradient(#E093A220_1.5px,transparent_1.5px)] [background-size:24px_24px] pointer-events-none opacity-80" />
      <div className="absolute inset-0 bg-gradient-to-t from-white/60 via-transparent to-white/40 pointer-events-none" />

      {/* Atmospheric Horizon Glow */}
      <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[700px] h-[250px] bg-rose-400/10 rounded-full blur-3xl pointer-events-none" />

      {/* SVG Vector Map Canvas with Transformation */}
      <div
        className="w-full h-full origin-center transition-transform duration-300 ease-out"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
        }}
      >
        <svg
          viewBox="0 0 1000 500"
          className="w-full h-full overflow-visible"
        >
          {/* Subtle Grid Lat/Lng Latitude lines */}
          <g className="stroke-rose-400/20 stroke-[0.75] stroke-dasharray-[3,5]">
            <line x1="0" y1="125" x2="1000" y2="125" />
            <line x1="0" y1="250" x2="1000" y2="250" />
            <line x1="0" y1="375" x2="1000" y2="375" />
            <line x1="250" y1="0" x2="250" y2="500" />
            <line x1="500" y1="0" x2="500" y2="500" />
            <line x1="750" y1="0" x2="750" y2="500" />
          </g>

          {/* Minimalist Stylized Continents Outlines in Soft Cream with Dusty Rose Borders */}
          <g className="fill-white/80 stroke-rose-300/50 stroke-[1.2] shadow-sm">
            {/* North America */}
            <path d="M 120 100 Q 180 70 280 80 Q 290 140 240 180 Q 200 230 180 270 Q 150 220 120 160 Z" />
            {/* South America */}
            <path d="M 230 280 Q 300 300 320 360 Q 280 440 240 470 Q 220 380 230 280 Z" />
            {/* Europe */}
            <path d="M 460 100 Q 540 80 570 120 Q 540 170 480 160 Q 450 140 460 100 Z" />
            {/* Africa */}
            <path d="M 470 180 Q 560 180 580 250 Q 560 360 500 400 Q 450 300 470 180 Z" />
            {/* Asia */}
            <path d="M 580 80 Q 820 70 880 140 Q 850 250 720 250 Q 640 200 580 80 Z" />
            {/* Japan Arc */}
            <path d="M 850 150 Q 875 160 865 190 Q 845 180 850 150 Z" />
            {/* Australia */}
            <path d="M 760 330 Q 860 330 870 400 Q 790 430 750 380 Z" />
          </g>

          {/* Dusty Rose / Gold Flight Paths Constellation Lines */}
          <path
            d={pathD}
            fill="none"
            className="stroke-rose-500/60 stroke-[2] stroke-dasharray-[5,5] animate-pulse"
          />

          {/* Interactive Place Markers */}
          {places.map((place) => {
            const coords = projectCoordinates(place.lat, place.lng);
            const isSelected = selectedPlace?.id === place.id;
            const isHovered = hoveredPlace?.id === place.id;

            return (
              <g
                key={place.id}
                transform={`translate(${coords.x}, ${coords.y})`}
                className="cursor-pointer group"
                onClick={(e) => handleMarkerClick(place, e)}
                onMouseEnter={() => setHoveredPlace(place)}
                onMouseLeave={() => setHoveredPlace(null)}
              >
                {/* Outer Pulsing Aura */}
                {isSelected && (
                  <circle
                    r="24"
                    className="fill-rose-400/20 stroke-rose-500/50 stroke-[1.5] animate-ping"
                  />
                )}

                {/* Secondary Ripple */}
                <circle
                  r={isSelected ? "14" : isHovered ? "12" : "8"}
                  className={`transition-all duration-300 ${
                    isSelected
                      ? "fill-rose-500/30 stroke-rose-600 stroke-[2.5]"
                      : isHovered
                      ? "fill-rose-400/25 stroke-rose-500 stroke-[2]"
                      : "fill-white stroke-rose-500 stroke-[1.5]"
                  }`}
                />

                {/* Center Core Dot */}
                <circle
                  r={isSelected ? "5.5" : "4"}
                  className={`transition-all ${
                    isSelected
                      ? "fill-rose-600 shadow-glow-rose"
                      : "fill-rose-500"
                  }`}
                />

                {/* City / Place Label */}
                <text
                  x="0"
                  y={isSelected ? "-20" : "-14"}
                  textAnchor="middle"
                  className={`text-[11px] font-sans font-semibold tracking-wide transition-all duration-200 pointer-events-none ${
                    isSelected
                      ? "fill-rose-700 font-bold text-[12px]"
                      : isHovered
                      ? "fill-charcoal-800 font-semibold"
                      : "fill-charcoal-700"
                  }`}
                  style={{ filter: "drop-shadow(0 1px 2px rgba(255,255,255,0.9))" }}
                >
                  {place.title}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Top Left HUD: Map Info & Coordinates */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-1 pointer-events-none">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 border border-rose-300/40 backdrop-blur-md text-xs shadow-sm">
          <Compass className="w-3.5 h-3.5 text-rose-500 animate-spin-slow" />
          <span className="font-mono text-rose-700 text-[11px] font-medium">
            {selectedPlace
              ? `${selectedPlace.lat.toFixed(4)}° N, ${selectedPlace.lng.toFixed(4)}° E`
              : "Global Coordinate Matrix"}
          </span>
        </div>
        {selectedPlace && (
          <span className="text-[11px] font-serif italic text-charcoal-700 pl-2 drop-shadow-sm font-medium">
            Focus: {selectedPlace.city || selectedPlace.location_name},{" "}
            {selectedPlace.country || ""}
          </span>
        )}
      </div>

      {/* Top Right Controls: Zoom & Reset */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        <button
          onClick={handleZoomIn}
          className="w-9 h-9 rounded-xl bg-white/90 hover:bg-white border border-rose-300/40 hover:border-rose-400 text-charcoal-800 hover:text-rose-600 flex items-center justify-center backdrop-blur-md shadow-sm transition-all"
          title="Zoom in"
        >
          <Plus className="w-4 h-4" />
        </button>
        <button
          onClick={handleZoomOut}
          className="w-9 h-9 rounded-xl bg-white/90 hover:bg-white border border-rose-300/40 hover:border-rose-400 text-charcoal-800 hover:text-rose-600 flex items-center justify-center backdrop-blur-md shadow-sm transition-all"
          title="Zoom out"
        >
          <Minus className="w-4 h-4" />
        </button>
        <button
          onClick={handleReset}
          className="w-9 h-9 rounded-xl bg-white/90 hover:bg-white border border-rose-300/40 hover:border-rose-400 text-charcoal-800 hover:text-rose-600 flex items-center justify-center backdrop-blur-md shadow-sm transition-all"
          title="Reset View"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Floating Selected Memory Card (Bottom Left Overlay on Desktop) */}
      <AnimatePresence>
        {selectedPlace && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-sm z-20 p-4 rounded-2xl bg-white/95 border border-rose-300/50 shadow-glass backdrop-blur-xl space-y-3"
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
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-rose-600 uppercase tracking-wider mb-0.5 font-semibold">
                  <Sparkles className="w-3 h-3 text-rose-500" />
                  <span>{selectedPlace.category}</span>
                </div>
                <h4 className="font-serif text-lg text-charcoal-900 font-semibold truncate">
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
