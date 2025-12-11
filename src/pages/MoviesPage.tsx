import { useMovies } from "../hooks/useMovies";
import FiltersUI from "../components/filters/Filters";
import MovieGrid from "../components/MovieGrid";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";
import { useState } from "react";
import type { Filters } from "../types/Filters.types";
import { CategorySelector } from "../components/CategorySelector";

export default function MoviesPage() {
    const [category, setCategory] = useState<"popular" | "top_rated" | "upcoming" | "now_playing">("popular");
    const [filters, setFilters] = useState<Filters>({});
    const perPage = 20;

    const {
        movies,
        isLoading,
        error,
        isFetching,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useMovies(filters, category);

    return (
        <>
            <header>
                <h1 className="no-select">Cinéma<br />Galaxy</h1>
            </header>
            <FiltersUI
                value={filters}
                onChange={setFilters}
            />
            <CategorySelector
                category={category}
                setCategory={setCategory}
            />
            <section>
                {error && <ErrorMessage message={error.message} />}
                {!isLoading && <MovieGrid
                    movies={movies}
                    fetchNextPage={fetchNextPage}
                    hasNextPage={hasNextPage}
                    isFetchingNextPage={isFetchingNextPage}
                    perPage={perPage}
                />}
                {(isFetching || isLoading) && <Loader size="normal" />}
            </section>
        </>
    );
}