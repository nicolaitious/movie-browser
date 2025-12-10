export type Movie = {
    Title: string;
    Year: string; // string in source; convert if needed
    Rated?: string;
    Released?: string;
    Runtime?: string;
    Genre?: string;
    Director?: string;
    Writer?: string;
    Actors?: string;
};

export type MoviesPageResponse = {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
    data: Movie[];
};
