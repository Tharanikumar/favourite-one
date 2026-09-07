export interface IntroConfig {
  title: string;
  subtitle: string;
  partner1: string;
  partner2: string;
  loadingTitle: string;
  loadingSubtitle: string;
  heartMessage: string;
  personalMessage: string;
  memoryCardText: string;
  emotionalText: string[];
  finalPrompt: string;
  finalSubtitle: string;
  signature: string;
  audioUrl: string;
  heroPhotoUrl: string;
  memoryPhotos: {
    url: string;
    caption: string;
    rotation: number;
    delay: number;
  }[];
}

export const DEFAULT_INTRO_CONFIG: IntroConfig = {
  title: "Our Little Universe",
  subtitle: "SAME PEOPLE. A THOUSAND BEAUTIFUL MOMENTS.",
  partner1: "Tharani",
  partner2: "Surya",
  loadingTitle: "Just a moment...",
  loadingSubtitle: "SOMETHING SPECIAL IS LOADING FOR YOU",
  heartMessage: "Good things take a little time...",
  personalMessage: "For You",
  memoryCardText: "A thousand moments...\n\nAnd many more to come...",
  emotionalText: ["You", "Me", "Always"],
  finalPrompt: "Ready to enter\nOur Little Universe?",
  finalSubtitle: "A PLACE FOR OUR STORIES, MEMORIES AND FOREVER.",
  signature: "With you always ♡",
  audioUrl: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-piano-112199.mp3",
  heroPhotoUrl: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=1600&q=80",
  memoryPhotos: [
    {
      url: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=800&q=80",
      caption: "Starlit conversations",
      rotation: -6,
      delay: 0.1,
    },
    {
      url: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=800&q=80",
      caption: "Quiet ocean horizons",
      rotation: 5,
      delay: 0.25,
    },
    {
      url: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=800&q=80",
      caption: "First coffee smiles",
      rotation: -3,
      delay: 0.4,
    },
    {
      url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
      caption: "Serendipity",
      rotation: 7,
      delay: 0.55,
    },
  ],
};
