"use client";

import React, { useEffect, useRef } from "react";

interface FallingHeart {
  x: number;
  y: number;
  baseX: number;
  size: number;
  color: string;
  glowColor: string;
  alpha: number;
  baseAlpha: number;
  speedY: number;
  swayAmplitude: number;
  swayFrequency: number;
  rotation: number;
  rotationSpeed: number;
  phase: number;
  isOutline: boolean;
  scaleY: number;
  scaleYDir: number;
}

interface FallingPetal {
  x: number;
  y: number;
  baseX: number;
  size: number;
  color: string;
  alpha: number;
  speedY: number;
  swayAmplitude: number;
  swayFrequency: number;
  rotation: number;
  rotationSpeed: number;
  flipAngle: number;
  flipSpeed: number;
  phase: number;
}

interface SparkleParticle {
  x: number;
  y: number;
  size: number;
  alpha: number;
  color: string;
  speedY: number;
  pulseSpeed: number;
  pulseDir: number;
}

interface BurstHeart {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  rotation: number;
  rotationSpeed: number;
  life: number;
  maxLife: number;
}

export function StarfieldBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = window.devicePixelRatio || 1;

    let mouseX = -2000;
    let mouseY = -2000;
    let isRunning = true;

    // Interactive heart bursts on click
    const burstHearts: BurstHeart[] = [];

    // Romantic palette for falling hearts
    const heartPalette = [
      { fill: "255, 75, 114", glow: "rgba(255, 75, 114, 0.6)" },   // Radiant Ruby Rose
      { fill: "255, 107, 129", glow: "rgba(255, 107, 129, 0.55)" }, // Sunset Coral
      { fill: "255, 148, 175", glow: "rgba(255, 148, 175, 0.5)" },  // Soft Blush Pink
      { fill: "244, 63, 94", glow: "rgba(244, 63, 94, 0.65)" },    // Strawberry Crimson
      { fill: "251, 146, 60", glow: "rgba(251, 146, 60, 0.45)" },  // Golden Peach
      { fill: "236, 72, 153", glow: "rgba(236, 72, 153, 0.6)" },   // Neon Pink
      { fill: "216, 180, 254", glow: "rgba(216, 180, 254, 0.5)" }, // Lavender Mauve
      { fill: "255, 182, 193", glow: "rgba(255, 182, 193, 0.5)" }, // Light Pastel Pink
    ];

    // Petal color palette (sakura and deep rose petals)
    const petalPalette = [
      "255, 120, 150", // Vibrant Sakura
      "255, 150, 180", // Soft Rose Petal
      "245, 90, 130",  // Deep Rose Red
      "255, 182, 193", // Pale Blossom
      "255, 105, 140", // Cherry Blossom
    ];

    const sparklePalette = [
      "255, 220, 150", // Soft golden stardust
      "255, 190, 210", // Blush stardust
      "255, 255, 255", // Pure starlight
      "240, 170, 255", // Lilac sparkle
    ];

    const initCanvasSize = () => {
      if (!canvas) return;
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    initCanvasSize();

    // Create hearts with balanced density
    const heartCount = Math.min(36, Math.max(18, Math.floor((width * height) / 32000)));
    const hearts: FallingHeart[] = Array.from({ length: heartCount }, (_, i) => {
      const size = Math.random() * 16 + 10; // 10px to 26px
      const alpha = Math.random() * 0.45 + 0.35;
      const startX = Math.random() * width;
      const startY = (i / heartCount) * height;
      const palette = heartPalette[Math.floor(Math.random() * heartPalette.length)];

      return {
        x: startX,
        y: startY,
        baseX: startX,
        size,
        color: palette.fill,
        glowColor: palette.glow,
        alpha,
        baseAlpha: alpha,
        speedY: Math.random() * 0.65 + 0.4,
        swayAmplitude: Math.random() * 35 + 18,
        swayFrequency: Math.random() * 0.016 + 0.008,
        rotation: (Math.random() - 0.5) * 0.7,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        phase: Math.random() * Math.PI * 2,
        isOutline: Math.random() < 0.25,
        scaleY: 1,
        scaleYDir: Math.random() > 0.5 ? 0.008 : -0.008,
      };
    });

    // Create falling flower/rose petals (matching the visual in screenshot)
    const petalCount = Math.min(24, Math.max(12, Math.floor((width * height) / 45000)));
    const petals: FallingPetal[] = Array.from({ length: petalCount }, (_, i) => {
      const startX = Math.random() * width;
      const startY = (i / petalCount) * height;
      return {
        x: startX,
        y: startY,
        baseX: startX,
        size: Math.random() * 14 + 10,
        color: petalPalette[Math.floor(Math.random() * petalPalette.length)],
        alpha: Math.random() * 0.4 + 0.5,
        speedY: Math.random() * 0.8 + 0.5,
        swayAmplitude: Math.random() * 50 + 25,
        swayFrequency: Math.random() * 0.014 + 0.006,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.03,
        flipAngle: Math.random() * Math.PI * 2,
        flipSpeed: Math.random() * 0.03 + 0.01,
        phase: Math.random() * Math.PI * 2,
      };
    });

    // Create ambient sparkling particles
    const sparkleCount = Math.min(40, Math.floor((width * height) / 24000));
    const sparkles: SparkleParticle[] = Array.from({ length: sparkleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 0.8,
      alpha: Math.random() * 0.5 + 0.2,
      color: sparklePalette[Math.floor(Math.random() * sparklePalette.length)],
      speedY: Math.random() * 0.3 + 0.1,
      pulseSpeed: Math.random() * 0.025 + 0.01,
      pulseDir: Math.random() > 0.5 ? 1 : -1,
    }));

    // Draw Smooth Curved Heart Shape
    const drawHeart = (
      context: CanvasRenderingContext2D,
      x: number,
      y: number,
      size: number,
      angle: number,
      color: string,
      glowColor: string,
      alpha: number,
      isOutline: boolean,
      scaleY: number
    ) => {
      context.save();
      context.translate(x, y);
      context.rotate(angle);
      const scale = size / 24;
      context.scale(scale, scale * scaleY);

      context.beginPath();
      context.moveTo(0, 5);
      context.bezierCurveTo(-13, -12, -26, 6, 0, 23);
      context.bezierCurveTo(26, 6, 13, -12, 0, 5);

      if (isOutline) {
        context.strokeStyle = `rgba(${color}, ${alpha * 0.9})`;
        context.lineWidth = 2.2;
        context.shadowColor = glowColor;
        context.shadowBlur = size * 0.7;
        context.stroke();
      } else {
        context.fillStyle = `rgba(${color}, ${alpha})`;
        context.shadowColor = glowColor;
        context.shadowBlur = size * 0.85;
        context.fill();

        context.beginPath();
        context.ellipse(-6, 0, 3.5, 1.8, -Math.PI / 4, 0, Math.PI * 2);
        context.fillStyle = `rgba(255, 255, 255, ${alpha * 0.55})`;
        context.shadowBlur = 0;
        context.fill();
      }

      context.restore();
    };

    // Draw Falling Sakura / Rose Petal
    const drawPetal = (
      context: CanvasRenderingContext2D,
      x: number,
      y: number,
      size: number,
      rotation: number,
      flipAngle: number,
      color: string,
      alpha: number
    ) => {
      context.save();
      context.translate(x, y);
      context.rotate(rotation);
      context.scale(1, Math.cos(flipAngle));

      const w = size;
      const h = size * 1.5;

      context.beginPath();
      context.moveTo(0, -h / 2);
      context.bezierCurveTo(w / 1.5, -h / 3, w / 1.5, h / 3, 0, h / 2);
      context.bezierCurveTo(-w / 1.5, h / 3, -w / 1.5, -h / 3, 0, -h / 2);

      context.fillStyle = `rgba(${color}, ${alpha})`;
      context.shadowColor = `rgba(${color}, ${alpha * 0.5})`;
      context.shadowBlur = 8;
      context.fill();

      // Soft petal vein highlight
      context.beginPath();
      context.moveTo(0, -h / 3);
      context.quadraticCurveTo(w / 6, 0, 0, h / 3);
      context.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.4})`;
      context.lineWidth = 1;
      context.stroke();

      context.restore();
    };

    // Draw 4-point sparkle star
    const drawSparkle = (
      context: CanvasRenderingContext2D,
      x: number,
      y: number,
      size: number,
      color: string,
      alpha: number
    ) => {
      context.save();
      context.translate(x, y);

      context.fillStyle = `rgba(${color}, ${alpha})`;
      context.shadowColor = `rgba(${color}, ${alpha * 0.8})`;
      context.shadowBlur = 5;

      context.beginPath();
      context.arc(0, 0, size, 0, Math.PI * 2);
      context.fill();

      if (size > 1.4) {
        context.strokeStyle = `rgba(${color}, ${alpha * 0.7})`;
        context.lineWidth = 0.7;
        context.beginPath();
        context.moveTo(-size * 2, 0);
        context.lineTo(size * 2, 0);
        context.moveTo(0, -size * 2);
        context.lineTo(0, size * 2);
        context.stroke();
      }

      context.restore();
    };

    const handleResize = () => {
      initCanvasSize();
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouseX = e.touches[0].clientX;
        mouseY = e.touches[0].clientY;
      }
    };

    const handleClick = (e: MouseEvent) => {
      const clickX = e.clientX;
      const clickY = e.clientY;

      for (let i = 0; i < 4; i++) {
        const palette = heartPalette[Math.floor(Math.random() * heartPalette.length)];
        const angle = (Math.PI * 2 * i) / 4 + (Math.random() - 0.5) * 0.5;
        const speed = Math.random() * 2.5 + 1.5;

        burstHearts.push({
          x: clickX,
          y: clickY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 1.5,
          size: Math.random() * 12 + 8,
          color: palette.fill,
          alpha: 0.9,
          rotation: (Math.random() - 0.5) * 0.8,
          rotationSpeed: (Math.random() - 0.5) * 0.05,
          life: 0,
          maxLife: 60 + Math.random() * 25,
        });
      }
    };

    const handleVisibilityChange = () => {
      isRunning = !document.hidden;
      if (isRunning) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("click", handleClick, { passive: true });
    document.addEventListener("visibilitychange", handleVisibilityChange);

    let tick = 0;

    const render = () => {
      if (!isRunning) return;

      ctx.clearRect(0, 0, width, height);
      tick += 1;

      // 1. Render Sparkling Stardust
      sparkles.forEach((s) => {
        s.y += s.speedY;
        if (s.y > height + 10) {
          s.y = -10;
          s.x = Math.random() * width;
        }

        s.alpha += s.pulseSpeed * s.pulseDir;
        if (s.alpha > 0.75) s.pulseDir = -1;
        if (s.alpha < 0.15) s.pulseDir = 1;

        drawSparkle(ctx, s.x, s.y, s.size, s.color, s.alpha);
      });

      // 2. Render Falling Flower Petals
      petals.forEach((p) => {
        p.y += p.speedY;
        const sway = Math.sin(tick * p.swayFrequency + p.phase) * p.swayAmplitude;
        p.x = p.baseX + sway;
        p.rotation += p.rotationSpeed;
        p.flipAngle += p.flipSpeed;

        if (p.y > height + 30) {
          p.y = -30;
          p.baseX = Math.random() * width;
          p.x = p.baseX;
        }

        drawPetal(ctx, p.x, p.y, p.size, p.rotation, p.flipAngle, p.color, p.alpha);
      });

      // 3. Render Falling Floating Hearts
      hearts.forEach((heart) => {
        heart.y += heart.speedY;

        const sway = Math.sin(tick * heart.swayFrequency + heart.phase) * heart.swayAmplitude;
        heart.x = heart.baseX + sway;
        heart.rotation = Math.sin(tick * heart.swayFrequency * 0.75 + heart.phase) * 0.4;

        heart.scaleY += heart.scaleYDir;
        if (heart.scaleY > 1.05 || heart.scaleY < 0.7) {
          heart.scaleYDir = -heart.scaleYDir;
        }

        const dx = heart.x - mouseX;
        const dy = heart.y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 140) {
          const force = (140 - dist) / 140;
          heart.baseX += (dx / (dist || 1)) * force * 3.5;
          heart.y += (dy / (dist || 1)) * force * 2;
        }

        if (heart.y > height + 35) {
          heart.y = -35;
          heart.baseX = Math.random() * width;
          heart.x = heart.baseX;
          heart.speedY = Math.random() * 0.65 + 0.4;
          heart.alpha = heart.baseAlpha;
        }

        if (heart.baseX < -60) heart.baseX = width + 60;
        if (heart.baseX > width + 60) heart.baseX = -60;

        drawHeart(
          ctx,
          heart.x,
          heart.y,
          heart.size,
          heart.rotation,
          heart.color,
          heart.glowColor,
          heart.alpha,
          heart.isOutline,
          heart.scaleY
        );
      });

      // 4. Render Click Burst Hearts
      for (let i = burstHearts.length - 1; i >= 0; i--) {
        const b = burstHearts[i];
        b.x += b.vx;
        b.y += b.vy;
        b.vy += 0.04;
        b.vx *= 0.98;
        b.rotation += b.rotationSpeed;
        b.life += 1;

        const progress = b.life / b.maxLife;
        b.alpha = (1 - progress) * 0.9;

        drawHeart(
          ctx,
          b.x,
          b.y,
          b.size,
          b.rotation,
          b.color,
          `rgba(${b.color}, 0.6)`,
          b.alpha,
          false,
          1
        );

        if (b.life >= b.maxLife) {
          burstHearts.splice(i, 1);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("click", handleClick);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-85"
      />
    </div>
  );
}
