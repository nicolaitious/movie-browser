import { useEffect, useRef } from 'react';
import styles from '../styles/ModalBackground.module.scss';

export default function ModalBackground({ callback, visible, blurry }: {
    callback: () => void;
    visible: boolean | number | null;
    blurry?: boolean;
}) {

    useEffect(() => {
        const previous = document.body.style.overflowY;
        document.body.style.overflowY = visible ? 'hidden' : 'auto';

        return () => {
            document.body.style.overflowY = previous;
        };
    }, [visible]);

    const ref = useRef<HTMLDivElement | null>(null);

    return (
        <div
            ref={ref}
            className={`${styles.background} ${blurry ? styles.blurry : ""} ${visible ? styles.visible : ""}`}
            onClick={(e) => {
                if (e.target === ref.current) callback();
            }}
        />
    )
}