import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSliders } from "@fortawesome/free-solid-svg-icons";
import styles from "../../styles/Filters.module.scss";
import type { FilterFieldConfig, Filters } from "../../types/Filters.types";

export default function FiltersPanel({
    local,
    setLocal,
    open,
    setOpen,
    apply,
    clear,
    config,
}: {
    local: Filters;
    setLocal: React.Dispatch<React.SetStateAction<Filters>>;
    open: boolean;
    setOpen: (open: boolean) => void;
    apply: () => void;
    clear: () => void;
    config: FilterFieldConfig[];
}) {
    return (
        <div className={styles.filtersWrapper}>
            <button
                className={`${styles.toggleFilters} ${open ? styles.visible : ""}`}
                onClick={() => {
                    setOpen(!open);
                }}
            >
                <FontAwesomeIcon icon={faSliders} />
            </button>

            <div
                className={`${styles.filtersAndButtons} ${open ? styles.visible : ""}`}
                role="region"
                aria-label="movie filters"
            >
                <div className={styles.filters}>
                    {config.map((f) => {
                        const Custom = f.component;
                        return (
                            <label key={f.key}>
                                <span>{f.label}</span>
                                {Custom ? (
                                    <Custom
                                        {...(f.props || {})}
                                        value={local[f.key]}
                                        onChange={(val: any) =>
                                            setLocal((s) => ({ ...s, [f.key]: val }))
                                        }
                                    />
                                ) : (
                                    <input
                                        type="text"
                                        placeholder={f.placeholder || ""}
                                        value={local[f.key] ?? ""}
                                        onChange={(e) =>
                                            setLocal((s) => ({
                                                ...s,
                                                [f.key]: e.target.value,
                                            }))
                                        }
                                    />
                                )}
                            </label>
                        );
                    })}
                </div>
                <div className={styles.buttons}>
                    <button
                        className={styles.clearButton}
                        onClick={clear}
                    >
                        Clear filters
                    </button>

                    <button
                        className={styles.applyButton}
                        onClick={apply}
                    >
                        Apply filters
                    </button>
                </div>
            </div>
        </div>
    );
}
