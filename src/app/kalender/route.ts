import { FEST } from "@/lib/fest";

// Liefert den Fest-Termin als .ics — damit ihn Gäste mit einem Tippen in
// ihren Kalender übernehmen können (iOS, Android und Desktop verstehen das
// Format alle). Statisch, weil sich der Termin nicht ändert.
export const dynamic = "force-static";

/** Zeilen über 75 Oktett müssen laut RFC 5545 umbrochen werden — sonst
 *  verschlucken manche Kalender den Rest der Zeile. */
function falten(zeile: string): string {
  const teile: string[] = [];
  let rest = zeile;
  while (rest.length > 73) {
    teile.push(rest.slice(0, 73));
    rest = " " + rest.slice(73);
  }
  teile.push(rest);
  return teile.join("\r\n");
}

function escape(text: string): string {
  return text.replace(/([,;\\])/g, "\\$1").replace(/\n/g, "\\n");
}

export async function GET() {
  const ort = `${FEST.ort}, ${FEST.adresse}`;

  const zeilen = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Hausfest Via 1//DE",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    // Feste UID und DTSTAMP: so erkennt der Kalender einen erneuten Import
    // als denselben Termin und legt keinen zweiten an.
    "UID:hausfest-via1-2026@hausfest-via.al-daellen.ch",
    `DTSTAMP:${FEST.startUtc}`,
    `DTSTART:${FEST.startUtc}`,
    `DTEND:${FEST.endeUtc}`,
    `SUMMARY:${escape(FEST.titel)}`,
    `LOCATION:${escape(ort)}`,
    `DESCRIPTION:${escape(
      "Programm, Tickets und Infos: https://hausfest-via.al-daellen.ch",
    )}`,
    "URL:https://hausfest-via.al-daellen.ch",
    "END:VEVENT",
    "END:VCALENDAR",
  ];

  return new Response(zeilen.map(falten).join("\r\n") + "\r\n", {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'attachment; filename="hausfest-via1.ics"',
    },
  });
}
