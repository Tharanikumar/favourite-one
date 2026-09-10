export const APP_CONFIG = {
  name: "Our Little Universe",
  tagline: "A private sanctuary for the moments that define us.",
  couple: {
    partner1: "Tharani",
    partner2: "Surya",
    monogram: "T & S",
    relationshipStartDate: "2023-04-14T19:30:00Z", // Customize as needed
    anniversary: "April 14",
    favoriteQuote: "In all the world, there is no heart for me like yours. In all the world, there is no love for you like mine.",
    quoteAuthor: "Maya Angelou",
  },
  theme: {
    accentGold: "#E58E26",
    accentRose: "#FF6B6B",
    sunsetCoral: "#FF7582",
    blushPink: "#FFE4E6",
    softPeach: "#FFB088",
    warmCream: "#FFF8F3",
    sageGreen: "#C7D7CE",
    mauve: "#C77DFF",
    charcoal: "#1F1D24",
    bgDark: "#FFF7F2",
  },
};

export interface NavItem {
  name: string;
  href: string;
  iconName: string;
  description: string;
}

export const NAV_ITEMS: NavItem[] = [
  {
    name: "Sanctuary",
    href: "/dashboard",
    iconName: "Sparkles",
    description: "Welcome overview & highlights",
  },
  {
    name: "Story",
    href: "/timeline",
    iconName: "Clock",
    description: "Milestones through time",
  },
  {
    name: "Letters",
    href: "/letters",
    iconName: "Mail",
    description: "Sealed words & whispered thoughts",
  },
  {
    name: "Moments",
    href: "/gallery",
    iconName: "Camera",
    description: "Visual memories & snapshots",
  },
  {
    name: "Places",
    href: "/places",
    iconName: "MapPin",
    description: "Coordinates of our journey",
  },
  {
    name: "Reasons",
    href: "/things-i-love",
    iconName: "Heart",
    description: "Things I love about you",
  },
  {
    name: "Future",
    href: "/future",
    iconName: "Compass",
    description: "Bucket list & upcoming chapters",
  },
  {
    name: "Vault",
    href: "/vault",
    iconName: "Lock",
    description: "Private voice notes & secrets",
  },
];
