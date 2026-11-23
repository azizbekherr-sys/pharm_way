/**
 * Bo'limlar orasida o'tganda darhol ko'rinadi (menyu joyida qoladi), server
 * javobini kutib, bosilgan tugma "hech narsa bo'lmayotgandek" turib qolmaydi.
 */
export default function AdminLoading() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center" role="status" aria-live="polite">
      <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-slate-200 border-t-primary-600" />
      <span className="sr-only">Yuklanmoqda…</span>
    </div>
  );
}
