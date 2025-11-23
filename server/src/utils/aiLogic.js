/**
 * AI Logic: Selects the BEST shop based on multiple factors
 * Factors:
 * - Distance (70%): Closer shops get higher priority
 * - Rating (20%): Higher rated shops preferred
 * - Availability (10%): Bonus for shops with more data
 */
export const scoreShopsAndPickBest = (shops = []) => {
  if (!shops.length) return null;

  // Find max distance for normalization
  const maxDist = Math.max(...shops.map((s) => s.distanceKm || 1), 1);

  const scored = shops.map((s) => {
    // 1️⃣ Distance Score (0-1): Closer = Higher score
    const distanceScore = 1 - Math.min((s.distanceKm || 0) / maxDist, 1);

    // 2️⃣ Rating Score (0-1): Normalize rating to 0-1 scale
    const ratingScore = s.rating ? (s.rating / 5) : 0.5; // Default 0.5 if no rating

    // 3️⃣ Data Availability Score: Shops with name & address get bonus
    const hasData = (s.name && s.name !== "Unknown Shop" ? 0.5 : 0) + 
                    (s.address && s.address !== "No address available" ? 0.5 : 0);

    // 📊 Final Score Calculation
    const score = 
      distanceScore * 0.70 +  // 70% weight on proximity
      ratingScore * 0.20 +    // 20% weight on rating
      hasData * 0.10;         // 10% weight on data quality

    return { 
      ...s, 
      score: parseFloat(score.toFixed(3)),
      _scoring: { distanceScore, ratingScore, hasData } // Debug info
    };
  });

  // Sort by score (highest first)
  scored.sort((a, b) => b.score - a.score);

  console.log("🤖 AI Selected Best Shop:", {
    name: scored[0].name,
    distance: `${scored[0].distanceKm?.toFixed(2)} km`,
    rating: scored[0].rating || "N/A",
    score: scored[0].score
  });

  return scored[0];
};
