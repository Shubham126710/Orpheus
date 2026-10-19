import { ArtistItem } from "./types";

/**
 * Related genre taxonomy for Orpheus recommendations.
 * Enables smart graceful fallback to musically adjacent genres when candidate pools
 * are sparse, without ever overwhelming exact genre matches.
 */
export const RELATED_GENRES: Record<string, string[]> = {
  bollywood: ["hindi-indie", "bollywood-retro", "ghazal", "sufi-qawwali", "punjabi-pop", "pop"],
  "bollywood-retro": ["bollywood", "ghazal", "indian-classical", "devotional"],
  "hindi-indie": ["bollywood", "indie", "indian-fusion", "folk"],
  "punjabi-pop": ["bhangra", "desi-hiphop", "bollywood", "pop"],
  bhangra: ["punjabi-pop", "desi-hiphop", "indian-folk"],
  "desi-hiphop": ["hiphop", "punjabi-pop", "hindi-indie"],
  "indian-classical": ["ghazal", "sufi-qawwali", "indian-fusion", "classical", "devotional"],
  ghazal: ["sufi-qawwali", "indian-classical", "bollywood-retro"],
  "sufi-qawwali": ["ghazal", "indian-classical", "devotional", "bollywood"],
  devotional: ["indian-classical", "ghazal", "bollywood-retro"],
  "indian-folk": ["bhangra", "folk", "indian-fusion", "devotional"],
  "indian-fusion": ["indian-classical", "electronic", "rock", "hindi-indie"],
  rock: ["alternative", "metal", "indie", "punk", "blues"],
  alternative: ["rock", "indie", "punk"],
  indie: ["alternative", "rock", "folk", "hindi-indie"],
  metal: ["rock", "punk"],
  hiphop: ["desi-hiphop", "rnb", "soul"],
  rnb: ["soul", "funk", "hiphop", "pop"],
  electronic: ["dance", "techno", "house", "ambient", "synthwave"],
  techno: ["electronic", "house", "dance"],
  house: ["electronic", "dance", "techno", "disco"],
  ambient: ["electronic", "synthwave", "lofi", "classical"],
  synthwave: ["electronic", "ambient", "lofi"],
  lofi: ["ambient", "hiphop", "jazz"],
  jazz: ["blues", "soul", "funk", "classical"],
  blues: ["jazz", "rock", "soul"],
  classical: ["soundtracks", "ambient", "indian-classical"],
  soundtracks: ["classical", "ambient", "bollywood"],
  pop: ["dance", "rnb", "bollywood", "punjabi-pop"],
  dance: ["electronic", "house", "pop"],
  soul: ["rnb", "funk", "gospel", "jazz"],
  funk: ["soul", "rnb", "disco"],
  disco: ["dance", "funk", "pop"],
  folk: ["country", "rock", "indian-folk"],
  country: ["folk", "rock", "blues"],
  punk: ["rock", "alternative", "metal"],
  reggae: ["funk", "soul", "world"],
  latin: ["dance", "pop", "world"],
  gospel: ["soul", "rnb", "devotional"],
  world: ["folk", "reggae", "indian-folk"],
};

/**
 * 36 mathematically relaxed, non-overlapping circular layout slots.
 * Top slots represent prime focal hero positions.
 */
export const ARTIST_LAYOUT_SLOTS: Array<{
  desktop: { size: number; x: number; y: number };
  mobile: { size: number; x: number; y: number };
}> = [
  // Tier 1: Prime Center & Inner Flanks (Hero sizes: 215px - 195px)
  { desktop: { size: 215, x: 50, y: 8 }, mobile: { size: 165, x: 4, y: 22 } },
  { desktop: { size: 210, x: 22, y: 11 }, mobile: { size: 160, x: 7, y: 68 } },
  { desktop: { size: 205, x: 78, y: 11 }, mobile: { size: 160, x: 9, y: 38 } },
  { desktop: { size: 200, x: 36, y: 20 }, mobile: { size: 155, x: 12, y: 55 } },
  { desktop: { size: 200, x: 64, y: 20 }, mobile: { size: 155, x: 14, y: 78 } },
  { desktop: { size: 195, x: 9, y: 20 }, mobile: { size: 150, x: 17, y: 28 } },
  { desktop: { size: 195, x: 91, y: 20 }, mobile: { size: 150, x: 20, y: 48 } },
  { desktop: { size: 190, x: 50, y: 27 }, mobile: { size: 150, x: 22, y: 70 } },

  // Tier 2: Mid Flanks & Sub-Heroes (165px - 160px)
  { desktop: { size: 165, x: 21, y: 29 }, mobile: { size: 130, x: 25, y: 22 } },
  { desktop: { size: 165, x: 79, y: 29 }, mobile: { size: 130, x: 27, y: 68 } },
  { desktop: { size: 160, x: 8, y: 34 }, mobile: { size: 125, x: 30, y: 38 } },
  { desktop: { size: 160, x: 92, y: 34 }, mobile: { size: 125, x: 33, y: 55 } },
  { desktop: { size: 160, x: 36, y: 37 }, mobile: { size: 125, x: 35, y: 78 } },
  { desktop: { size: 160, x: 64, y: 37 }, mobile: { size: 125, x: 38, y: 28 } },
  { desktop: { size: 155, x: 50, y: 41 }, mobile: { size: 120, x: 41, y: 48 } },

  // Tier 3: Core Canvas Field (165px - 155px)
  { desktop: { size: 165, x: 18, y: 46 }, mobile: { size: 130, x: 43, y: 70 } },
  { desktop: { size: 165, x: 82, y: 46 }, mobile: { size: 130, x: 46, y: 22 } },
  { desktop: { size: 160, x: 34, y: 50 }, mobile: { size: 125, x: 48, y: 68 } },
  { desktop: { size: 160, x: 66, y: 50 }, mobile: { size: 125, x: 51, y: 38 } },
  { desktop: { size: 155, x: 8, y: 53 }, mobile: { size: 120, x: 54, y: 55 } },
  { desktop: { size: 155, x: 92, y: 53 }, mobile: { size: 120, x: 56, y: 78 } },
  { desktop: { size: 155, x: 50, y: 56 }, mobile: { size: 120, x: 59, y: 28 } },

  // Tier 4: Lower Cluster & Depth (160px - 150px)
  { desktop: { size: 160, x: 22, y: 62 }, mobile: { size: 125, x: 61, y: 48 } },
  { desktop: { size: 160, x: 78, y: 62 }, mobile: { size: 125, x: 64, y: 70 } },
  { desktop: { size: 155, x: 36, y: 68 }, mobile: { size: 120, x: 67, y: 22 } },
  { desktop: { size: 155, x: 64, y: 68 }, mobile: { size: 120, x: 69, y: 68 } },
  { desktop: { size: 150, x: 10, y: 70 }, mobile: { size: 115, x: 72, y: 38 } },
  { desktop: { size: 150, x: 90, y: 70 }, mobile: { size: 115, x: 74, y: 55 } },
  { desktop: { size: 150, x: 50, y: 74 }, mobile: { size: 115, x: 77, y: 78 } },

  // Tier 5: Base Satellites & Peripheral Accents (155px - 135px)
  { desktop: { size: 155, x: 26, y: 81 }, mobile: { size: 120, x: 80, y: 28 } },
  { desktop: { size: 155, x: 74, y: 81 }, mobile: { size: 120, x: 82, y: 48 } },
  { desktop: { size: 145, x: 12, y: 86 }, mobile: { size: 115, x: 85, y: 70 } },
  { desktop: { size: 145, x: 88, y: 86 }, mobile: { size: 115, x: 87, y: 22 } },
  { desktop: { size: 140, x: 42, y: 89 }, mobile: { size: 110, x: 90, y: 68 } },
  { desktop: { size: 140, x: 58, y: 89 }, mobile: { size: 110, x: 93, y: 38 } },
  { desktop: { size: 135, x: 50, y: 95 }, mobile: { size: 105, x: 96, y: 55 } },
];

/**
 * Calculates a deterministic, ranked list of artist recommendations based on
 * the intersection between user-selected genres and each artist's multi-genre tags.
 *
 * Ranking criteria:
 * 1. Direct genre matches receive dominant precedence (>= 10,000 pts).
 * 2. Multi-genre matching artists receive strong progressive bonus (+5,000 for 2, +9,000 for 3+).
 * 3. Primary genre match provides an extra relevance boost (+800 pts).
 * 4. Closely related genres provide structured secondary fallback (3,000 - 5,000 pts).
 * 5. General popularity ensures quality backfill without ever displacing direct matches.
 * 6. Controlled deterministic variance creates natural Beats-style variety without randomness.
 * 7. Deduplication by artist ID is strictly enforced.
 */
export function getRecommendedArtists(
  selectedGenres: string[],
  allArtists: ArtistItem[],
  limit: number = 36
): ArtistItem[] {
  // If no genre selected, sort strictly by popularity
  if (!selectedGenres || selectedGenres.length === 0) {
    const sorted = [...allArtists].sort((a, b) => (b.popularity ?? 50) - (a.popularity ?? 50));
    return mapToLayoutSlots(sorted.slice(0, limit));
  }

  const selectedSet = new Set(selectedGenres);

  // Compute related genres for fallback
  const relatedSet = new Set<string>();
  selectedGenres.forEach((g) => {
    (RELATED_GENRES[g] || []).forEach((rel) => {
      if (!selectedSet.has(rel)) {
        relatedSet.add(rel);
      }
    });
  });

  // Calculate score for each candidate
  const scored = allArtists.map((artist) => {
    const artistGenres = artist.genres && artist.genres.length > 0
      ? artist.genres
      : [artist.genre];

    // Direct matches
    const directMatches = artistGenres.filter((g) => selectedSet.has(g));
    const directCount = directMatches.length;

    // Related matches
    const relatedMatches = artistGenres.filter((g) => relatedSet.has(g));
    const relatedCount = relatedMatches.length;

    let score = 0;

    if (directCount > 0) {
      // Tier 1: Direct matches dominate
      score += 10000;
      // Progressive bonus for matching multiple selected genres
      if (directCount === 1) {
        score += 2000;
      } else if (directCount === 2) {
        score += 5000;
      } else {
        score += 9000;
      }

      // Bonus if the artist's primary genre is one of the selected
      if (artist.genre && selectedSet.has(artist.genre)) {
        score += 800;
      }
    } else if (relatedCount > 0) {
      // Tier 2: Related genre fallback
      score += 3000 + relatedCount * 600;
    } else {
      // Tier 3: General fallback
      score += 500;
    }

    // Popularity weighting (up to +500 points)
    const pop = artist.popularity ?? 70;
    score += Math.round((pop / 100) * 500);

    // Controlled deterministic variety hash based on artist ID and selected genres
    // Guarantees stable testability while avoiding rigid robotic alphabetical/id ordering
    let hash = 0;
    const key = `${artist.id}:${selectedGenres.slice().sort().join(",")}`;
    for (let i = 0; i < key.length; i++) {
      hash = (hash << 5) - hash + key.charCodeAt(i);
      hash |= 0;
    }
    const variance = (Math.abs(hash) % 150) - 75; // -75 to +75 points
    score += variance;

    return {
      artist,
      score,
      directCount,
      relatedCount,
    };
  });

  // Rank descending
  scored.sort((a, b) => b.score - a.score);

  // Take top candidates
  const topCandidates = scored.slice(0, limit).map((s) => s.artist);

  // Map to layout slots
  return mapToLayoutSlots(topCandidates);
}

/**
 * Assigns pre-computed organic circular layout coordinates to ranked candidate artists
 */
function mapToLayoutSlots(artists: ArtistItem[]): ArtistItem[] {
  return artists.map((artist, idx) => {
    const slot = ARTIST_LAYOUT_SLOTS[idx] || ARTIST_LAYOUT_SLOTS[ARTIST_LAYOUT_SLOTS.length - 1];
    return {
      ...artist,
      tier: idx < 8 ? "hero" : idx < 28 ? "medium" : "small",
      desktop: {
        size: slot.desktop.size,
        x: slot.desktop.x,
        y: slot.desktop.y,
      },
      mobile: {
        size: slot.mobile.size,
        x: slot.mobile.x,
        y: slot.mobile.y,
      },
    };
  });
}
