export default function Loader({ size = "normal" }: { size?: "normal" | "small" }) {
    return <div style={{ padding: size === "small" ? 8 : 24, textAlign: 'center' }}>Loading…</div>;
}