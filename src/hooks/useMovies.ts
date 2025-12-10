import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchMovies, type MoviesResponse, type Movie } from "../api/movies";
import { useMemo } from "react";
import { type InfiniteData } from "@tanstack/react-query";
import type { Filters } from "../types/Filters.types";

export type MovieFilters = {
    title?: string;
    year?: string;
    genre?: string;
    section?: "popular" | "top_rated" | "upcoming" | "now_playing";
};

export function useMovies(filters: Filters, category?: "popular" | "top_rated" | "upcoming" | "now_playing") {
    const query = useInfiniteQuery<
        MoviesResponse,
        Error,
        InfiniteData<MoviesResponse>
    >({
        queryKey: ["movies", filters, category],
        queryFn: ({ pageParam = 1 }) =>
            fetchMovies({
                page: pageParam as number,
                filters,
                category
            }),
        getNextPageParam: (lastPage) =>
            lastPage.page < lastPage.total_pages
                ? lastPage.page + 1
                : undefined,
        staleTime: 1000 * 60 * 2,
        initialPageParam: 1,
    });

    // Dedupe movies between infinite pages
    const movies = useMemo(() => {
        const map = new Map<number, Movie>();

        query.data?.pages.forEach((page) => {
            page.data.forEach((movie) => {
                map.set(movie.id, movie);
            });
        });

        return Array.from(map.values());
    }, [query.data]);

    return {
        ...query,
        movies,
    };
}
