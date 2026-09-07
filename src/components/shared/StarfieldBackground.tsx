"use client";

import React, { useEffect, useRef } from "react";

export function StarfieldBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    // Generate gentle romantic floating particles
    const starCount = Math.min(80, Math.floor((width * height) / 15000));
    const stars = Array.from({ length: starCount }, () => {
      const palette = [
        "224, 147, 162", // Dusty Rose
        "254, 222, 200", // Soft Peach
        "199, 215, 206", // Sage Green
        "215, 190, 223", // Mauve
        "212, 163, 89",  // Champagne Gold
      ];
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.5 + 0.4,
        alpha: Math.random() * 0.45 + 0.15,
        speed: Math.random() * 0.15 + 0.04,
        color: palette[Math.floor(Math.random() * palette.length)],
        pulseSpeed: Math.random() * 0.015 + 0.005,
        pulseDir: 1,
      };
    });

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      stars.forEach((star) => {
        // Subtle upward drift
        star.y -= star.speed;
        if (star.y < 0) {
          star.y = height;
          star.x = Math.random() * width;
        }

        // Subtle alpha pulsation
        star.alpha += star.pulseSpeed * star.pulseDir;
        if (star.alpha > 0.55) star.pulseDir = -1;
        if (star.alpha < 0.1) star.pulseDir = 1;

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${star.color}, ${star.alpha})`;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-70"
        aria-hidden="true"
      />
      {/* Soft romantic ambient glowing orbs */}
      <div className="absolute -top-32 left-1/4 w-[450px] h-[450px] bg-rose-400/[0.12] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-32 w-[500px] h-[500px] bg-peach-400/[0.18] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 left-1/3 w-[550px] h-[550px] bg-sage-400/[0.12] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -left-20 w-[400px] h-[400px] bg-mauve-400/[0.1] rounded-full blur-3xl pointer-events-none" />
    </div>
  );
}
