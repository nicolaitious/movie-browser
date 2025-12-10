const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL;
const IMG = import.meta.env.VITE_TMDB_IMAGE_BASE;

export type Section = "popular" | "top_rated" | "upcoming" | "now_playing";

export type Movie = {
    id: number;
    title: string;
    overview: string;
    releaseDate: string;
    posterUrl: string;
    backdropUrl: string;
    voteAverage: number;
    voteCount: number;
    popularity: number;
    originalLanguage: string;
    genreIds: number[];
};

export type MoviesResponse = {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
    data: Movie[];
};

function mapTMDbMovie(m: any): Movie {
    return {
        id: m.id,
        title: m.title,
        overview: m.overview,
        releaseDate: m.release_date?.slice(0, 4),
        posterUrl: m.poster_path ? `${IMG}/w500${m.poster_path}` : "",
        backdropUrl: m.backdrop_path ? `${IMG}/w1280${m.backdrop_path}` : "",
        voteAverage: Number(m.vote_average.toFixed(1)),
        voteCount: m.vote_count,
        popularity: m.popularity,
        originalLanguage: m.original_language,
        genreIds: m.genre_ids,
    };
}

function sectionEndpoint(section: Section) {
    switch (section) {
        case "popular": return "/movie/popular";
        case "top_rated": return "/movie/top_rated";
        case "upcoming": return "/movie/upcoming";
        default: return "/movie/popular";
    }
}

/**
 * NEW final version
 * - filters: { title, genre, yearFrom, yearTo }
 * - category is separate param (default=popular)
 */
export async function fetchMovies(params: {
    page?: number;
    filters?: Record<string, any>;
    category?: Section;
}): Promise<MoviesResponse> {
    const page = params.page ?? 1;
    const { title, genre, yearFrom, yearTo } = params.filters ?? {};
    const category = params.category ?? "popular";

    const searchParams = new URLSearchParams({
        api_key: API_KEY,
        page: String(page),
    });

    let endpoint = "";

    // SEARCH override
    if (title) {
        endpoint = "/search/movie";
        searchParams.set("query", title);
    }
    else {
        // If ANY filter is present, use DISCOVER
        const hasFilters = genre || yearFrom || yearTo;

        if (hasFilters) {
            endpoint = "/discover/movie";

            // Map category to discover params
            if (category === "popular") {
                searchParams.set("sort_by", "popularity.desc");
            }
            if (category === "top_rated") {
                searchParams.set("sort_by", "vote_average.desc");
                searchParams.set("vote_count.gte", "1000");
            }
            if (category === "upcoming") {
                const today = new Date().toISOString().slice(0, 10);
                searchParams.set("primary_release_date.gte", today);
            }
        }
        else {
            // No filters — use TMDb category endpoints
            endpoint = sectionEndpoint(category);
        }
    }

    // Year filters
    if (yearFrom) searchParams.set("primary_release_date.gte", `${yearFrom}-01-01`);
    if (yearTo) searchParams.set("primary_release_date.lte", `${yearTo}-12-31`);

    // Genre filtering works ONLY with discover
    if (genre) {
        const value = Array.isArray(genre) ? genre.join(",") : String(genre);
        searchParams.set("with_genres", value);
    }

    const url = `${BASE_URL}${endpoint}?${searchParams.toString()}`;

    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed TMDb request");

    const json = await res.json();

    return {
        page: json.page,
        per_page: 20,
        total: json.total_results,
        total_pages: json.total_pages,
        data: json.results.map(mapTMDbMovie),
    };
}
