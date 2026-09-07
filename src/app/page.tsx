"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { APP_CONFIG } from "@/lib/constants";
import { MOCK_MEMORIES, MOCK_MILESTONES } from "@/lib/mockData";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";
import { DaysCounter } from "@/components/ui/DaysCounter";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { AmbientSoundPlayer } from "@/components/ui/AmbientSoundPlayer";
import { formatDate } from "@/lib/utils";
import { OpeningExperience } from "@/components/intro";
import {
  Sparkles,
  ArrowRight,
  ArrowDown,
  Mail,
  Camera,
  MapPin,
  Clock,
  Lock,
  Compass,
  CheckCircle,
  Play,
} from "lucide-react";

export default function HomePage() {
  const [selectedPhoto, setSelectedPhoto] = useState<(typeof MOCK_MEMORIES)[0] | null>(null);
  const [showIntro, setShowIntro] = useState(true);

  const scrollToStory = () => {
    const el = document.getElementById("story-intro");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative overflow-hidden">
      {/* ------------------------------------------------------------- */}
      {/* CINEMATIC ROMANTIC OPENING ANIMATION EXPERIENCE               */}
      {/* ------------------------------------------------------------- */}
      {showIntro && (
        <OpeningExperience onComplete={() => setShowIntro(false)} />
      )}
      {/* ------------------------------------------------------------- */}
      {/* 1. CINEMATIC FULL-VIEWPORT HERO SECTION                       */}
      {/* ------------------------------------------------------------- */}
      <section className="relative min-h-[100svh] w-full flex flex-col justify-between items-center px-4 sm:px-6 lg:px-8 pt-24 pb-10 sm:pb-12 text-center overflow-hidden">
        {/* Cinematic Background Image with Slow Ambient Parallax Drift */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <motion.div
            initial={{ scale: 1.08 }}
            animate={{
              scale: [1.08, 1.14, 1.08],
              x: [0, -8, 0],
              y: [0, -6, 0],
            }}
            transition={{
              duration: 24,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="relative w-full h-full opacity-35"
          >
            <Image
              src="https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=2000&q=90"
              alt="Our Little Universe background"
              fill
              priority
              className="object-cover object-center filter contrast-[1.05] saturate-[1.1]"
            />
          </motion.div>

          {/* Luminous Soft Blush Overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-universe-900/80 via-white/50 to-background" />
          <div className="absolute inset-0 bg-radial-gradient from-transparent via-universe-900/40 to-background" />
        </div>

        {/* Ambient Top Glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] sm:w-[700px] h-[350px] bg-gradient-radial from-rose-400/[0.15] via-peach-400/[0.1] to-transparent rounded-full blur-3xl pointer-events-none z-10" />

        {/* Top Empty Spacer for Centering Balance */}
        <div className="w-full" />

        {/* Center Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto space-y-6 sm:space-y-8 my-auto">
          {/* Couple Monogram Crest Badge */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/90 border border-rose-400/30 shadow-glass backdrop-blur-xl"
          >
            <Sparkles className="w-3.5 h-3.5 text-rose-500" />
            <span className="text-[11px] sm:text-xs uppercase tracking-[0.25em] font-sans font-semibold text-cream-100">
              {APP_CONFIG.couple.partner1} &amp; {APP_CONFIG.couple.partner2} &bull; Personal Sanctuary
            </span>
          </motion.div>

          {/* Main Hero Headline */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-3 sm:space-y-4"
          >
            <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-normal text-cream-50 tracking-tight leading-[1.08]">
              Our Little <span className="rose-gradient-text italic font-serif">Universe</span>
            </h1>
            <p className="text-sm sm:text-lg md:text-xl text-cream-200 font-sans font-light max-w-xl mx-auto leading-relaxed px-2">
              A collection of moments that became our story.
            </p>
          </motion.div>

          {/* Hero CTAs: Enter Our Story, Replay Intro & Ambient Music Player */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 pt-2 sm:pt-4"
          >
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button
                variant="rose"
                size="lg"
                icon={<ArrowRight className="w-4 h-4" />}
                iconPosition="right"
                className="w-full sm:w-auto px-8 shadow-glow-rose"
              >
                Enter Our Story
              </Button>
            </Link>

            <Button
              variant="glass"
              size="lg"
              icon={<Play className="w-4 h-4 text-rose-500 fill-rose-500/20" />}
              onClick={() => setShowIntro(true)}
              className="w-full sm:w-auto"
            >
              Replay Intro
            </Button>

            <AmbientSoundPlayer variant="hero" className="w-full sm:w-auto" />
          </motion.div>
        </div>

        {/* Bottom Bar: Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="relative z-10 w-full flex flex-col items-center justify-center gap-2 pt-6"
        >
          <button
            onClick={scrollToStory}
            className="group flex flex-col items-center text-xs text-cream-400 hover:text-gold-300 transition-colors focus:outline-none"
            aria-label="Scroll to introduction"
          >
            <span className="text-[10px] uppercase tracking-widest text-cream-400/80 mb-1 group-hover:text-gold-400 transition-colors">
              Begin Journey
            </span>
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="p-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] group-hover:border-gold-400/40"
            >
              <ArrowDown className="w-3.5 h-3.5 text-gold-400" />
            </motion.div>
          </button>
        </motion.div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 2. SHORT POETIC INTRODUCTION                                  */}
      {/* ------------------------------------------------------------- */}
      <section id="story-intro" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8 }}
          className="space-y-10 text-center"
        >
          {/* Section Eyebrow */}
          <div className="inline-flex items-center gap-2">
            <div className="h-px w-8 bg-gold-400/40" />
            <span className="text-xs uppercase tracking-[0.25em] font-sans font-semibold text-gold-400">
              The Genesis
            </span>
            <div className="h-px w-8 bg-gold-400/40" />
          </div>

          {/* Emotional Narrative Intro */}
          <div className="space-y-6 max-w-3xl mx-auto">
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-cream-50 leading-[1.2]">
              In an infinite cosmos of fleeting days, <br className="hidden sm:inline" />
              <span className="italic font-serif gold-gradient-text">we found our forever.</span>
            </h2>
            <p className="text-base sm:text-lg text-cream-200 font-sans font-light leading-relaxed">
              This space is an intimate digital sanctuary dedicated to the memories we create, the handwritten letters we seal, the special coordinates we navigate, and the promises that anchor our lives together.
            </p>
          </div>

          {/* Relationship Duration Live Counter */}
          <div className="pt-4">
            <div className="mb-4">
              <span className="text-xs uppercase tracking-widest text-cream-400">
                Time Transpired In Our Universe
              </span>
            </div>
            <DaysCounter showDetailed={true} />
          </div>
        </motion.div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 3. RELATIONSHIP TIMELINE PREVIEW                              */}
      {/* ------------------------------------------------------------- */}
      <Section
        eyebrow="Chronicle Highlights"
        title="Key Milestones of Our Journey"
        subtitle="The pivotal chapters that shaped who we are today."
        centered={true}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {MOCK_MILESTONES.slice(0, 3).map((milestone, idx) => (
            <motion.div
              key={milestone.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
            >
              <Card
                className="h-full p-6 flex flex-col justify-between border-white/[0.08] hover:border-gold-400/30"
                hoverEffect={true}
              >
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <Badge variant={milestone.is_major ? "gold" : "subtle"} size="sm">
                      {milestone.category}
                    </Badge>
                    <span className="text-xs text-cream-400 font-sans">
                      {formatDate(milestone.date)}
                    </span>
                  </div>

                  <h3 className="font-serif text-xl text-cream-50 font-normal">
                    {milestone.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-cream-300 font-sans leading-relaxed line-clamp-3">
                    {milestone.description}
                  </p>
                </div>

                {milestone.highlight_quote && (
                  <div className="pt-4 mt-4 border-t border-white/[0.04] text-xs font-serif italic text-gold-300/90 line-clamp-2">
                    &ldquo;{milestone.highlight_quote}&rdquo;
                  </div>
                )}
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link href="/timeline">
            <Button
              variant="outline"
              size="md"
              icon={<Clock className="w-4 h-4 text-gold-400" />}
            >
              View Full Relationship Timeline
            </Button>
          </Link>
        </div>
      </Section>

      {/* ------------------------------------------------------------- */}
      {/* 4. FEATURED MEMORY SPOTLIGHT                                 */}
      {/* ------------------------------------------------------------- */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="rounded-3xl bg-universe-900/70 border border-white/[0.1] backdrop-blur-xl p-6 sm:p-10 shadow-2xl overflow-hidden relative"
        >
          {/* Subtle Ambient Light */}
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-gold-400/[0.06] rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Image Showcase */}
            <div className="lg:col-span-7 rounded-2xl overflow-hidden shadow-2xl relative aspect-[16/10]">
              <Image
                src="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=85"
                alt="Rainy evening in Montmartre Paris"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-universe-950/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 z-10">
                <Badge variant="gold" size="sm">
                  Trip Highlight
                </Badge>
              </div>
            </div>

            {/* Right Story Info */}
            <div className="lg:col-span-5 space-y-5">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-rose-300">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Montmartre, Paris &bull; October 18, 2023</span>
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl text-cream-50 font-normal leading-snug">
                  The Rainy Evening in Montmartre
                </h3>
              </div>

              <p className="text-sm text-cream-300 font-sans leading-relaxed">
                We ducked into a small vintage bookshop while the Parisian storm washed the cobblestones clean. You found an old poetry anthology and read aloud under the warm amber lamps while the rest of the world hurried by.
              </p>

              <div className="p-4 rounded-xl bg-universe-950/70 border border-white/[0.06] text-xs font-serif italic text-gold-300">
                &ldquo;That evening taught me that a rainy day in the right company is better than a thousand sunny days alone.&rdquo;
              </div>

              <div className="pt-2">
                <Link href="/gallery">
                  <Button
                    variant="glass"
                    size="sm"
                    icon={<Camera className="w-3.5 h-3.5 text-gold-400" />}
                  >
                    Explore Memory Album
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 5. PHOTO PREVIEW GRID                                         */}
      {/* ------------------------------------------------------------- */}
      <Section
        eyebrow="Visual Tapestry"
        title="Moments Caught in Time"
        subtitle="A glance into some of our sweetest memories across the globe."
        centered={true}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
          {MOCK_MEMORIES.slice(1, 5).map((memory, idx) => (
            <motion.div
              key={memory.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              onClick={() => setSelectedPhoto(memory)}
              className="group cursor-pointer rounded-2xl overflow-hidden bg-universe-900/60 border border-white/[0.07] hover:border-gold-400/40 transition-all duration-300 shadow-glass flex flex-col"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={memory.media_url || ""}
                  alt={memory.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-universe-950/90 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
                <div className="absolute bottom-3 left-3 right-3">
                  <span className="text-[10px] uppercase tracking-wider text-gold-400 block mb-0.5 font-mono">
                    {formatDate(memory.date)}
                  </span>
                  <h4 className="font-serif text-sm text-cream-50 line-clamp-1 font-normal">
                    {memory.title}
                  </h4>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link href="/gallery">
            <Button
              variant="outline"
              size="md"
              icon={<Camera className="w-4 h-4 text-gold-400" />}
            >
              Browse Complete Gallery
            </Button>
          </Link>
        </div>
      </Section>

      {/* ------------------------------------------------------------- */}
      {/* 6. IMPORTANT DATE PREVIEW                                     */}
      {/* ------------------------------------------------------------- */}
      <Section
        eyebrow="Sacred Calendar"
        title="Dates Etched in Our Starlight"
        subtitle="Anniversaries and milestones we honor each year."
        centered={true}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            {
              title: "Our Anniversary",
              date: "April 14",
              year: "Annual Celebration",
              description: "The day our universe aligned and our journey officially began.",
              icon: <Sparkles className="w-5 h-5 text-gold-400" />,
              badge: "Anniversary",
            },
            {
              title: "Keys to Our Sanctuary",
              date: "June 01",
              year: "2024",
              description: "Opening the door to our first shared home together.",
              icon: <CheckCircle className="w-5 h-5 text-rose-400" />,
              badge: "Home",
            },
            {
              title: "Next Planned Voyage",
              date: "Upcoming",
              year: "Autumn 2026",
              description: "Chasing the Northern Lights from a glass cabin in Lapland.",
              icon: <Compass className="w-5 h-5 text-gold-300" />,
              badge: "Bucket List",
            },
          ].map((item, idx) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <Card className="p-6 h-full flex flex-col justify-between border-white/[0.08]" hoverEffect={true}>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="p-2.5 rounded-xl bg-universe-800 border border-white/[0.06]">
                      {item.icon}
                    </span>
                    <Badge variant="gold" size="sm">
                      {item.badge}
                    </Badge>
                  </div>

                  <div>
                    <span className="font-serif text-3xl text-cream-50 font-normal block">
                      {item.date}
                    </span>
                    <span className="text-xs uppercase tracking-widest text-gold-400 font-mono">
                      {item.year}
                    </span>
                  </div>

                  <h4 className="font-serif text-lg text-cream-100 font-normal">
                    {item.title}
                  </h4>

                  <p className="text-xs text-cream-300 font-sans leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* ------------------------------------------------------------- */}
      {/* 7. FINAL EMOTIONAL CTA                                        */}
      {/* ------------------------------------------------------------- */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="p-8 sm:p-14 rounded-3xl bg-gradient-to-b from-white via-universe-900 to-universe-850 border border-rose-400/40 shadow-2xl backdrop-blur-2xl relative overflow-hidden space-y-8"
        >
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-rose-400/[0.12] rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-4 max-w-2xl mx-auto relative z-10">
            <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-400/30 mx-auto flex items-center justify-center text-rose-500 shadow-glow-rose">
              <Sparkles className="w-6 h-6" />
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-cream-50 leading-tight">
              Every chapter of my life is <br />
              <span className="rose-gradient-text italic font-serif">better with you in it.</span>
            </h2>

            <p className="text-xs sm:text-sm md:text-base text-cream-300 font-sans font-light leading-relaxed">
              Step inside our archives to read private letters, discover coordinates of our favorite hideaways, or unlock our confidential voice memos.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3.5 sm:gap-4 relative z-10 pt-2">
            <Link href="/letters">
              <Button
                variant="rose"
                size="md"
                icon={<Mail className="w-4 h-4" />}
              >
                Read Preserved Letters
              </Button>
            </Link>

            <Link href="/vault">
              <Button
                variant="glass"
                size="md"
                icon={<Lock className="w-4 h-4 text-rose-500" />}
              >
                Unlock Sanctuary Vault
              </Button>
            </Link>
          </div>

          <div className="pt-6 border-t border-universe-750/50 text-xs text-cream-400 font-serif italic relative z-10">
            Dedicated to {APP_CONFIG.couple.partner1} &amp; {APP_CONFIG.couple.partner2} &bull; Forever and Always
          </div>
        </motion.div>
      </section>

      {/* Photo Detail Modal */}
      {selectedPhoto && (
        <Modal
          isOpen={Boolean(selectedPhoto)}
          onClose={() => setSelectedPhoto(null)}
          title={selectedPhoto.title}
          subtitle={`${formatDate(selectedPhoto.date)} • ${selectedPhoto.location || ""}`}
          size="lg"
        >
          <div className="space-y-6">
            <div className="relative aspect-[16/10] rounded-2xl overflow-hidden">
              <Image
                src={selectedPhoto.media_url || ""}
                alt={selectedPhoto.title}
                fill
                className="object-cover"
              />
            </div>
            <p className="text-sm sm:text-base text-cream-100 font-sans leading-relaxed">
              {selectedPhoto.description}
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
}
