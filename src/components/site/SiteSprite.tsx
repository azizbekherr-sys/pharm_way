// Dizayndagi SVG ikonkalar va bayroqlar (<use href="#icon-..."/> uchun) — sahifaga bir marta.
export default function SiteSprite() {
  return (
    <svg style={{ display: "none" }} aria-hidden="true">
      <symbol id="icon-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 13l4 4L19 7" />
      </symbol>
      <symbol id="icon-exchange" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 7h12l-3.5-3.5M17 17H5l3.5 3.5" />
      </symbol>
      <symbol id="icon-target" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="7.5" />
        <circle cx="12" cy="12" r="2.25" />
      </symbol>
      <symbol id="icon-arrow-up-right" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 17L17 7M9 7h8v8" />
      </symbol>
      <symbol id="icon-arrow-right" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14M13 6l6 6-6 6" />
      </symbol>
      <symbol id="icon-spark" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3l2.2 6.8L21 12l-6.8 2.2L12 21l-2.2-6.8L3 12l6.8-2.2z" />
      </symbol>
      <symbol id="icon-circle" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="8" />
      </symbol>
      <symbol id="icon-plus" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 5v14M5 12h14" />
      </symbol>
      <symbol id="icon-diamond" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3l9 9-9 9-9-9z" />
      </symbol>
      <symbol id="flag-uz" viewBox="0 0 60 40">
        <rect width="60" height="40" fill="#fff" />
        <rect width="60" height="12.5" fill="#0099B5" />
        <rect y="27.5" width="60" height="12.5" fill="#1EB53A" />
        <rect y="12.5" width="60" height="1.4" fill="#CE1126" />
        <rect y="26.1" width="60" height="1.4" fill="#CE1126" />
        <circle cx="10" cy="6.3" r="4.4" fill="#fff" />
        <circle cx="11.8" cy="6.3" r="3.7" fill="#0099B5" />
        <g fill="#fff">
          <circle cx="17.5" cy="3.2" r=".95" />
          <circle cx="21.5" cy="3.2" r=".95" />
          <circle cx="25.5" cy="3.2" r=".95" />
          <circle cx="15.5" cy="6.7" r=".95" />
          <circle cx="19.5" cy="6.7" r=".95" />
          <circle cx="23.5" cy="6.7" r=".95" />
          <circle cx="27.5" cy="6.7" r=".95" />
          <circle cx="17.5" cy="10.2" r=".95" />
          <circle cx="21.5" cy="10.2" r=".95" />
          <circle cx="25.5" cy="10.2" r=".95" />
        </g>
      </symbol>
      <symbol id="flag-ru" viewBox="0 0 60 40">
        <rect width="60" height="40" fill="#fff" />
        <rect y="13.33" width="60" height="13.34" fill="#0039A6" />
        <rect y="26.67" width="60" height="13.33" fill="#D52B1E" />
      </symbol>
      <symbol id="flag-en" viewBox="0 0 60 40">
        <rect width="60" height="40" fill="#012169" />
        <path d="M0 0L60 40M60 0L0 40" stroke="#fff" strokeWidth="8" />
        <path d="M0 0L60 40M60 0L0 40" stroke="#C8102E" strokeWidth="2.6" />
        <path d="M30 0V40M0 20H60" stroke="#fff" strokeWidth="13" />
        <path d="M30 0V40M0 20H60" stroke="#C8102E" strokeWidth="8" />
      </symbol>
      <symbol id="icon-chevron-down" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 9l6 6 6-6" />
      </symbol>
    </svg>
  );
}
