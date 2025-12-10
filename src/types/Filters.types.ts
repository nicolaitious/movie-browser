// src/config/movieFilters.ts
import GenreSelect from "../components/filters/GenresSelect";
import { YearSelect } from "../components/YearSelect";

/**
 * Filters we use for TMDb.
 * Sorting is removed. Instead we use TMDb category endpoints:
 *  - /movie/popular
 *  - /movie/top_rated
 *  - /movie/upcoming
 */
export type Filters = {
    title?: string;
    genre?: string;
    yearFrom?: string;
    yearTo?: string;
    section?: "popular" | "top_rated" | "upcoming";
};

/** A single filter field in the UI */
export type FilterFieldConfig = {
    key: keyof Filters;
    label: string;
    placeholder?: string;
    component?: React.ComponentType<any>;
    props?: Record<string, any>;
};

/**
 * UI filter config.
 * Only real filters: genre + year range.
 * Section is controlled outside (e.g., tabs or buttons).
 */
export const movieFilterConfig: FilterFieldConfig[] = [
    // Title search might be enabled separately in its own search bar
    // { key: "title", label: "Title:", placeholder: "Search by title…" },

    {
        key: "genre",
        label: "Genre:",
        component: GenreSelect,
        props: { label: "Genre" },
    },

    {
        key: "yearFrom",
        label: "Year from:",
        component: YearSelect,
        props: { minYear: 1980, label: "From" },
    },

    {
        key: "yearTo",
        label: "Year to:",
        component: YearSelect,
        props: { minYear: 1980, label: "To" },
    },
];

/**
 * Sections replace sorting.
 * These map to TMDb endpoints:
 *  - popular → /movie/popular
 *  - top_rated → /movie/top_rated
 *  - upcoming → /movie/upcoming
 */
export const movieSectionOptions = [
    { value: "popular", label: "Popular" },
    { value: "top_rated", label: "Top Rated" },
    { value: "upcoming", label: "Upcoming" },
];
