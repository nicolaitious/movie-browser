# Movies Explorer — React Challenge

A modern, responsive, high-performance React application for browsing, filtering, and searching movies using the provided REST API.

This project was built as a solution to the challenge described below.

## Challenge Requirements

The challenge provides a REST API that exposes a list of movies released after 2010, directed by renowned directors.
The task is to build a web application that:

Fetches movies from the API

Displays them in a user-friendly interface

Allows filtering, searching, and browsing the full collection

## API Specification

GET endpoint:

https://wiremock.dev.eroninternational.com/api/movies/search?page=<pageNumber>

## API Response

Each request returns a JSON payload containing:

Field	Description
page	Current page number
per_page	Movies per page
total	Total number of movies
total_pages	Total number of pages
data	Array of movie objects

Each movie object includes:

Title

Year

Rated

Released

Runtime

Genre

Director

Writer

Actors

# Solution Overview

This project is a React-based web application (Vite + React Query + TypeScript) that emphasizes:

Smooth UX

Highly reusable components

Performance optimizations

Mobile + Desktop views

Clean architecture

Modern React best practices

## Features

### 1. Advanced Filtering System (Reusable & Generic)

The filtering UI was designed to be generic, composable, and scalable.

It supports configurable fields, custom components (to be used instead of regular inputs),
and features a “search all fields” GenericSearch component.

#### Key characteristics:

Built from reusable parameter-driven components

Easily extendable to support new fields

Logic fully decoupled from UI

Debounced text inputs to reduce unnecessary API calls

#### Generic Search Component

A shared <GenericSearch /> component powers multiple searchable fields.

It supports:

Debounce timing

Clear buttons

Auto-focus + scroll handling

Controlled/uncontrolled flexibility

### 2. Infinite Scrolling with React Query

The app uses React Query's useInfiniteQuery to fetch API pages and merge results.

Optimizations include:

Dedupe merged movie results across pages

Prevent duplicate queries

Stable cache keys

Memoized selectors to avoid re-renders

### 3. Intricate UI Animations

Animations were implemented to enhance UX without harming performance.

Techniques include:

CSS transitions + keyframes

Animated filter panel expand/collapse

Hover transitions in movie cards

Scroll-driven fade-ins

#### All animations were designed to be:

GPU-accelerated

Non-blocking

Overdraw-friendly for mobile devices

### 4. High-Performance Data Handling

Multiple performance techniques were applied:

- Debouncing

All search inputs use a custom useDebounce hook to reduce filter spam.

- Dedupe

Merged infinite-query responses are deduped by Title + Year to avoid UI repetition.

- Memoization

Memoized:

Sorted + filtered results

Derived values inside useMovies

Static arrays (genre lists, year ranges, etc.)

- Prevent Excessive Re-renders

React.memo around list components

Controlled props for filter components

- 5. Responsive UX (Desktop + Mobile)

The UI adjusts via SCSS modules with breakpoints:

Desktop

Grid layout with hover interactions

Expanded filter panel

Larger spacing, card animations

Mobile

Collapsible filter menu with icon toggle

Condensed grid

Optimized text sizes

- 6. Sorting System

A dedicated sorting control allows sorting by:

Title

Year

Rating

Director

Sorting is generic and fully integrated with the filtering architecture.

- 7. Clean Component Architecture

The project is organized into composable modules:

/api
/assets
/backend
/components
/hooks
/pages
/styles
/types

All components are designed for:

Reusability

Isolation

Predictable internal state

Strong TypeScript typing

- Tech Stack

Frontend

React + Vite

TypeScript

React Query (@tanstack/react-query)

SCSS modules

FontAwesome Icons

## Known Limitations / Improvements Left Out

These improvements were intentionally left out due to time constraints:

- Server-side filtering

Filtering is currently client-side after fetching each page.

- Faceted filtering from the backend

The API does not include endpoints for genres, directors, etc., so facets are generated client-side.

- Missing automated tests

Integration tests (React Testing Library) were planned but not implemented.

- No server caching layer

A backend proxy (e.g., Express + Redis) could reduce API roundtrips.

- Some animations could be further optimized

Particularly on low-end Android devices.

- Some components could be made more reusable

MovieCard, for example, but given that this is presumably a Movie app, I believe consistency among lists are actually good.

## Running the Project

### Install dependencies
pnpm install

### Start the frontend server (development) on port 5173
pnpm run dev

### Start the backend server on port 3001
pnpm run server

### Build for production
pnpm run build