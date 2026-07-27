<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Stack

- **Datenbank**: Postgres 16 im Docker-Container auf Alains VPS
- **ORM**: **Drizzle** — Schema in `src/lib/db/schema.ts`
- **Auth**: bei Bedarf mit bcrypt + eigener Session (kein Supabase, kein NextAuth)
- **PWA**: `public/manifest.webmanifest` + `public/sw.js` — Service Worker cached
  die App-Shell für Offline-Nutzung. Icons in `public/icons/`.
- **Look**: gezeichnete Tuschewelt auf Nachtblau (`#071540`) — Seifenblasen,
  Korallen, das Haus. Illustration, Icons und die Laser-Vorlage entstehen aus
  Code in `scripts/art/` (siehe README dort), nicht von Hand.
- **Schriften**: liegen als OFL-TTF in `src/app/fonts/` und werden über
  `next/font/local` geladen — der Docker-Build braucht dafür kein Netz.
- **Fest-Inhalte**: Datum, Floors, Acts und der Ticket-Link stehen zentral in
  `src/lib/fest.ts`. Neue Bands dort eintragen, nicht im JSX.
- **Deploy**: Push auf `main` → GitHub Actions baut Docker-Image → SSH-Deploy zum VPS
- **Live-URL**: https://hausfest-via.al-daellen.ch

## Zielgruppe

Gäste des Hausfests — mobile-first, installierbar auf iOS/Android.

Beispiel-Inhalte (was in die App sollte):
- Save-the-Date / Datum & Zeit
- Anfahrt (Karte, ÖV)
- Programm / Line-up
- Hausregeln / FAQ
- Optional: RSVP-Formular, Foto-Upload nach dem Fest

## PWA-Installation

- iOS: Safari → Teilen → "Zum Home-Bildschirm"
- Android: Chrome zeigt automatisch "App installieren"-Button
