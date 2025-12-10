import express, { type Request, type Response, type NextFunction } from "express";
import morgan from "morgan";
import * as service from "./services/moviesService.ts";
import { type MoviesPageResponse } from "./types.ts";
import cors from "cors";

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 3001;

app.use(morgan("dev"));
app.use(express.json());

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: false,
    })
);

app.use(
    cors({
        origin: true,
        credentials: false,
    })
);

// ---- Proxy single page endpoint (mirrors wiremock) ----
app.get("/api/movies/search", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const page = Number(req.query.page || 1);
        const pageResp = await service.fetchPage(page);
        res.json(pageResp);
    } catch (err) {
        next(err);
    }
});

// ---- Aggregated endpoint with server-side filtering + pagination ----
app.get("/api/movies", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const page = Math.max(1, Number(req.query.page || 1));
        const per_page = Math.max(1, Math.min(100, Number(req.query.per_page || 12)));

        // allowed filter keys
        const allowedKeys = ["all", "title", "director", "genre", "yearFrom", "yearTo", "rated", "sortBy", "sortDir"] as const;
        const filters: Record<string, string | undefined> = {};
        for (const k of allowedKeys) {
            if (req.query[k] !== undefined) filters[k] = String(req.query[k]);
        }

        // Fetch aggregated movies
        const movies = await service.fetchAllMovies();

        // Apply filtering
        const filtered = service.applyFilters(movies, filters);

        // Pagination
        const total = filtered.length;
        const total_pages = Math.max(1, Math.ceil(total / per_page));
        const start = (page - 1) * per_page;
        const pageData = filtered.slice(start, start + per_page);

        const resp: MoviesPageResponse = {
            page,
            per_page,
            total,
            total_pages,
            data: pageData,
        };
        res.json(resp);
    } catch (err) {
        next(err);
    }
});

// ---- Health ----
app.get("/api/health", (_req, res) => res.json({ ok: true }));

// ---- Error handler ----
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err?.stack ?? err);
    res.status(500).json({ error: err?.message ?? "internal" });
});

app.listen(PORT, () => {
    console.log(`Backend listening on http://localhost:${PORT}`);
});
