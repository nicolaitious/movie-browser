import React, { useEffect, useRef, useState } from "react";
import type { Movie } from "../api/movies";
import styles from "../styles/MovieCard.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

export default React.memo(function MovieCard({
    index,
    movie,
    isHover,
    setHoveredId,
}: {
    index: number;
    movie: Movie;
    isHover: boolean;
    setHoveredId: (id: number | null) => void;
}) {

    const ref = useRef<HTMLDivElement | null>(null);
    const raf = useRef<number>(0);
    const [loaded, setLoaded] = useState<boolean>(false);;

    const setCoords = () => {
        cancelAnimationFrame(raf.current);
        raf.current = requestAnimationFrame(() => {
            const rect = ref.current?.getBoundingClientRect();
            if (!rect) return;

            ref.current!.style.setProperty("--card-x", rect.left + rect.width + "px");
            ref.current!.style.setProperty("--card-y", rect.top + rect.height + "px");
        });
    }

    useEffect(() => {
        const onResize = () => {
            if (isHover) setCoords();
        };

        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, [isHover]);


    const handleClick = () => {
        setCoords();
        setHoveredId(movie.id)
    };

    return (
        <article className={`${loaded ? styles.loaded : ""}`}
            ref={ref} style={{ animationDelay: `${(index * 0.05).toString()}s` }} aria-label={movie.title}>
            <div
                className={`${styles.card} ${isHover ? styles.isHover : ''}`}
            >
                <div
                    style={{
                        "--backdrop": `url(${movie.backdropUrl})`,
                        "--poster": `url(${movie.posterUrl})`,
                    } as React.CSSProperties}
                    className={styles.front}
                    onClick={() => handleClick()}
                >
                    <img src={movie.posterUrl} onLoad={() => setLoaded(true)} />
                    {/* <p>{movie.genre}</p>
                <small>{movie.runtime}</small>
                <small>{movie.rated}</small> */}
                </div>
                <div
                    style={{
                        "--backdrop": `url(${movie.backdropUrl})`,
                        "--poster": `url(${movie.posterUrl})`,
                    } as React.CSSProperties}
                    className={styles.back}
                    onClick={() => setHoveredId(null)}
                // onTouchEnd={() => setHoveredId(null)}
                >
                    <div>
                        <span>
                            <h3>{movie.title}</h3>
                            <p><FontAwesomeIcon icon={faStar} /> {movie.voteAverage}/10 • {movie.releaseDate} </p>
                        </span>
                        <p>{movie.overview}</p>
                    </div>
                </div>
            </div>
        </article>
    );
})