export default function Loader({ size = "normal" }: { size?: "normal" | "small" }) {
    return <div style={{ paddingTop: size === "small" ? 8 : '25vh', textAlign: 'center' }}><img src={"/loader.svg"} /></div>;
}