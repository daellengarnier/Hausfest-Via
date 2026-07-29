import FestSeite from "@/components/fest-seite";

// Die deutsche Seite. Der englische Zwilling liegt unter /en — beide sind
// nur dünne Hüllen um dieselbe Komponente, damit Layout und Bildwelt nie
// auseinanderlaufen können.
export default function Home() {
  return <FestSeite sprache="de" />;
}
