"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Place, PlaceCategory } from "@/lib/types";
import {
  MapPin,
  Compass,
  Image as ImageIcon,
  Sparkles,
} from "lucide-react";

interface AddPlaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (newPlace: Place) => void;
}

const TN_PRESETS = [
  { name: "Karur", city: "Karur", lat: 10.9601, lng: 78.0766 },
  { name: "Trichy", city: "Trichy", lat: 10.7905, lng: 78.7047 },
  { name: "Chennai", city: "Chennai", lat: 13.0827, lng: 80.2707 },
  { name: "Chidambaram", city: "Chidambaram", lat: 11.3992, lng: 79.6936 },
  { name: "Palani", city: "Palani", lat: 10.4509, lng: 77.5188 },
  { name: "Coimbatore", city: "Coimbatore", lat: 11.0168, lng: 76.9558 },
  { name: "Madurai", city: "Madurai", lat: 9.9252, lng: 78.1198 },
  { name: "Salem", city: "Salem", lat: 11.6643, lng: 78.146 },
  { name: "Ooty", city: "Ooty", lat: 11.4102, lng: 76.695 },
  { name: "Kodaikanal", city: "Kodaikanal", lat: 10.2381, lng: 77.4892 },
  { name: "Kanyakumari", city: "Kanyakumari", lat: 8.0883, lng: 77.5385 },
  { name: "Mahabalipuram", city: "Mahabalipuram", lat: 12.6269, lng: 80.1927 },
  { name: "Rameswaram", city: "Rameswaram", lat: 9.2876, lng: 79.3129 },
  { name: "Thanjavur", city: "Thanjavur", lat: 10.787, lng: 79.1378 },
  { name: "Pondicherry", city: "Pondicherry", lat: 11.9416, lng: 79.8083 },
];

export function AddPlaceModal({
  isOpen,
  onClose,
  onAdd,
}: AddPlaceModalProps) {
  const [title, setTitle] = useState("");
  const [locationName, setLocationName] = useState("");
  const [city, setCity] = useState("Karur");
  const [country, setCountry] = useState("India");
  const [lat, setLat] = useState("10.9601");
  const [lng, setLng] = useState("78.0766");
  const [visitedDate, setVisitedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [category, setCategory] = useState<PlaceCategory>("Travel");
  const [description, setDescription] = useState("");
  const [memoryNote, setMemoryNote] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");

  const categories: PlaceCategory[] = [
    "Travel",
    "First Date",
    "Favorite Café",
    "Stargazing",
    "Adventures",
    "Quiet Moment",
    "Home",
  ];

  const handleApplyPreset = (preset: (typeof TN_PRESETS)[0]) => {
    setCity(preset.city);
    setCountry("India");
    setLat(preset.lat.toString());
    setLng(preset.lng.toString());
    if (!locationName) {
      setLocationName(`${preset.name}, Tamil Nadu`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !locationName.trim() || !visitedDate) return;

    const parsedLat = parseFloat(lat) || 10.9601;
    const parsedLng = parseFloat(lng) || 78.0766;

    const newPlace: Place = {
      id: `pl-${Date.now()}`,
      title: title.trim(),
      location_name: locationName.trim(),
      city: city.trim() || undefined,
      country: country.trim() || "India",
      lat: parsedLat,
      lng: parsedLng,
      visited_date: visitedDate,
      category,
      description: description.trim(),
      memory_note: memoryNote.trim() || undefined,
      photo_url: photoUrl.trim() || undefined,
      gallery_urls: photoUrl.trim() ? [photoUrl.trim()] : undefined,
      is_favorite: false,
    };

    onAdd(newPlace);
    onClose();

    // Reset form to Tamil Nadu defaults
    setTitle("");
    setLocationName("");
    setCity("Karur");
    setCountry("India");
    setLat("10.9601");
    setLng("78.0766");
    setVisitedDate(new Date().toISOString().split("T")[0]);
    setDescription("");
    setMemoryNote("");
    setPhotoUrl("");
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Pin a Special Coordinate"
      subtitle="Save another sacred place into your Tamil Nadu relationship memory map."
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Quick Tamil Nadu Location Presets */}
        <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-400/20 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-rose-300">
            <span className="flex items-center gap-1.5 font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-rose-400" />
              Quick Tamil Nadu Presets:
            </span>
            <span className="text-[10px] text-cream-400">Click to autofill GPS</span>
          </div>

          <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
            {TN_PRESETS.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => handleApplyPreset(preset)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                  city.toLowerCase() === preset.city.toLowerCase()
                    ? "bg-rose-500 text-white font-bold shadow-xs scale-105"
                    : "bg-universe-950/80 hover:bg-universe-900 text-cream-300 hover:text-white border border-white/[0.08]"
                }`}
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>

        {/* Title & Location Name */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-cream-300 mb-1.5 font-mono">
              Place Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Karur Road Trip"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl bg-universe-950 border border-white/[0.1] px-4 py-2.5 text-sm text-cream-100 placeholder-cream-600 focus:outline-none focus:border-gold-400"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-cream-300 mb-1.5 font-mono">
              Specific Spot / Address *
            </label>
            <input
              type="text"
              required
              placeholder="e.g., River View Point, Karur"
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              className="w-full rounded-xl bg-universe-950 border border-white/[0.1] px-4 py-2.5 text-sm text-cream-100 placeholder-cream-600 focus:outline-none focus:border-gold-400"
            />
          </div>
        </div>

        {/* City & Country */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-cream-300 mb-1.5 font-mono">
              City
            </label>
            <input
              type="text"
              placeholder="e.g., Karur, Trichy, Chennai"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full rounded-xl bg-universe-950 border border-white/[0.1] px-4 py-2.5 text-sm text-cream-100 placeholder-cream-600 focus:outline-none focus:border-gold-400"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-cream-300 mb-1.5 font-mono">
              Country
            </label>
            <input
              type="text"
              placeholder="India"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full rounded-xl bg-universe-950 border border-white/[0.1] px-4 py-2.5 text-sm text-cream-100 placeholder-cream-600 focus:outline-none focus:border-gold-400"
            />
          </div>
        </div>

        {/* Category & Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-cream-300 mb-1.5 font-mono">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as PlaceCategory)}
              className="w-full rounded-xl bg-universe-950 border border-white/[0.1] px-4 py-2.5 text-sm text-cream-100 focus:outline-none focus:border-gold-400"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-cream-300 mb-1.5 font-mono">
              Visited Date *
            </label>
            <input
              type="date"
              required
              value={visitedDate}
              onChange={(e) => setVisitedDate(e.target.value)}
              className="w-full rounded-xl bg-universe-950 border border-white/[0.1] px-4 py-2.5 text-sm text-cream-100 focus:outline-none focus:border-gold-400 font-mono"
            />
          </div>
        </div>

        {/* GPS Coordinates */}
        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono text-gold-300 uppercase tracking-wider">
            <Compass className="w-3.5 h-3.5 text-gold-400" />
            <span>Map GPS Coordinates (Tamil Nadu Focus)</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-cream-400 mb-1 font-mono">
                Latitude (e.g. 10.9601)
              </label>
              <input
                type="number"
                step="any"
                placeholder="10.9601"
                value={lat}
                onChange={(e) => setLat(e.target.value)}
                className="w-full rounded-xl bg-universe-950 border border-white/[0.1] px-3.5 py-2 text-xs text-cream-100 placeholder-cream-600 focus:outline-none focus:border-gold-400 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs text-cream-400 mb-1 font-mono">
                Longitude (e.g. 78.0766)
              </label>
              <input
                type="number"
                step="any"
                placeholder="78.0766"
                value={lng}
                onChange={(e) => setLng(e.target.value)}
                className="w-full rounded-xl bg-universe-950 border border-white/[0.1] px-3.5 py-2 text-xs text-cream-100 placeholder-cream-600 focus:outline-none focus:border-gold-400 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Description & Story */}
        <div>
          <label className="block text-xs uppercase tracking-wider text-cream-300 mb-1.5 font-mono">
            Place Story *
          </label>
          <textarea
            required
            rows={3}
            placeholder="Describe what we did here, the atmosphere, the sweet memories..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-xl bg-universe-950 border border-white/[0.1] p-3.5 text-sm text-cream-100 placeholder-cream-600 focus:outline-none focus:border-gold-400 font-sans leading-relaxed"
          />
        </div>

        {/* Personal Memory Note */}
        <div>
          <label className="block text-xs uppercase tracking-wider text-cream-300 mb-1.5 font-mono">
            Unforgettable Moment / Personal Note (Optional)
          </label>
          <textarea
            rows={2}
            placeholder="The secret whisper, the inside joke, or the quiet smile..."
            value={memoryNote}
            onChange={(e) => setMemoryNote(e.target.value)}
            className="w-full rounded-xl bg-universe-950 border border-white/[0.1] p-3.5 text-sm text-cream-100 placeholder-cream-600 focus:outline-none focus:border-gold-400 font-serif italic"
          />
        </div>

        {/* Photo URL */}
        <div>
          <label className="block text-xs uppercase tracking-wider text-cream-300 mb-1.5 font-mono flex items-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5 text-gold-400" />
            Photo URL
          </label>
          <input
            type="url"
            placeholder="https://images.unsplash.com/..."
            value={photoUrl}
            onChange={(e) => setPhotoUrl(e.target.value)}
            className="w-full rounded-xl bg-universe-950 border border-white/[0.1] px-4 py-2.5 text-sm text-cream-100 placeholder-cream-600 focus:outline-none focus:border-gold-400 font-mono text-xs"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-3 border-t border-white/[0.06]">
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="gold"
            size="sm"
            icon={<MapPin className="w-3.5 h-3.5" />}
          >
            Pin Coordinate
          </Button>
        </div>
      </form>
    </Modal>
  );
}
