import { useEffect, useState } from "react";

export function useGenres() {
    const [genres, setGenres] = useState([]);

    useEffect(() => {
        async function loadGenres() {
            const res = await fetch(
                `https://api.themoviedb.org/3/genre/movie/list?api_key=${import.meta.env.VITE_TMDB_API_KEY}&language=en-US`
            );
            const data = await res.json();
            setGenres(data.genres); // [{ id: 28, name: "Action" }, ...]
        }

        loadGenres();
    }, []);

    return genres;
}
