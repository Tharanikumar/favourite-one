"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { MediaUploader } from "@/components/admin/MediaUploader";
import { DeleteConfirmModal } from "@/components/admin/DeleteConfirmModal";
import { MOCK_PLACES } from "@/lib/mockData";
import { Place, PlaceCategory } from "@/lib/supabase/types";
import { formatDate } from "@/lib/utils";
import { useToast } from "@/lib/toast/ToastContext";
import { Plus, Edit2, Trash2, MapPin } from "lucide-react";

export default function AdminPlacesPage() {
  const toast = useToast();
  const [places, setPlaces] = useState<Place[]>(MOCK_PLACES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlace, setEditingPlace] = useState<Place | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [locationName, setLocationName] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [lat, setLat] = useState<number>(0);
  const [lng, setLng] = useState<number>(0);
  const [visitedDate, setVisitedDate] = useState("");
  const [category, setCategory] = useState<PlaceCategory>("Travel");
  const [description, setDescription] = useState("");
  const [memoryNote, setMemoryNote] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);

  const handleOpenAdd = () => {
    setEditingPlace(null);
    setTitle("");
    setLocationName("");
    setCity("");
    setCountry("");
    setLat(48.8566);
    setLng(2.3522);
    setVisitedDate(new Date().toISOString().split("T")[0]);
    setCategory("Travel");
    setDescription("");
    setMemoryNote("");
    setPhotoUrl("");
    setIsFavorite(false);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: Place) => {
    setEditingPlace(p);
    setTitle(p.title);
    setLocationName(p.location_name);
    setCity(p.city || "");
    setCountry(p.country || "");
    setLat(p.lat);
    setLng(p.lng);
    setVisitedDate(p.visited_date);
    setCategory(p.category);
    setDescription(p.description);
    setMemoryNote(p.memory_note || "");
    setPhotoUrl(p.photo_url || "");
    setIsFavorite(p.is_favorite || false);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !locationName.trim()) return;

    if (editingPlace) {
      setPlaces((prev) =>
        prev.map((p) =>
          p.id === editingPlace.id
            ? {
                ...p,
                title,
                location_name: locationName,
                city,
                country,
                lat,
                lng,
                visited_date: visitedDate,
                category,
                description,
                memory_note: memoryNote,
                photo_url: photoUrl || undefined,
                is_favorite: isFavorite,
                updated_at: new Date().toISOString(),
              }
            : p
        )
      );
      toast.success("Place Updated", title);
    } else {
      const newPlace: Place = {
        id: "plc-" + Date.now().toString(36),
        title,
        location_name: locationName,
        city,
        country,
        lat,
        lng,
        visited_date: visitedDate,
        category,
        description,
        memory_note: memoryNote,
        photo_url: photoUrl || undefined,
        is_favorite: isFavorite,
        created_at: new Date().toISOString(),
      };
      setPlaces([newPlace, ...places]);
      toast.success("Place Pinned", title);
    }

    setIsModalOpen(false);
  };

  const handleDelete = () => {
    if (!deleteId) return;
    setPlaces((prev) => prev.filter((p) => p.id !== deleteId));
    toast.info("Place Deleted", "Removed from map.");
    setDeleteId(null);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="rose" size="sm">
              Coordinates CMS
            </Badge>
            <span className="text-xs text-cream-400 font-mono">Special Places</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl text-cream-50 font-normal">
            Manage Geographic Places
          </h1>
          <p className="text-xs text-cream-300 font-sans mt-0.5">
            Pin coordinates, write secret memory notes, and link location photographs.
          </p>
        </div>

        <Button variant="gold" size="sm" icon={<Plus className="w-4 h-4" />} onClick={handleOpenAdd}>
          Pin New Place
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {places.map((p) => (
          <Card key={p.id} className="p-5 flex flex-col justify-between border-white/[0.08] bg-universe-900/70">
            <div className="space-y-3">
              {p.photo_url && (
                <div className="relative aspect-[16/10] rounded-xl overflow-hidden border border-white/[0.08]">
                  <Image src={p.photo_url} alt={p.title} fill className="object-cover" />
                </div>
              )}

              <div className="flex items-center justify-between">
                <Badge variant="gold" size="sm">
                  {p.category}
                </Badge>
                <span className="text-xs text-cream-400 font-mono">
                  {formatDate(p.visited_date)}
                </span>
              </div>

              <div>
                <h3 className="font-serif text-lg text-cream-50 line-clamp-1">{p.title}</h3>
                <div className="flex items-center gap-1 text-[11px] text-rose-300 font-mono mt-0.5">
                  <MapPin className="w-3 h-3 shrink-0" />
                  <span className="truncate">{p.location_name}, {p.city || p.country}</span>
                </div>
              </div>

              <p className="text-xs text-cream-300 font-sans line-clamp-2 leading-relaxed">
                {p.description}
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 mt-4 border-t border-white/[0.06]">
              <Button
                variant="ghost"
                size="sm"
                className="p-2 h-8 text-cream-300 hover:text-gold-300"
                onClick={() => handleOpenEdit(p)}
              >
                <Edit2 className="w-3.5 h-3.5 mr-1" /> Edit
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="p-2 h-8 text-rose-400 hover:bg-rose-500/10"
                onClick={() => setDeleteId(p.id)}
              >
                <Trash2 className="w-3.5 h-3.5 mr-1" /> Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingPlace ? "Edit Pinned Place" : "Pin New Special Place"}
        subtitle="Add coordinates and memories to our couple map."
        size="md"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-cream-300 mb-1.5 font-sans">
              Place Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g., The Lookout Point at Big Sur"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl bg-universe-950 border border-white/[0.1] px-4 py-2.5 text-sm text-cream-100 placeholder-cream-600 focus:outline-none focus:border-gold-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-cream-300 mb-1.5 font-sans">
                Location Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g., Café de Flore"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                className="w-full rounded-xl bg-universe-950 border border-white/[0.1] px-3.5 py-2.5 text-sm text-cream-100 focus:outline-none focus:border-gold-400"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-cream-300 mb-1.5 font-sans">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as PlaceCategory)}
                className="w-full rounded-xl bg-universe-950 border border-white/[0.1] px-3.5 py-2.5 text-sm text-cream-100 focus:outline-none focus:border-gold-400"
              >
                <option value="Travel">Travel</option>
                <option value="First Date">First Date</option>
                <option value="Favorite Café">Favorite Café</option>
                <option value="Stargazing">Stargazing</option>
                <option value="Adventures">Adventures</option>
                <option value="Quiet Moment">Quiet Moment</option>
                <option value="Home">Home</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-cream-300 mb-1.5 font-sans">
                City
              </label>
              <input
                type="text"
                placeholder="e.g., Paris"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full rounded-xl bg-universe-950 border border-white/[0.1] px-3.5 py-2.5 text-sm text-cream-100 focus:outline-none focus:border-gold-400"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-cream-300 mb-1.5 font-sans">
                Country
              </label>
              <input
                type="text"
                placeholder="e.g., France"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full rounded-xl bg-universe-950 border border-white/[0.1] px-3.5 py-2.5 text-sm text-cream-100 focus:outline-none focus:border-gold-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-cream-300 mb-1.5 font-sans">
                Latitude (lat)
              </label>
              <input
                type="number"
                step="any"
                value={lat}
                onChange={(e) => setLat(parseFloat(e.target.value) || 0)}
                className="w-full rounded-xl bg-universe-950 border border-white/[0.1] px-3.5 py-2.5 text-sm text-cream-100 focus:outline-none focus:border-gold-400 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-cream-300 mb-1.5 font-sans">
                Longitude (lng)
              </label>
              <input
                type="number"
                step="any"
                value={lng}
                onChange={(e) => setLng(parseFloat(e.target.value) || 0)}
                className="w-full rounded-xl bg-universe-950 border border-white/[0.1] px-3.5 py-2.5 text-sm text-cream-100 focus:outline-none focus:border-gold-400 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-cream-300 mb-1.5 font-sans">
              Visited Date
            </label>
            <input
              type="date"
              required
              value={visitedDate}
              onChange={(e) => setVisitedDate(e.target.value)}
              className="w-full rounded-xl bg-universe-950 border border-white/[0.1] px-3.5 py-2.5 text-sm text-cream-100 focus:outline-none focus:border-gold-400"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-cream-300 mb-1.5 font-sans">
              Place Description
            </label>
            <textarea
              rows={2}
              placeholder="What makes this coordinate special?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl bg-universe-950 border border-white/[0.1] p-3 text-sm text-cream-100 placeholder-cream-600 focus:outline-none focus:border-gold-400 font-sans"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-cream-300 mb-1.5 font-sans">
              Secret Memory Note (Personal)
            </label>
            <textarea
              rows={2}
              placeholder="An intimate quote, note, or inside joke from this spot..."
              value={memoryNote}
              onChange={(e) => setMemoryNote(e.target.value)}
              className="w-full rounded-xl bg-universe-950 border border-white/[0.1] p-3 text-sm text-cream-100 placeholder-cream-600 focus:outline-none focus:border-gold-400 font-serif italic"
            />
          </div>

          <MediaUploader
            label="Location Photograph"
            accept="image"
            currentUrl={photoUrl}
            onUploadComplete={(url) => setPhotoUrl(url)}
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-white/[0.06]">
            <Button type="button" variant="ghost" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="gold" size="sm" icon={<MapPin className="w-3.5 h-3.5" />}>
              Save Place
            </Button>
          </div>
        </form>
      </Modal>

      <DeleteConfirmModal
        isOpen={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Pinned Place"
        itemName={places.find((p) => p.id === deleteId)?.title}
      />
    </div>
  );
}
