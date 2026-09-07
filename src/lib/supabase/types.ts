export type Profile = {
  id: string;
  full_name: string;
  role: "partner" | "admin";
  avatar_url?: string;
  vault_pin_hash?: string;
  vault_pin_salt?: string;
  created_at?: string;
  updated_at?: string;
};

export type Memory = {
  id: string;
  user_id?: string;
  title: string;
  description: string;
  date: string;
  media_url?: string;
  media_type: "image" | "video" | "audio";
  location?: string;
  category: "Trip" | "Date Night" | "Milestone" | "Quiet Moment" | "Celebration";
  is_favorite: boolean;
  is_private?: boolean;
  tags: string[];
  created_at?: string;
  updated_at?: string;
};

export type MemoryMedia = {
  id: string;
  memory_id: string;
  media_url: string;
  media_type: "image" | "video" | "audio";
  order_index?: number;
  caption?: string;
  created_at?: string;
};

export type LetterCategory =
  | "Open when you miss me"
  | "Open when you're sad"
  | "Open when you're angry"
  | "Open when you need motivation"
  | "Anniversary letter"
  | "Birthday letter"
  | "Future letter"
  | "Just Because";

export type Letter = {
  id: string;
  user_id?: string;
  title: string;
  content: string;
  author: string;
  recipient: string;
  date: string;
  category?: LetterCategory;
  is_sealed: boolean;
  is_read?: boolean;
  open_date?: string;
  seal_color?: "gold" | "rose" | "charcoal";
  image_url?: string;
  image_caption?: string;
  audio_url?: string;
  audio_duration?: string;
  is_vault?: boolean;
  created_at?: string;
  updated_at?: string;
};

export type Milestone = {
  id: string;
  title: string;
  date: string;
  description: string;
  category: "Beginning" | "Firsts" | "Adventures" | "Commitments" | "Milestone" | "Present";
  icon?: string;
  is_major: boolean;
  highlight_quote?: string;
  created_at?: string;
};

export type TimelineEvent = {
  id: string;
  user_id?: string;
  title: string;
  date: string;
  description: string;
  category: "Milestones" | "Trips" | "Photos" | "Special Moments" | "Beginning" | "Firsts" | "Adventures" | "Commitments" | "Present";
  image_url?: string;
  gallery_urls?: string[];
  video_url?: string;
  location?: string;
  personal_note?: string;
  personal_note_author?: string;
  icon?: string;
  is_major?: boolean;
  created_at?: string;
  updated_at?: string;
};

export type PlaceCategory =
  | "First Date"
  | "Travel"
  | "Favorite Café"
  | "Stargazing"
  | "Adventures"
  | "Quiet Moment"
  | "Home";

export type Place = {
  id: string;
  user_id?: string;
  title: string;
  location_name: string;
  city?: string;
  country?: string;
  lat: number;
  lng: number;
  description: string;
  memory_note?: string;
  visited_date: string;
  photo_url?: string;
  gallery_urls?: string[];
  category: PlaceCategory;
  is_favorite?: boolean;
  created_at?: string;
  updated_at?: string;
};

export type FutureCategory =
  | "Places We Want To Visit"
  | "Things We Want To Do"
  | "Dreams & Goals";

export type FutureStatus =
  | "Dream"
  | "Planned"
  | "In Progress"
  | "Completed";

export type FutureItem = {
  id: string;
  user_id?: string;
  title: string;
  description: string;
  category: FutureCategory;
  target_date?: string;
  status: FutureStatus;
  is_completed: boolean;
  completed_date?: string;
  image_url?: string;
  created_at?: string;
  updated_at?: string;
};

// Backwards compatibility alias for bucket list
export type BucketItem = FutureItem;

export type VaultCategory =
  | "Private Letters"
  | "Private Photos"
  | "Private Videos"
  | "Voice Messages"
  | "Future Messages"
  | "General";

export type VaultMediaType =
  | "letter"
  | "photo"
  | "video"
  | "audio"
  | "future_message"
  | "note";

export type VaultItem = {
  id: string;
  user_id?: string;
  title: string;
  description: string;
  media_url?: string;
  media_type: VaultMediaType;
  duration?: string;
  category: VaultCategory;
  recorded_date: string;
  unlock_date?: string;
  is_locked: boolean;
  created_at?: string;
  updated_at?: string;
};

export type VaultMedia = {
  id: string;
  vault_item_id: string;
  media_url: string;
  media_type: string;
  file_size?: number;
  mime_type?: string;
  created_at?: string;
};

export type LoveReasonCategory =
  | "Everyday Magic"
  | "Soul & Depth"
  | "The Little Things"
  | "Quirks"
  | "Conversations"
  | "Heart"
  | "Memories";

export type LoveReason = {
  id: string;
  user_id?: string;
  number: number;
  title: string;
  description: string;
  message?: string;
  category: LoveReasonCategory;
  photo_url?: string;
  photo_caption?: string;
  audio_url?: string;
  audio_duration?: string;
  icon?: string;
  author: string;
  is_favorite?: boolean;
  tags?: string[];
  created_at?: string;
  updated_at?: string;
};

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Partial<Profile>;
        Update: Partial<Profile>;
        Relationships: [];
      };
      memories: {
        Row: Memory;
        Insert: Partial<Memory>;
        Update: Partial<Memory>;
        Relationships: [];
      };
      memory_media: {
        Row: MemoryMedia;
        Insert: Partial<MemoryMedia>;
        Update: Partial<MemoryMedia>;
        Relationships: [];
      };
      letters: {
        Row: Letter;
        Insert: Partial<Letter>;
        Update: Partial<Letter>;
        Relationships: [];
      };
      milestones: {
        Row: Milestone;
        Insert: Partial<Milestone>;
        Update: Partial<Milestone>;
        Relationships: [];
      };
      timeline_events: {
        Row: TimelineEvent;
        Insert: Partial<TimelineEvent>;
        Update: Partial<TimelineEvent>;
        Relationships: [];
      };
      places: {
        Row: Place;
        Insert: Partial<Place>;
        Update: Partial<Place>;
        Relationships: [];
      };
      future_items: {
        Row: FutureItem;
        Insert: Partial<FutureItem>;
        Update: Partial<FutureItem>;
        Relationships: [];
      };
      bucket_list: {
        Row: FutureItem;
        Insert: Partial<FutureItem>;
        Update: Partial<FutureItem>;
        Relationships: [];
      };
      vault_items: {
        Row: VaultItem;
        Insert: Partial<VaultItem>;
        Update: Partial<VaultItem>;
        Relationships: [];
      };
      vault_media: {
        Row: VaultMedia;
        Insert: Partial<VaultMedia>;
        Update: Partial<VaultMedia>;
        Relationships: [];
      };
      love_reasons: {
        Row: LoveReason;
        Insert: Partial<LoveReason>;
        Update: Partial<LoveReason>;
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
