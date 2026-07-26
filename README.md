# Hausfest Via

Installierbare PWA für die **Gäste des Hausfests** — mobile-first, mit
Service Worker für Offline-Nutzung.

## Live

https://hausfest-via.al-daellen.ch

## Stack

- **Next.js 16** (App Router, Standalone) + **React 19** + **Tailwind v4**
- **Postgres 16** + **Drizzle ORM** (Schema noch leer)
- **PWA**: `public/manifest.webmanifest` + `public/sw.js`
- **Docker** + **GitHub Actions** für Auto-Deploy zum VPS
- Reverse-Proxy: **Caddy** (zentral im `ambardaellen-app`-Stack)

## PWA-Installation für Gäste

- **iPhone (Safari)**: Teilen-Symbol → „Zum Home-Bildschirm"
- **Android (Chrome)**: Menü → „App installieren" (erscheint automatisch)

Nach Installation läuft die App wie eine native App (Vollbild, ohne Browser-UI).

## Icons ersetzen

Aktuell in `public/icons/` liegen nur Platzhalter. Für die echte App:

1. Quelldatei als PNG mind. 512×512 vorbereiten
2. In den drei Größen speichern: `icon-192.png`, `icon-512.png`, `apple-touch-icon.png` (180×180)
3. Alle in `public/icons/` ablegen

## So arbeitest du daran

1. Repo öffnen, Punkttaste `.` → github.dev
2. Änderungen mit Codex/ChatGPT
3. Committen + pushen auf `main` → ~2 Min später live

## Schema-Änderungen

1. `src/lib/db/schema.ts` editieren
2. `npm run db:generate` → Migration in `drizzle/`
3. Committen + pushen → automatisch migriert
