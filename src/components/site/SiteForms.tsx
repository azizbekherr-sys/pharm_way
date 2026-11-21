"use client";

import { useRef, useState, type FormEvent } from "react";

type UiText = { required: string; format: string; check: string; failed: string };

export type ContactFormLabels = {
  section: string;
  name: string;
  phone: string;
  email: string;
  company: string;
  service: string;
  choose: string;
  services: string[];
  message: string;
  submit: string;
  note: string;
  successTitle: string;
  successText: string;
  again: string;
};

export type PartnerFormLabels = {
  company: string;
  contact: string;
  phone: string;
  message: string;
  submit: string;
  successTitle: string;
  successText: string;
  again: string;
};

function Arrow() {
  return (
    <span className="round">
      <svg className="icn" aria-hidden="true" focusable="false">
        <use href="#icon-arrow-right" />
      </svg>
    </span>
  );
}

/** Dizayndagi validatsiya: bo'sh / noto'g'ri formatdagi maydonlarga xato matni. */
function validate(form: HTMLFormElement, ui: UiText): Record<string, string> {
  const errors: Record<string, string> = {};
  form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>("input,select,textarea").forEach((el) => {
    if (el.checkValidity()) return;
    errors[el.name] = el.validity.valueMissing ? ui.required : el.validity.typeMismatch ? ui.format : ui.check;
  });
  return errors;
}

function useSubmit(ui: UiText, build: (fd: FormData) => Record<string, string>) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [failed, setFailed] = useState(false);
  const successRef = useRef<HTMLDivElement>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const errs = validate(form, ui);
    setErrors(errs);
    setFailed(false);
    const first = Object.keys(errs)[0];
    if (first) {
      form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(build(new FormData(form))),
      });
      if (!res.ok) throw new Error(String(res.status));
      form.reset();
      setDone(true);
      requestAnimationFrame(() => successRef.current?.focus({ preventScroll: true }));
    } catch {
      setFailed(true);
    } finally {
      setLoading(false);
    }
  }

  return { errors, loading, done, setDone, failed, successRef, onSubmit };
}

function Field({
  id,
  label,
  error,
  full,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  full?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={`field${full ? " full" : ""}${error ? " has-error" : ""}`}>
      <label htmlFor={id}>{label}</label>
      {children}
      <span className="field-error">{error ?? ""}</span>
    </div>
  );
}

function Success({
  refEl,
  title,
  text,
  again,
  onAgain,
}: {
  refEl: React.RefObject<HTMLDivElement>;
  title: string;
  text: string;
  again: string;
  onAgain: () => void;
}) {
  return (
    <div className="card form-success show" ref={refEl} tabIndex={-1}>
      <div className="form-success-icon">
        <svg className="icn" aria-hidden="true" focusable="false">
          <use href="#icon-check" />
        </svg>
      </div>
      <h3>{title}</h3>
      <p>{text}</p>
      <button className="button secondary form-reset-btn" type="button" onClick={onAgain}>
        <span>{again}</span>
      </button>
    </div>
  );
}

/** Aloqa sahifasidagi "Xabar qoldiring" formasi → /api/contact (murojaatlar + Telegram). */
export function ContactForm({ labels, ui }: { labels: ContactFormLabels; ui: UiText }) {
  const s = useSubmit(ui, (fd) => ({
    name: String(fd.get("name") ?? "").trim(),
    phone: String(fd.get("phone") ?? "").trim(),
    email: String(fd.get("email") ?? "").trim(),
    company: String(fd.get("company") ?? "").trim(),
    serviceType: String(fd.get("service") ?? "").trim(),
    message: String(fd.get("message") ?? "").trim(),
  }));

  if (s.done) {
    return (
      <Success
        refEl={s.successRef}
        title={labels.successTitle}
        text={labels.successText}
        again={labels.again}
        onAgain={() => s.setDone(false)}
      />
    );
  }

  return (
    <form className="card form-card js-form" id="assessment-form" noValidate onSubmit={s.onSubmit}>
      <div className="form-section">
        <div className="eyebrow">{labels.section}</div>
        <div className="form-grid">
          <Field id="name" label={labels.name} error={s.errors.name}>
            <input id="name" name="name" required autoComplete="name" />
          </Field>
          <Field id="phone" label={labels.phone} error={s.errors.phone}>
            <input id="phone" name="phone" type="tel" required autoComplete="tel" />
          </Field>
          <Field id="email" label={labels.email} error={s.errors.email}>
            <input id="email" name="email" type="email" autoComplete="email" />
          </Field>
          <Field id="company" label={labels.company} error={s.errors.company}>
            <input id="company" name="company" autoComplete="organization" />
          </Field>
          <Field id="service" label={labels.service} full>
            <select id="service" name="service" defaultValue="">
              <option value="">{labels.choose}</option>
              {labels.services.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </Field>
          <Field id="message" label={labels.message} full>
            <textarea id="message" name="message" />
          </Field>
        </div>
        <div className="btns u-mt-22">
          <button className={`button u-border-0${s.loading ? " is-loading" : ""}`} type="submit" disabled={s.loading}>
            <span>{labels.submit}</span>
            <Arrow />
            <span className="spinner" aria-hidden="true" />
          </button>
        </div>
        {s.failed && (
          <p className="small u-mt-18" role="alert" style={{ color: "#e04b4b" }}>
            {ui.failed}
          </p>
        )}
        <p className="small u-mt-18">{labels.note}</p>
      </div>
    </form>
  );
}

/** Hamkorlar sahifasidagi ariza → /api/contact ("Hamkorlik" turi bilan). */
export function PartnerForm({ labels, ui, serviceType }: { labels: PartnerFormLabels; ui: UiText; serviceType: string }) {
  const s = useSubmit(ui, (fd) => ({
    name: String(fd.get("p-contact") ?? "").trim(),
    company: String(fd.get("p-company") ?? "").trim(),
    phone: String(fd.get("p-phone") ?? "").trim(),
    serviceType,
    message: String(fd.get("p-message") ?? "").trim(),
  }));

  if (s.done) {
    return (
      <Success
        refEl={s.successRef}
        title={labels.successTitle}
        text={labels.successText}
        again={labels.again}
        onAgain={() => s.setDone(false)}
      />
    );
  }

  return (
    <form className="card form-card js-form" noValidate onSubmit={s.onSubmit}>
      <div className="form-grid">
        <Field id="p-company" label={labels.company} error={s.errors["p-company"]}>
          <input id="p-company" name="p-company" required autoComplete="organization" />
        </Field>
        <Field id="p-contact" label={labels.contact} error={s.errors["p-contact"]}>
          <input id="p-contact" name="p-contact" required autoComplete="name" />
        </Field>
        <Field id="p-phone" label={labels.phone} error={s.errors["p-phone"]} full>
          <input id="p-phone" name="p-phone" type="tel" required autoComplete="tel" />
        </Field>
        <Field id="p-message" label={labels.message} full>
          <textarea id="p-message" name="p-message" />
        </Field>
      </div>
      <div className="btns u-mt-22">
        <button className={`button u-border-0${s.loading ? " is-loading" : ""}`} type="submit" disabled={s.loading}>
          <span>{labels.submit}</span>
          <Arrow />
          <span className="spinner" aria-hidden="true" />
        </button>
      </div>
      {s.failed && (
        <p className="small u-mt-18" role="alert" style={{ color: "#e04b4b" }}>
          {ui.failed}
        </p>
      )}
    </form>
  );
}
