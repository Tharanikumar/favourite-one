"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { PageTransition } from "@/components/layout/PageTransition";
import { TimelineEventCard } from "@/components/timeline/TimelineEventCard";
import { TimelineDetailModal } from "@/components/timeline/TimelineDetailModal";
import { AddTimelineEventModal } from "@/components/timeline/AddTimelineEventModal";
import { MOCK_TIMELINE_EVENTS } from "@/lib/mockData";
import { TimelineEvent } from "@/lib/types";
import { MobileBottomNav } from "@/components/dashboard/MobileBottomNav";
import { Plus } from "lucide-react";

export default function TimelinePage() {
  const [events, setEvents] = useState<TimelineEvent[]>(MOCK_TIMELINE_EVENTS);
  const [filter, setFilter] = useState<string>("All");
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const filterOptions = [
    { label: "All", count: events.length },
    { label: "Milestones", count: events.filter((e) => e.category === "Milestones").length },
    { label: "Trips", count: events.filter((e) => e.category === "Trips").length },
    { label: "Photos", count: events.filter((e) => e.category === "Photos").length },
    { label: "Special Moments", count: events.filter((e) => e.category === "Special Moments").length },
  ];

  const filteredEvents =
    filter === "All"
      ? events
      : events.filter((e) => e.category === filter);

  const handleAddEvent = (newEvent: TimelineEvent) => {
    setEvents([newEvent, ...events]);
  };

  return (
    <PageTransition>
      <Section
        eyebrow="Our Chronology"
        title="The Story of Our Universe"
        subtitle="Every serendipitous meeting, shared horizon, whispered promise, and milestone that brought us to where we stand today."
        centered={true}
      >
        {/* Filter Controls & Add Event Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-16 max-w-5xl mx-auto">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {filterOptions.map((opt) => (
              <button
                key={opt.label}
                onClick={() => setFilter(opt.label)}
                className={`px-4 py-1.5 rounded-full text-xs font-sans tracking-wide transition-all duration-300 flex items-center gap-1.5 ${
                  filter === opt.label
                    ? "bg-gold-500 text-universe-950 font-semibold shadow-glow-sm"
                    : "bg-white/[0.04] text-cream-300 hover:text-white border border-white/[0.08]"
                }`}
              >
                <span>{opt.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    filter === opt.label
                      ? "bg-universe-950/20 text-universe-950"
                      : "bg-universe-800 text-cream-400"
                  }`}
                >
                  {opt.count}
                </span>
              </button>
            ))}
          </div>

          {/* Add Milestone CTA */}
          <Button
            variant="gold"
            size="sm"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => setIsAddOpen(true)}
          >
            Chronicle Milestone
          </Button>
        </div>

        {/* Vertical Cinematic Timeline */}
        <div className="relative max-w-5xl mx-auto">
          {/* Central / Left Glowing Timeline Line */}
          <div className="absolute left-6 md:left-1/2 top-4 bottom-4 w-px bg-gradient-to-b from-gold-400/50 via-rose-400/40 to-transparent -translate-x-1/2 pointer-events-none" />

          <div className="space-y-12 sm:space-y-16">
            <AnimatePresence mode="popLayout">
              {filteredEvents.map((event, idx) => {
                const isEven = idx % 2 === 0;

                return (
                  <motion.div
                    key={event.id}
                    layout
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.6, delay: idx * 0.05 }}
                    className={`relative flex flex-col md:flex-row items-start md:items-center ${
                      isEven ? "md:flex-row-reverse" : ""
                    }`}
                  >
                    {/* Glowing Timeline Center Node */}
                    <div className="absolute left-6 md:left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-universe-950 border-2 border-gold-400 flex items-center justify-center shadow-glow-gold z-20">
                      <div className="w-2.5 h-2.5 rounded-full bg-gold-400 animate-pulse" />
                    </div>

                    {/* Spacer for Alternate Desktop Side */}
                    <div className="hidden md:block w-1/2" />

                    {/* Timeline Event Card Container */}
                    <div className="ml-14 md:ml-0 md:w-1/2 md:px-8 w-full">
                      <TimelineEventCard
                        event={event}
                        onClick={(ev) => setSelectedEvent(ev)}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </Section>

      {/* Detail Memory Modal */}
      <TimelineDetailModal
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />

      {/* Add Event Modal */}
      <AddTimelineEventModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onAddEvent={handleAddEvent}
      />

      <MobileBottomNav />
    </PageTransition>
  );
}
