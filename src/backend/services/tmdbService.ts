import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const API_URL = "https://api.themoviedb.org/3";
const API_KEY = process.env.TMDB_API_KEY!;

export async function getPopularMovies(page = 1) {
    const res = await fetch(`${API_URL}/movie/popular?api_key=${API_KEY}&page=${page}`);
    if (!res.ok) throw new Error("TMDb error");
    const json: any = await res.json();

    return json.results.map(mapMovie);
}

export async function discoverMovies(params: Record<string, string | number | undefined>) {
    const url = new URL(`${API_URL}/discover/movie`);
    url.searchParams.set("api_key", API_KEY);

    Object.entries(params).forEach(([k, v]) => {
        if (v != null) url.searchParams.set(k, String(v));
    });

    const res = await fetch(url);
    if (!res.ok) throw new Error("TMDb error");
    const json: any = await res.json();

    return json.results.map(mapMovie);
}

export async function searchMovies(query: string, page = 1) {
    const url = `${API_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("TMDb error");

    const json: any = await res.json();
    return json.results.map(mapMovie);
}

export async function getMovieDetails(id: number) {
    const res = await fetch(`${API_URL}/movie/${id}?api_key=${API_KEY}`);
    if (!res.ok) throw new Error("TMDb error");

    const json = await res.json();
    return mapFullMovie(json);
}

function mapMovie(m: any) {
    return {
        id: m.id,
        title: m.title,
        overview: m.overview,
        releaseDate: m.release_date,
        posterUrl: m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : "",
        backdropUrl: m.backdrop_path ? `https://image.tmdb.org/t/p/w780${m.backdrop_path}` : "",
        voteAverage: m.vote_average,
        voteCount: m.vote_count,
        popularity: m.popularity,
        originalLanguage: m.original_language,
        genreIds: m.genre_ids || [],
    };
}

function mapFullMovie(m: any) {
    return {
        ...mapMovie(m),
        genres: m.genres || [],
        runtime: m.runtime ?? null,
        tagline: m.tagline ?? null,
    };
}
