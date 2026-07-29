import type { Metadata } from "next";
import FestSeite from "@/components/fest-seite";

// Die englische Fassung der Seite — gleiche Bildwelt, gleiche Struktur,
// nur die Texte kommen in Englisch aus dem Wörterbuch.
export const metadata: Metadata = {
  title: "Hausfest Via 1 — 5 September",
  description:
    "10 years of Spinnerei, 33 years of Via Felsenau — we're celebrating on 5 September from 4 pm at Spinnereiweg 17 in Bern.",
};

export default function HomeEn() {
  return <FestSeite sprache="en" />;
}
