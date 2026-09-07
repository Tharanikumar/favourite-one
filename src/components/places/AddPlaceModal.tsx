"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Place, PlaceCategory } from "@/lib/supabase/types";
import {
  MapPin,
  Compass,
  Image as ImageIcon,
} from "lucide-react";

interface AddPlaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (newPlace: Place) => void;
}

export function AddPlaceModal({
  isOpen,
  onClose,
  onAdd,
}: AddPlaceModalProps) {
  const [title, setTitle] = useState("");
  const [locationName, setLocationName] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [visitedDate, setVisitedDate] = useState("");
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !locationName.trim() || !visitedDate) return;

    const parsedLat = parseFloat(lat) || 37.7749;
    const parsedLng = parseFloat(lng) || -122.4194;

    const newPlace: Place = {
      id: `pl-${Date.now()}`,
      title: title.trim(),
      location_name: locationName.trim(),
      city: city.trim() || undefined,
      country: country.trim() || undefined,
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

    // Reset form
    setTitle("");
    setLocationName("");
    setCity("");
    setCountry("");
    setLat("");
    setLng("");
    setVisitedDate("");
    setDescription("");
    setMemoryNote("");
    setPhotoUrl("");
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Pin a Special Coordinate"
      subtitle="Save another sacred place into your private relationship map."
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title & Location Name */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-cream-300 mb-1.5 font-mono">
              Place Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g., The Corner Coffeehouse"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl bg-universe-950 border border-white/[0.1] px-4 py-2.5 text-sm text-cream-100 placeholder-cream-600 focus:outline-none focus:border-gold-400"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-cream-300 mb-1.5 font-mono">
              Specific Spot / Address
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Table 3, Café de l'Ambre"
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
              placeholder="e.g., San Francisco, Paris, Kyoto"
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
              placeholder="e.g., United States, France, Japan"
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
              Visited Date
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
            <span>Map GPS Coordinates</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-cream-400 mb-1">
                Latitude (e.g. 37.7749)
              </label>
              <input
                type="number"
                step="any"
                placeholder="37.7749"
                value={lat}
                onChange={(e) => setLat(e.target.value)}
                className="w-full rounded-xl bg-universe-950 border border-white/[0.1] px-3.5 py-2 text-xs text-cream-100 placeholder-cream-600 focus:outline-none focus:border-gold-400 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs text-cream-400 mb-1">
                Longitude (e.g. -122.4194)
              </label>
              <input
                type="number"
                step="any"
                placeholder="-122.4194"
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
            Place Story
          </label>
          <textarea
            required
            rows={3}
            placeholder="Describe what we did here, the atmosphere, the scenery..."
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
            placeholder="The secret whisper, the inside joke, or the quiet revelation..."
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
            className="w-full rounded-xl bg-universe-950 border border-white/[0.1] px-4 py-2.5 text-sm text-cream-100 placeholder-cream-600 focus:outline-none focus:border-gold-400"
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
