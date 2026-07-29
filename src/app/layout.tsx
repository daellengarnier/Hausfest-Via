import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

// Schriften liegen im Repo (OFL, Lizenzen daneben) — so braucht der
// Docker-Build kein Netz und der Build bleibt reproduzierbar.
const display = localFont({
  src: [
    { path: "./fonts/Outfit-Regular.ttf", weight: "400", style: "normal" },
    { path: "./fonts/Outfit-Bold.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-display",
  display: "swap",
});

const hand = localFont({
  src: "./fonts/NothingYouCouldDo-Regular.ttf",
  weight: "400",
  variable: "--font-hand",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Hausfest Via 1 — 5. September",
  description:
    "10 Jahre Spinnerei, 33 Jahre Via Felsenau — wir feiern am 5. September ab 16 Uhr am Spinnereiweg 17 in Bern.",
  // Sagt Suchmaschinen, dass / und /en dieselbe Seite in zwei Sprachen sind.
  alternates: {
    languages: { de: "/", en: "/en" },
  },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Hausfest",
  },
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/icons/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#00042a",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de" className={`${display.variable} ${hand.variable}`}>
      <head>
        {/* Service Worker registrieren — sobald der Browser die Seite lädt. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js').catch(() => {});
                });
              }
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-night-900 font-display text-foam antialiased">
        {/* Die Seite ist fürs Handy gebaut — Bild, Molchauge und Höhlenfisch
            sitzen anteilig zur Breite. Auf dem Desktop läuft sie darum nicht
            auseinander, sondern steht als Handy-Spalte in der Mitte. Alle
            Masse beziehen sich über `cqw` auf diese Spalte, nicht aufs
            Fenster — so sieht sie überall gleich aus. */}
        <div className="geraet">{children}</div>
      </body>
    </html>
  );
}
