export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="mb-3 text-xs uppercase tracking-[0.3em] text-neutral-400">
        Save the date
      </p>
      <h1 className="text-5xl font-bold tracking-tight sm:text-7xl">
        Hausfest
      </h1>
      <p className="mt-6 max-w-md text-balance text-lg text-neutral-300">
        Bald findest du hier alles Wichtige zum Fest — Programm,
        Anfahrt, Infos.
      </p>

      <div className="mt-10 rounded-2xl border border-neutral-700 bg-neutral-900/50 px-5 py-4 text-sm text-neutral-400">
        <strong className="block text-neutral-200">Als App installieren</strong>
        <p className="mt-1">
          iPhone: Teilen-Symbol → „Zum Home-Bildschirm"
          <br />
          Android: Menü → „App installieren"
        </p>
      </div>
    </main>
  );
}
