export const API_BASE = (import.meta.env.VITE_API_BASE as string) || "http://localhost:3001/api";
// export const API_BASE = (import.meta.env.VITE_API_BASE as string) || "http://192.168.1.X:3001/api";

export async function fetchJSON<T = any>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Network error ${res.status}`);
  }
  return (await res.json()) as T;
}