// Gezeichnete Kleinteile für die Seite: Korallen und Blasen, dieselbe
// Handschrift wie die Hintergrund-Illustration in `public/art/hero.svg`.

type CoralForm = { dick: string; mittel: string; fein: string };

const FORMEN: CoralForm[] = [
  {
    dick: "M50 96Q46 80 50 66",
    mittel: "M50 66Q58 58 63 50M50 66Q40 59 34 52M50 66Q57 58 61 50",
    fein: "M63 50Q70 45 77 45M63 50Q62 41 59 34M63 50Q72 50 79 48M34 52Q32 44 32 38M34 52Q26 56 18 54M61 50Q69 52 75 47M61 50Q59 43 62 36",
  },
  {
    dick: "M50 96Q49 80 50 66",
    mittel: "M50 66Q61 63 68 54M50 66Q44 56 37 49M50 66Q59 59 58 47",
    fein: "M68 54Q76 57 83 54M68 54Q72 47 73 39M37 49Q41 42 38 34M37 49Q32 43 24 43M58 47Q64 44 69 41M58 47Q53 42 51 35",
  },
  {
    dick: "M50 96Q52 80 50 66",
    mittel: "M50 66Q53 56 59 49M50 66Q50 56 41 50M50 66Q57 56 65 51",
    fein: "M59 49Q65 44 72 42M59 49Q61 42 56 36M59 49Q66 50 71 45M41 50Q42 43 42 37M41 50Q33 49 28 43M41 50Q41 43 40 37M65 51Q73 50 79 49M65 51Q69 42 69 33",
  },
];

/** Eine kleine Koralle. `form` wählt eine der drei gezeichneten Varianten. */
export function Coral({
  form = 0,
  className = "",
}: {
  form?: 0 | 1 | 2;
  className?: string;
}) {
  const f = FORMEN[form];
  return (
    <svg
      viewBox="0 0 100 100"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
    >
      <path d={f.dick} strokeWidth={7} />
      <path d={f.mittel} strokeWidth={5.3} />
      <path d={f.fein} strokeWidth={4} />
    </svg>
  );
}

/** Trennlinie: gestrichelte Tuschelinie mit einer Koralle in der Mitte. */
export function CoralRule({ form = 0 }: { form?: 0 | 1 | 2 }) {
  return (
    <div className="flex items-center gap-4" aria-hidden="true">
      <div className="ink-rule flex-1" />
      <Coral form={form} className="h-7 w-7 text-blossom/70" />
      <div className="ink-rule flex-1" />
    </div>
  );
}

/** Kalenderblatt für den Termin-Download. */
export function Kalender({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.9}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3.2" y="5" width="17.6" height="16" rx="3" />
      <path d="M3.2 10h17.6" />
      <path d="M8 3v4" />
      <path d="M16 3v4" />
    </svg>
  );
}

/** Symbol für die Sparte eines Acts. Ohne Sparte ein neutraler Stern —
 *  besser als ein Symbol, das etwas Falsches behauptet. */
export function SparteIcon({
  art,
  className = "",
}: {
  art?: "Band" | "Theater" | "DJ";
  className?: string;
}) {
  const pfade = {
    Theater: (
      <>
        <path d="M4.5 5.5h15v5.5a7.5 7.5 0 0 1-15 0V5.5Z" />
        <path d="M9 10h.01" />
        <path d="M15 10h.01" />
        <path d="M9.4 14.4a3.6 3.6 0 0 0 5.2 0" />
      </>
    ),
    Band: (
      <>
        <path d="M9 17V5.5l10-2V15" />
        <circle cx="6" cy="17.5" r="3" />
        <circle cx="16" cy="15.5" r="3" />
      </>
    ),
    DJ: (
      <>
        <circle cx="10.5" cy="13.5" r="7.4" />
        <circle cx="10.5" cy="13.5" r="1.9" />
        <path d="M16.2 8.3 20.4 4.2" />
      </>
    ),
  };

  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {art ? (
        pfade[art]
      ) : (
        <>
          <path d="M12 4v16" />
          <path d="M4 12h16" />
          <path d="m6.3 6.3 11.4 11.4" />
          <path d="m17.7 6.3-11.4 11.4" />
        </>
      )}
    </svg>
  );
}

/** Seifenblase als Rahmen für kleine Inhalte (Zahlen, Icons). */
export function Bubble({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`relative inline-flex items-center justify-center rounded-full border border-white/60 bg-gradient-to-br from-white/35 via-sky/20 to-blossom/20 shadow-[inset_0_2px_10px_rgba(255,255,255,0.45)] ${className}`}
    >
      <span
        aria-hidden="true"
        className="absolute left-[22%] top-[18%] h-1.5 w-2.5 -rotate-[35deg] rounded-full bg-white/90"
      />
      {children}
    </span>
  );
}
