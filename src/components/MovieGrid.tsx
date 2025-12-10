import { useEffect, useRef, useState } from "react";
import MovieCard from "./MovieCard";
import type { Movie } from "../api/movies";
import styles from "../styles/MovieGrid.module.scss";
import ModalBackground from "./ModalBackground";
// @ts-ignore
import { LazyLoadComponent } from 'react-lazy-load-image-component';

interface MovieGridProps {
    movies: Movie[];
    fetchNextPage: () => void;
    hasNextPage?: boolean;
    isFetchingNextPage: boolean;
    perPage: number;
}

export default function MovieGrid({
    movies,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    perPage,
}: MovieGridProps) {

    const [hoveredId, setHoveredId] = useState<number | null>(null);
    const sentinelRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!hasNextPage) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const first = entries[0];
                if (first.isIntersecting) {
                    fetchNextPage();
                }
            },
            { threshold: 0.5 }
        );

        const el = sentinelRef.current;
        if (el) observer.observe(el);

        return () => {
            if (el) observer.unobserve(el);
            observer.disconnect();
        };
    }, [hasNextPage, fetchNextPage]);

    return (
        <>
            <div className={styles.grid}>
                {movies.map((m, i) => {
                    return (
                        m.posterUrl && m.backdropUrl &&
                        <LazyLoadComponent
                            threshold={500}
                            key={m.id}
                        >
                            <MovieCard
                                index={i % perPage}
                                movie={m}
                                isHover={hoveredId === m.id}
                                setHoveredId={setHoveredId}
                            />
                        </LazyLoadComponent>
                    )
                })}
            </div>

            <ModalBackground callback={() => setHoveredId(null)} visible={hoveredId} />

            <div ref={sentinelRef} style={{ height: "40px" }} />

            {isFetchingNextPage && <p style={{ textAlign: "center" }}>Loading more…</p>}

            {movies.length === 0 && <p style={{ textAlign: "center" }}>No results found</p>}
        </>
    );
}
