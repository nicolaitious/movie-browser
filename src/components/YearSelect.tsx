import { useMemo } from "react";

type YearSelectProps = {
    value?: string;
    onChange: (year: string) => void;
    label: string;
    minYear: number; // smallest year you want to allow
};

export function YearSelect({ value, onChange, label, minYear }: YearSelectProps) {
    const currentYear = new Date().getFullYear();

    const years = useMemo(() => {
        const arr: number[] = [];
        for (let y = minYear; y <= currentYear; y++) {
            arr.push(y);
        }
        return arr;
    }, [currentYear, minYear]);

    return (
        <select value={value || ""} onChange={(e) => onChange(e.target.value)}>
            <option value="">{label}</option>
            {years.map((y) => (
                <option key={y} value={y}>
                    {y}
                </option>
            ))}
        </select>
    );
}