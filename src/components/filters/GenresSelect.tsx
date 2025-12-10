import { useGenres } from "../../hooks/useGenres";

type Genre = {
    id: number;
    name: string;
};

type GenreSelectProps = {
    value: string | number;
    onChange: (value: string | number) => void;
};

export default function GenreSelect({ value, onChange }: GenreSelectProps) {
    const genres: Genre[] = useGenres();

    return (
        <select value={value} onChange={(e) => onChange(e.target.value)}>
            <option value="">All Genres</option>

            {genres.map((g) => (
                <option key={g.id} value={g.id}>
                    {g.name}
                </option>
            ))}
        </select>
    );
}
