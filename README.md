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

## Inhalte pflegen

Datum, Floors, das Line-up und der Ticket-Link stehen zentral in
`src/lib/fest.ts`. Eine neue Band trägst du dort in `ACTS` ein — sie erscheint
automatisch auf der Seite. Sobald der Ticket-Shop steht, `TICKET_URL` setzen:
Dann wird aus dem Hinweis „Ticketverkauf startet in Kürze“ ein Button.

## Bilder und Laser-Vorlage

Illustration, App-Icons und der QR-Anhänger werden aus Code erzeugt — siehe
`scripts/art/README.md`. Die fertige Laser-Datei für den Holz-Anhänger liegt
in `laser/` (Details und Lasereinstellungen: `laser/README.md`).

## So arbeitest du daran

1. Repo öffnen, Punkttaste `.` → github.dev
2. Änderungen mit Codex/ChatGPT
3. Committen + pushen auf `main` → ~2 Min später live

## Schema-Änderungen

1. `src/lib/db/schema.ts` editieren
2. `npm run db:generate` → Migration in `drizzle/`
3. Committen + pushen → automatisch migriert
