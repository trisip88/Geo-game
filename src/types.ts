export interface Place {
  id: string;
  name: string;
  country: string;
  lat: number;
  lon: number;
  wikipediaTitle: string;
  clues: [string, string, string]; // [Hard/Hemisphere, Medium/History-Culture, Easy/Giveaway]
  cachedExtract?: string;
  cachedImage?: {
    url: string;
    creator: string;
    license: string;
    licenseUrl?: string;
    sourceUrl?: string;
    title?: string;
  };
  literatureKeywords?: string;
}

export interface GuessCoordinates {
  lat: number;
  lon: number;
}

export interface RoundResult {
  round: number;
  place: {
    name: string;
    country: string;
    lat: number;
    lon: number;
    wikipediaTitle: string;
  };
  guess: {
    lat: number;
    lon: number;
  };
  distance_km: number;
  points: number;
  seconds: number;
  cluesRevealedCount: number;
  usedLiveFeed: boolean;
}

export interface MatchRecord {
  game: string;
  version: string;
  generated_at: string;
  data_sources: string[];
  live_feed: 'online' | 'bundled' | 'probing' | 'error';
  scoring: {
    formula: string;
    bullseye_radius_km: number;
    max_per_round: number;
  };
  rounds_played: number;
  total_rounds: number;
  rounds: RoundResult[];
  totals: {
    score: number;
    max_possible: number;
    accuracy_pct: number;
    avg_error_km: number;
  };
  status: 'in_progress' | 'complete';
}

export interface LiveFeedData {
  wikipedia?: {
    extract: string;
    redactedExtract: string;
    pageUrl: string;
    thumbnailUrl?: string;
    description?: string;
  };
  openverse?: {
    url: string;
    creator: string;
    license: string;
    licenseUrl?: string;
    title: string;
    sourceUrl: string;
  };
  openLibrary?: {
    books: Array<{
      title: string;
      author?: string;
      year?: number;
    }>;
  };
  loading: boolean;
  error?: string;
}

export type GameView = 'play' | 'schema' | 'authoring' | 'history';
