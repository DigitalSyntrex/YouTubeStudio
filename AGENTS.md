# YouTube Playthrough & Let's Play Project Guidelines

This template provides the blueprint and conventions for building YouTube Playthrough / Let's Play Studio Planners for gaming series.

## Project Structure & Conventions

1. **Episode Structure & Data Schema (`/src/types.ts`)**:
   - Every episode must include: `id`, `partNumber`, `title`, `shortTitle`, `world`/`act`, `startPoint`, `endPoint`, `keyEvents`, `bosses`, `estDurationMinutes`, `status`, `youtubeDescription`, `tags`, `thumbnailText`, `suggestedThumbnailPrompt`.
   - Track production status: `not_started`, `recorded`, `edited`, `uploaded`, `published`.

2. **YouTube Optimization & SEO**:
   - Provide copyable SEO tags, structured descriptions with chapter timestamps, and CTR-focused video titles.
   - Include a strategy guide modal for SEO tips, thumbnail best practices, and audio/copyright guidelines.

3. **High-CTR 1280x720 Thumbnail Builder (`/src/components/ThumbnailBuilder.tsx`)**:
   - Render live canvas/SVG preview with customizable text overlays, episode numbers, character portraits, and badges.
   - Support vector graphics rendering and PNG export (`1280x720`).
   - Include API fallback handling for AI artwork generation to guarantee non-breaking client experience.

4. **Batch Exporting (`/src/components/ExportModal.tsx`)**:
   - Support Markdown (`.md`), CSV, and JSON export formats for YouTube Studio batch upload, Notion planning, and Google Sheets integration.

5. **Aesthetics & UI**:
   - Dark, gaming-focused visual theme with high contrast (`bg-[#0a0a0a]`, `bg-[#121212]`, clean zinc/white borders).
   - Responsive grid/list view toggles, instant search, and world/status filtering.
