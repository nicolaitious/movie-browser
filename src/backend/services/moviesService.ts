import fetch from "node-fetch";
import LRU from "lru-cache";
import { type Movie, type MoviesPageResponse } from "../types.ts";

/**
 * Service that knows how to fetch pages from the provided wiremock API,
 * cache pages, aggregate all pages, and apply filters.
 */

const WIREMOCK_BASE = "https://wiremock.dev.eroninternational.com/api/movies/search?page=";

// LRU cache for single page responses
const pageCache = new LRU<string, MoviesPageResponse>({ max: 200, ttl: 1000 * 60 * 10 }); // 10min

// aggregated cache (simple)
let allMoviesCache: { ts: number; data: Movie[] | null; ttl: number } = {
    ts: 0,
    data: null,
    ttl: 1000 * 60 * 5, // 5min
};

export async function fetchPage(page: number): Promise<MoviesPageResponse> {
    const key = `page:${page}`;
    const cached = pageCache.get(key);
    if (cached) return cached;

    const res = await fetch(`${WIREMOCK_BASE}${page}`, { method: "GET" } as any);
    if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`Upstream error ${res.status}: ${text}`);
    }
    const json = (await res.json()) as MoviesPageResponse;
    pageCache.set(key, json);
    return json;
}

/**
 * Fetch all pages (concurrent batches) and return aggregated movie list.
 * Caches aggregated result for `ttl` ms to avoid repeated full pulls.
 */
export async function fetchAllMovies(): Promise<Movie[]> {
    const now = Date.now();
    if (allMoviesCache.data && now - allMoviesCache.ts < allMoviesCache.ttl) {
        return allMoviesCache.data;
    }

    // load page 1 to get total_pages
    const first = await fetchPage(1);
    const total_pages = first.total_pages || 1;
    const movies: Movie[] = [...(first.data || [])];

    // fetch remaining pages with small concurrency
    const concurrency = 3;
    const pages: number[] = [];
    for (let p = 2; p <= total_pages; p++) pages.push(p);

    for (let i = 0; i < pages.length; i += concurrency) {
        const batch = pages.slice(i, i + concurrency);
        const batchRes = await Promise.all(batch.map((p) => fetchPage(p)));
        batchRes.forEach((r) => {
            if (Array.isArray(r.data)) movies.push(...r.data);
        });
    }

    allMoviesCache = { ts: now, data: movies, ttl: allMoviesCache.ttl };
    return movies;
}

/**
 * Apply simple server-side filters to the aggregated array.
 * Supported filters:
 * - all (contains, case-insensitive)
 * - title (contains, case-insensitive)
 * - director (contains, case-insensitive)
 * - genre (contains, case-insensitive)
 * - yearFrom (inclusive)
 * - yearTo (inclusive)
 * - rated (exact, case-insensitive)
 */
export function applyFilters(movies: Movie[], q: Record<string, string | undefined>): Movie[] {
    const all = q.all?.toLowerCase() || null;
    const title = q.title?.toLowerCase() || null;
    const director = q.director?.toLowerCase() || null;
    const genre = q.genre?.toLowerCase() || null;
    const rated = q.rated?.toLowerCase() || null;
    const yearFrom = q.yearFrom ? Number(q.yearFrom) : null;
    const yearTo = q.yearTo ? Number(q.yearTo) : null;

    const sortBy = q.sortBy || null;
    const sortDir = q.sortDir === "desc" ? -1 : 1;

    let result = movies.filter((m) => {
        const movieTitle = (m.Title || "").toLowerCase();
        const movieDirector = (m.Director || "").toLowerCase();
        const movieActors = (m.Actors || "").toLowerCase();
        const movieGenre = (m.Genre || "").toLowerCase();
        const movieRated = (m.Rated || "").toLowerCase();
        const movieYear = Number(m.Year);

        if (all) {
            const matchesAll =
                movieTitle.includes(all) ||
                movieDirector.includes(all) ||
                movieActors.includes(all) ||
                movieGenre.includes(all);

            if (!matchesAll) return false;
        }

        if (title && !movieTitle.includes(title)) return false;
        if (director && !movieDirector.includes(director)) return false;
        if (genre && !movieGenre.includes(genre)) return false;
        if (rated && movieRated !== rated) return false;
        if (yearFrom && movieYear < yearFrom) return false;
        if (yearTo && movieYear > yearTo) return false;

        return true;
    });

    // --- OPTIONAL SORTING ---
    if (sortBy) {
        result = [...result].sort((a, b) => {
            switch (sortBy) {
                case "title": {
                    const ta = a.Title?.toLowerCase() || "";
                    const tb = b.Title?.toLowerCase() || "";
                    return ta.localeCompare(tb) * sortDir;
                }
                case "year": {
                    return (Number(a.Year) - Number(b.Year)) * sortDir;
                }
                case "rated": {
                    const ra = a.Rated?.toLowerCase() || "";
                    const rb = b.Rated?.toLowerCase() || "";
                    return ra.localeCompare(rb) * sortDir;
                }
                default:
                    return 0;
            }
        });
    }

    return result;
}