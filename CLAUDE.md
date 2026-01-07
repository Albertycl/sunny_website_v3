# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Sunny Website v3 is a React-based travel tour website for "韓國導遊領隊桑尼Sunny" (Sunny Korea Tour Guide). It uses Vite as the build tool and integrates with Google's Gemini AI for generating travel insights.

## Commands

- `npm run dev` - Start development server on port 3000
- `npm run build` - TypeScript check + Vite production build (outputs to `dist/`)
- `npm run preview` - Preview production build locally

## Architecture

### Tech Stack
- React 19 with TypeScript
- Vite 6 for bundling
- TailwindCSS (loaded via CDN in index.html)
- Google GenAI SDK (`@google/genai`) for AI features

### Project Structure
```
/                       # Root contains main app files
├── index.html          # Entry HTML with TailwindCSS CDN and importmap
├── index.tsx           # React entry point
├── App.tsx             # Main app with routing logic (path-based: / and /admin)
├── types.ts            # TypeScript interfaces (Tour, FilterType)
├── constants.ts        # Static data (SUNNY_CONTACTS, MOCK_TOURS)
├── services/
│   └── geminiService.ts  # Gemini AI integration
└── components/
    ├── Navbar.tsx       # Sticky navigation bar
    ├── Hero.tsx         # Hero section with featured tour countdown
    ├── TourCard.tsx     # Tour display cards
    ├── WeatherOutfit.tsx # Weather-based outfit recommendations (Open-Meteo API)
    ├── FilterBar.tsx    # Tour filtering UI
    ├── AdminPanel.tsx   # Admin tour management (CRUD)
    ├── AdminLogin.tsx   # Simple admin authentication
    ├── BlogSection.tsx  # Blog/content section
    └── PhotoUpload.tsx  # Photo upload component
```

### Key Patterns

**Routing**: The app uses path-based routing without a router library. `App.tsx` checks `window.location.pathname` for `/admin` route.

**State Persistence**: Tours and featured tour ID are stored in `localStorage` (`sunny_tours_v4`, `sunny_featured_tour_id`). Admin auth uses `sessionStorage` (`sunny_admin_auth`).

**Environment Variables**: Configured in `vite.config.ts` with priority: System env (for Zeabur deployment) > `.env` file
- `GEMINI_API_KEY` / `API_KEY` - Google Gemini API
- `UNSPLASH_ACCESS_KEY` / `UNSPLASH_SECRET_KEY` - Unsplash API (optional)

**Admin Access**: Navigate to `/admin` path to access the admin panel. Session-based authentication.

## External APIs

- **Google Gemini**: Used in `services/geminiService.ts` for generating AI travel insights
- **Open-Meteo**: Free weather API used in `WeatherOutfit.tsx` for real-time Korean city weather
