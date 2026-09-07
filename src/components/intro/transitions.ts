import { Variants } from "framer-motion";

export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.6, ease: "easeInOut" },
  },
};

export const slideUp: Variants = {
  initial: { opacity: 0, y: 24 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    y: -16,
    transition: { duration: 0.5, ease: "easeInOut" },
  },
};

export const slideLeft: Variants = {
  initial: { opacity: 0, x: -30 },
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    x: 20,
    transition: { duration: 0.5, ease: "easeInOut" },
  },
};

export const slideRight: Variants = {
  initial: { opacity: 0, x: 30 },
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    x: -20,
    transition: { duration: 0.5, ease: "easeInOut" },
  },
};

export const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.92 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    scale: 1.04,
    transition: { duration: 0.6, ease: "easeInOut" },
  },
};

export const scaleOut: Variants = {
  initial: { opacity: 0, scale: 1.08 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    scale: 0.94,
    transition: { duration: 0.6, ease: "easeInOut" },
  },
};

export const slowZoom: Variants = {
  initial: { scale: 1, opacity: 0 },
  animate: {
    scale: 1.08,
    opacity: 1,
    transition: {
      scale: { duration: 8, ease: "easeOut" },
      opacity: { duration: 0.8, ease: "easeOut" },
    },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.6 },
  },
};

export const softBlur: Variants = {
  initial: { opacity: 0, filter: "blur(12px)" },
  animate: {
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    filter: "blur(8px)",
    transition: { duration: 0.5 },
  },
};

export const particleReveal: Variants = {
  initial: { opacity: 0, scale: 0.85, filter: "blur(6px)" },
  animate: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 1.1, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    scale: 1.1,
    filter: "blur(8px)",
    transition: { duration: 0.7, ease: "easeInOut" },
  },
};

export const staggerContainer: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.18,
      delayChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    transition: { staggerChildren: 0.08, staggerDirection: -1 },
  },
};
