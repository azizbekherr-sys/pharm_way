"use client";

import { useState } from "react";
import CertificatesExplorer from "./CertificatesExplorer";
import CertificateRequestForm from "./CertificateRequestForm";

export default function CertificatesSection() {
  const [requested, setRequested] = useState<string | null>(null);

  function handleRequest(title: string) {
    setRequested(title);
    document.getElementById("certificate-request")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <>
      <CertificatesExplorer onRequest={handleRequest} />
      <CertificateRequestForm presetCertificate={requested} />
    </>
  );
}
