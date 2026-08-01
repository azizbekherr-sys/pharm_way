"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import ConsentBanner from "./ConsentBanner";

// NEXT_PUBLIC_* are inlined at build time; nothing here loads unless configured.
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;
const YM_ID = process.env.NEXT_PUBLIC_YANDEX_METRICA_ID;
const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;

type Consent = "granted" | "denied" | null;

export default function Analytics() {
  const [consent, setConsent] = useState<Consent>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("pw_consent");
      if (stored === "granted" || stored === "denied") setConsent(stored);
    } catch {
      // ignore
    }
    const handler = (e: Event) => setConsent((e as CustomEvent<Consent>).detail);
    window.addEventListener("pw-consent-change", handler);
    return () => window.removeEventListener("pw-consent-change", handler);
  }, []);

  const anyConfigured = Boolean(GTM_ID || YM_ID || CLARITY_ID);
  if (!anyConfigured) return null;

  const granted = consent === "granted";

  return (
    <>
      {/* Google Tag Manager with Consent Mode v2 (default: denied until accepted). */}
      {GTM_ID && (
        <>
          <Script id="gtm" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
gtag('consent','default',{ad_storage:'denied',analytics_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',wait_for_update:500});
try{if(localStorage.getItem('pw_consent')==='granted'){gtag('consent','update',{ad_storage:'granted',analytics_storage:'granted',ad_user_data:'granted',ad_personalization:'granted'});}}catch(e){}
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`}
          </Script>
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
              title="gtm"
            />
          </noscript>
        </>
      )}

      {/* Yandex Metrica — only after explicit consent. */}
      {granted && YM_ID && (
        <Script id="yandex-metrica" strategy="afterInteractive">
          {`(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();for(var j=0;j<document.scripts.length;j++){if(document.scripts[j].src===r){return;}}k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})(window,document,'script','https://mc.yandex.ru/metrika/tag.js','ym');
ym(${YM_ID},'init',{clickmap:true,trackLinks:true,accurateTrackBounce:true});`}
        </Script>
      )}

      {/* Microsoft Clarity — only after explicit consent. */}
      {granted && CLARITY_ID && (
        <Script id="ms-clarity" strategy="afterInteractive">
          {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${CLARITY_ID}");`}
        </Script>
      )}

      {consent === null && <ConsentBanner />}
    </>
  );
}
