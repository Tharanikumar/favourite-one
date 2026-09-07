"use client";

import React, { useEffect, useRef } from "react";

interface ParticleHeartProps {
  isDissolving?: boolean;
  className?: string;
}

interface Particle {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  originX: number;
  originY: number;
  size: number;
  color: string;
  alpha: number;
  speed: number;
  angle: number;
  distance: number;
  vx: number;
  vy: number;
  twinkleSpeed: number;
}

interface Petal {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
}

export function ParticleHeart({
  isDissolving = false,
  className = "",
}: ParticleHeartProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
      initParticles();
    };

    window.addEventListener("resize", handleResize);

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Heart parametric function
    const getHeartPoint = (t: number, scale: number) => {
      const x = 16 * Math.pow(Math.sin(t), 3);
      const y = -(
        13 * Math.cos(t) -
        5 * Math.cos(2 * t) -
        2 * Math.cos(3 * t) -
        Math.cos(4 * t)
      );
      return { x: x * scale, y: y * scale };
    };

    const particleColors = [
      "rgba(253, 232, 233, ", // Blush Pink
      "rgba(254, 222, 200, ", // Soft Peach
      "rgba(204, 138, 155, ", // Dusty Rose
      "rgba(215, 190, 223, ", // Mauve
      "rgba(235, 178, 190, ", // Rose Sheen
    ];

    let particles: Particle[] = [];
    let petals: Petal[] = [];

    const initParticles = () => {
      particles = [];
      const particleCount = width < 640 ? 120 : 220;
      const heartScale = width < 640 ? 8 : 12;
      const centerX = width / 2;
      const centerY = height / 2 - 10;

      for (let i = 0; i < particleCount; i++) {
        const t = Math.PI * 2 * (i / particleCount) + (Math.random() - 0.5) * 0.15;
        const pt = getHeartPoint(t, heartScale);
        
        // Random offset for organic cloud thickness
        const offsetDist = Math.random() * (width < 640 ? 10 : 16);
        const offsetAngle = Math.random() * Math.PI * 2;
        const targetX = centerX + pt.x + Math.cos(offsetAngle) * offsetDist;
        const targetY = centerY + pt.y + Math.sin(offsetAngle) * offsetDist;

        // Originates from scattered cloud
        const spawnRadius = Math.random() * (Math.min(width, height) * 0.45);
        const spawnAngle = Math.random() * Math.PI * 2;
        const originX = centerX + Math.cos(spawnAngle) * spawnRadius;
        const originY = centerY + Math.sin(spawnAngle) * spawnRadius;

        particles.push({
          x: originX,
          y: originY,
          targetX,
          targetY,
          originX,
          originY,
          size: Math.random() * 2 + 1,
          color: particleColors[Math.floor(Math.random() * particleColors.length)],
          alpha: Math.random() * 0.6 + 0.3,
          speed: Math.random() * 0.04 + 0.025,
          angle: Math.random() * Math.PI * 2,
          distance: 0,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          twinkleSpeed: Math.random() * 0.03 + 0.01,
        });
      }

      // Background soft petals
      petals = [];
      const petalCount = 14;
      for (let i = 0; i < petalCount; i++) {
        petals.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 5 + 4,
          speedY: Math.random() * 0.4 + 0.2,
          speedX: (Math.random() - 0.5) * 0.3,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.02,
          opacity: Math.random() * 0.25 + 0.15,
        });
      }
    };

    initParticles();

    let time = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      time += 0.02;

      // Render floating petals
      if (!prefersReducedMotion) {
        for (const petal of petals) {
          petal.y += petal.speedY;
          petal.x += Math.sin(time + petal.y * 0.01) * 0.3 + petal.speedX;
          petal.rotation += petal.rotationSpeed;

          if (petal.y > height + 20) {
            petal.y = -20;
            petal.x = Math.random() * width;
          }

          ctx.save();
          ctx.translate(petal.x, petal.y);
          ctx.rotate(petal.rotation);
          ctx.beginPath();
          ctx.ellipse(0, 0, petal.size * 1.3, petal.size * 0.7, 0, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(235, 178, 190, ${petal.opacity})`;
          ctx.fill();
          ctx.restore();
        }
      }

      // Subtle ambient heart aura
      const centerX = width / 2;
      const centerY = height / 2 - 10;
      const pulse = Math.sin(time * 2) * 6;
      const auraGradient = ctx.createRadialGradient(
        centerX,
        centerY,
        10,
        centerX,
        centerY,
        140 + pulse
      );
      auraGradient.addColorStop(0, "rgba(224, 147, 162, 0.14)");
      auraGradient.addColorStop(0.5, "rgba(254, 222, 200, 0.08)");
      auraGradient.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = auraGradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 150 + pulse, 0, Math.PI * 2);
      ctx.fill();

      // Render Heart particles
      for (const p of particles) {
        if (isDissolving) {
          p.x += p.vx * 2;
          p.y += p.vy * 2;
          p.alpha = Math.max(0, p.alpha - 0.015);
        } else if (prefersReducedMotion) {
          p.x = p.targetX;
          p.y = p.targetY;
        } else {
          // Smooth convergence toward heart outline
          const dx = p.targetX - p.x;
          const dy = p.targetY - p.y;
          p.x += dx * p.speed;
          p.y += dy * p.speed;

          // Subtle harmonic float
          p.x += Math.sin(time + p.angle) * 0.25;
          p.y += Math.cos(time + p.angle) * 0.25;
        }

        const twinkle = Math.sin(time * 3 + p.angle) * 0.2;
        const currentAlpha = Math.max(0, Math.min(1, p.alpha + twinkle));

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${currentAlpha})`;
        ctx.shadowColor = "rgba(204, 138, 155, 0.4)";
        ctx.shadowBlur = 4;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, [isDissolving]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
    />
  );
}
