// Kleinteile für die Seite: freigestelltes Seegras aus der Illustration,
// gemalte Blasen als Rahmen und ein paar schlichte Strichsymbole.

/** Ein Büschel Seegras, das über den Rand einer Textblase wächst.
 *
 *  Die Kacheln lagen vorher wie Fremdkörper auf der Illustration. Ein paar
 *  Pflanzen, die über ihre Ecken hinauswachsen, binden sie ins Bild ein:
 *  Die Blase sitzt dann im Riff, statt darauf zu liegen.
 *
 *  Die Büschel sind aus dem Hintergrundbild freigestellt (siehe `SEEGRAS`
 *  in `scripts/art/prepare_hintergrund.py`), stammen also aus derselben
 *  Hand wie alles andere. `className` bestimmt Ecke und Grösse. */
export function Seegras({
  art = 1,
  gespiegelt = false,
  className = "",
}: {
  art?: 1 | 2 | 3;
  gespiegelt?: boolean;
  className?: string;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/art/sprites/seegras_0${art}.webp`}
      alt=""
      aria-hidden="true"
      loading="lazy"
      className={`pointer-events-none absolute z-10 ${className}`}
      style={gespiegelt ? { transform: "scaleX(-1)" } : undefined}
    />
  );
}

/** Pfeil, der beim Aufklappen kippt. */
export function Pfeil({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
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

/** SoundCloud als Strichzeichnung im Stil der anderen Icons: die Wolke mit
 *  den aufsteigenden Klangbalken davor. Kein Markenlogo, aber sofort als
 *  „da gibt's Musik zu hören" lesbar. */
export function SoundCloudIcon({ className = "" }: { className?: string }) {
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
      <path d="M3 16.5v-3" />
      <path d="M6.2 16.5v-5" />
      <path d="M9.4 16.5V9" />
      <path d="M9.4 16.5h8.1a3.3 3.3 0 0 0 .6-6.55 5 5 0 0 0-8.7-2.2" />
    </svg>
  );
}

/** Eine gemalte Seifenblase als Rahmen für kleine Inhalte (Zahlen, Icons).
 *  `sprite` wählt eine der freigestellten Blasen — so bekommt jede Zahl ihre
 *  eigene, statt dass überall dieselbe Form sitzt. */
export function Bubble({
  children,
  sprite = "blase_klein_01",
  className = "",
  style,
}: {
  children: React.ReactNode;
  sprite?: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <span
      className={`relative inline-flex items-center justify-center ${className}`}
      style={style}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/art/sprites/${sprite}.webp`}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full"
      />
      <span className="relative">{children}</span>
    </span>
  );
}
