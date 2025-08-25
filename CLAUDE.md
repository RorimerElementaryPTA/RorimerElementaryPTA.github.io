# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a static website for Rorimer Elementary PTA built with vanilla HTML, CSS, and JavaScript. The site is bilingual (English/Spanish) and deployed via GitHub Pages.

## Development Commands

**Local Development:**
```bash
python3 -m http.server 8000
# Open http://localhost:8000
```

**Deployment:**
Push to the `main` branch - GitHub Pages automatically deploys from root directory

## Architecture & Structure

### Site Structure
- **Main pages**: `index.html`, `events.html`, `volunteer.html`, `membership.html`, `spiritwear.html`
- **Spanish pages**: Mirror structure in `/es/` directory with translated content
- **Data-driven content**: Events loaded dynamically from `data/events.json` via `js/events.js`
- **Styling**: Single CSS file at `css/styles.css` using CSS custom properties

### Key Features
1. **Bilingual Support**: Duplicate pages in `/es/` folder with language switcher in header
2. **Dynamic Events**: JavaScript loads and groups events from JSON, with automatic date formatting based on locale
3. **External Services**: 
   - Membership purchases via `jointotem.com/ca/la-puente/rorimer-elementary/join`
   - Spirit wear store via `jointotem.com/ca/la-puente/rorimer-elementary-pta/store`

### Important Implementation Details
- Events are grouped by month/period in `data/events.json` using the `group` field
- Spanish event data is stored separately in `es/data/events.json`
- The events.js script detects language from URL path and loads appropriate data file
- No build process or package manager - pure static files