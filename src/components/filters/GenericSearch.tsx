import { useEffect, useRef } from "react";
import styles from "../../styles/GenericSearch.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faTimes } from "@fortawesome/free-solid-svg-icons";
import ModalBackground from "../ModalBackground";

export default function GenericSearch({
    value,
    onChange,
    placeholder = "Search...",
    autoClearDelay = 750,
    open,
    setOpen,
}: {
    value: string;
    onChange: (val: string) => void;
    placeholder?: string;
    autoClearDelay?: number;
    open: boolean;
    setOpen: (v: boolean) => void;
}) {

    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (open) {
            setTimeout(() => inputRef.current?.focus(), 300);
        } else {
            inputRef.current?.blur();
            setTimeout(() => { if (value !== "") onChange(""); }, autoClearDelay);
        }
    }, [open]);

    return (
        <>
            <ModalBackground callback={() => setOpen(false)} blurry visible={open && !value} />
            <button
                className={styles.genericSearchButton}
                onClick={() => setOpen(!open)}
            >
                <FontAwesomeIcon
                    icon={faMagnifyingGlass}
                    className={`${!open ? styles.visible : ""}`}
                />
                <FontAwesomeIcon
                    icon={faTimes}
                    className={`${open ? styles.visible : ""}`}
                />
            </button>
            <div className={`${styles.genericSearchWrapper} ${open ? styles.visible : ""}`}>
                <input
                    ref={inputRef}
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    className={`${styles.genericSearch} ${open ? styles.visible : ""} ${value ? styles.header : ""}`}
                />
            </div>
        </>
    );
}
