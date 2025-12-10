import { useState, useEffect } from "react";
import useDebounce from "./useDebounce";
import type { Filters } from "../types/Filters.types";

export function useFiltersState(initial: Filters, onChange: (next: Filters) => void) {
    const [local, setLocal] = useState<Filters>(initial);
    const [open, setOpen] = useState(false);
    const [genericSearchOpen, setGenericSearchOpen] = useState(false);

    const debounced = useDebounce(local, 500);

    // Sync debounced filters up to parent
    useEffect(() => {
        onChange({ ...debounced });
    }, [onChange, debounced]);

    // Scroll to top when local changes
    useEffect(() => {
        window.scroll({ top: 0, behavior: "smooth" });
    }, [local]);

    // If generic search opens, reset filters + close panel
    useEffect(() => {
        if (genericSearchOpen) {
            // setLocal({});
            setOpen(false);
        }
    }, [genericSearchOpen]);

    const apply = () => setOpen(false);
    const clear = () => {
        setLocal({});
        setOpen(false);
    };

    return {
        local,
        setLocal,
        open,
        setOpen,
        genericSearchOpen,
        setGenericSearchOpen,
        apply,
        clear,
    };
}
