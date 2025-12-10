import styles from "../styles/CategorySelector.module.scss";

type Category = "popular" | "top_rated" | "upcoming" | "now_playing"; // extend if needed

const CATEGORIES: { value: Category; label: string }[] = [
    { value: "popular", label: "Popular" },
    { value: "top_rated", label: "Top Rated" },
    { value: "upcoming", label: "Upcoming" },
    // { value: "now_playing", label: "Now Playing" },
];

type CategorySelectorProps = {
    category: Category;
    setCategory: (category: Category) => void;
};

export function CategorySelector({ category, setCategory }: CategorySelectorProps) {
    return (
        <div className={styles.categories}>
            {CATEGORIES.map((cat) => (
                <button
                    key={cat.value}
                    className={category === cat.value ? styles.active : ""}
                    onClick={() => setCategory(cat.value)}
                >
                    {cat.label}
                </button>
            ))}
        </div>
    );
}
