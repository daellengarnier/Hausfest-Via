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

/** Strichzeichnung für einen Floor — sagt auf einen Blick, was dort läuft. */
export function FloorIcon({
  art,
  className = "",
}: {
  art: "garten" | "pyramide" | "wohnung" | "club";
  className?: string;
}) {
  const pfade = {
    garten: (
      <>
        <path d="M12 21v-9" />
        <path d="M12 15c-3.2 0-5.4-2.2-5.4-5.4C9.8 9.6 12 11.8 12 15Z" />
        <path d="M12 13c2.8 0 4.8-2 4.8-4.8C14 8.2 12 10.2 12 13Z" />
      </>
    ),
    pyramide: (
      <>
        <path d="M12 3 3 20h18L12 3Z" />
        <path d="M12 3v17" />
        <path d="M7.6 12h8.8" />
      </>
    ),
    wohnung: (
      <>
        <path d="M3 11 12 4l9 7" />
        <path d="M5.2 10v10h13.6V10" />
        <path d="M10 20v-5h4v5" />
      </>
    ),
    club: (
      <>
        <path d="M9 17V5.5l10-2V15" />
        <circle cx="6" cy="17.5" r="3" />
        <circle cx="16" cy="15.5" r="3" />
      </>
    ),
  }[art];

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
      {pfade}
    </svg>
  );
}

/** Symbol für die Sparte eines Acts. */
export function SparteIcon({
  art,
  className = "",
}: {
  art: "Band" | "Theater";
  className?: string;
}) {
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
      {art === "Theater" ? (
        <>
          <path d="M4.5 5.5h15v5.5a7.5 7.5 0 0 1-15 0V5.5Z" />
          <path d="M9 10h.01" />
          <path d="M15 10h.01" />
          <path d="M9.4 14.4a3.6 3.6 0 0 0 5.2 0" />
        </>
      ) : (
        <>
          <path d="M9 17V5.5l10-2V15" />
          <circle cx="6" cy="17.5" r="3" />
          <circle cx="16" cy="15.5" r="3" />
        </>
      )}
    </svg>
  );
}

/** Häkchen und Ausrufezeichen für die zwei Wege zum Einlass. */
export function Haken({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m5 12.5 4.5 4.5L19 7" />
    </svg>
  );
}

export function Achtung({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
    >
      <circle cx="12" cy="12" r="8.6" />
      <path d="M12 7.6v5.6" />
      <path d="M12 16.4h.01" />
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
