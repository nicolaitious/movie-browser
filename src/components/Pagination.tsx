export default function Pagination({
    page,
    totalPages,
    onChange,
}: {
    page: number;
    totalPages: number;
    onChange: (p: number) => void;
}) {
    return (
        <div className="pagination" role="navigation" aria-label="pagination">
            <button onClick={() => onChange(page - 1)} disabled={page <= 1}>
                Prev
            </button>
            <span>
                {page} / {totalPages}
            </span>
            <button onClick={() => onChange(page + 1)} disabled={page >= totalPages}>
                Next
            </button>
        </div>
    );
}
