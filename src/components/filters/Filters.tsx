import GenericSearch from "./GenericSearch";
import { useFiltersState } from "../../hooks/useFiltersState";
import FiltersPanel from "./FiltersPanel";
import { movieFilterConfig, type Filters } from "../../types/Filters.types";

export default function FiltersUI({
    value,
    onChange,
}: {
    value: Filters;
    onChange: (next: Filters) => void;
}) {
    const state = useFiltersState(value, onChange);

    return (
        <>
            <GenericSearch
                value={state.local.title || ""}
                onChange={(val) =>
                    state.setLocal((s: Filters) => ({ ...s, title: val }))
                }
                placeholder="Search by title..."
                open={state.genericSearchOpen}
                setOpen={state.setGenericSearchOpen}
            />

            {/* Sorting removed → no sortConfig */}
            <FiltersPanel {...state} config={movieFilterConfig} />
        </>
    );
}
