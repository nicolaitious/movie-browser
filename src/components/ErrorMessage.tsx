export default function ErrorMessage({ message }: { message: string }) {
    return <div style={{ color: "crimson" }}>Error: {message}</div>;
}
