"use client";

import { useMemo, useState } from "react";

import { siteContact } from "@/config/contact.config";
import {
  callbackDateValidationMessage,
  callbackTimeWindows,
  currentLocalDate,
} from "@/lib/callback-preferences";

export default function CallbackRequest() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    date: "",
    time: callbackTimeWindows[0],
    message: "",
    consent: false,
  });
  const today = currentLocalDate();
  const dateError = callbackDateValidationMessage(form.date, today);
  const phoneDigits = form.phone.replace(/\D/g, "");
  const phoneError =
    form.phone && (phoneDigits.length !== 10 || phoneDigits === "0000000000")
      ? "Please enter a valid 10-digit mobile number."
      : "";
  const href = useMemo(
    () =>
      `${siteContact.whatsappHref}?text=${encodeURIComponent(
        `Hello Search My Vacation, I would like to request a callback.\nName: ${form.name}\nPhone: ${form.phone}\nPreferred date: ${form.date}\nPreferred time: ${form.time}\nTravel message: ${form.message}`,
      )}`,
    [form],
  );
  const update = (key: keyof typeof form, value: string | boolean) =>
    setForm((current) => ({ ...current, [key]: value }));

  return (
    <form
      className="rounded-[2rem] border border-[#e1ceb0] bg-white p-[clamp(2rem,5vw,3rem)] shadow-[0_14px_36px_rgba(91,55,18,.07)]"
      onSubmit={(event) => {
        event.preventDefault();
        if (form.consent && !dateError && !phoneError) window.location.assign(href);
      }}
    >
      <h2 className="font-serif text-3xl tracking-[-.035em]">Request a Callback</h2>
      <p className="mt-4 text-sm leading-7 text-[#2A211C]">
        We will do our best to call during your preferred time and will confirm where necessary. We are available Monday–Saturday, 10:00 AM–7:00 PM IST.
      </p>
      <div className="mt-7 grid gap-5 sm:grid-cols-2">
        <label className="text-sm font-semibold">Name<input required value={form.name} onChange={(event) => update("name", event.target.value)} className="mt-2 min-w-0 w-full rounded-xl border border-[#d8c4a7] px-3 py-3 font-normal" /></label>
        <label className="text-sm font-semibold">Phone number<input required type="tel" value={form.phone} aria-invalid={Boolean(phoneError)} aria-describedby={phoneError ? "contact-callback-phone-error" : undefined} onChange={(event) => update("phone", event.target.value)} className="mt-2 min-w-0 w-full rounded-xl border border-[#d8c4a7] px-3 py-3 font-normal" />{phoneError ? <span id="contact-callback-phone-error" role="alert" className="mt-2 block font-normal text-[#a1463c]">{phoneError}</span> : null}</label>
        <label className="text-sm font-semibold">Preferred date<input required type="date" min={today} value={form.date} aria-invalid={Boolean(dateError)} aria-describedby={dateError ? "contact-callback-date-error" : undefined} onChange={(event) => update("date", event.target.value)} className="mt-2 min-w-0 w-full rounded-xl border border-[#d8c4a7] px-3 py-3 font-normal" />{dateError ? <span id="contact-callback-date-error" className="mt-2 block font-normal text-[#a1463c]">{dateError}</span> : null}</label>
        <label className="text-sm font-semibold">Preferred time<select value={form.time} onChange={(event) => update("time", event.target.value)} className="mt-2 min-w-0 w-full rounded-xl border border-[#d8c4a7] px-3 py-3 font-normal">{callbackTimeWindows.map((time) => <option key={time}>{time}</option>)}</select></label>
      </div>
      <label className="mt-5 block text-sm font-semibold">Travel message <span className="font-normal text-[#2A211C]">(optional)</span><textarea value={form.message} onChange={(event) => update("message", event.target.value)} className="mt-2 min-h-28 min-w-0 w-full rounded-xl border border-[#d8c4a7] px-3 py-3 font-normal" /></label>
      <label className="mt-6 flex gap-3 text-sm leading-6 text-[#2A211C]"><input required type="checkbox" checked={form.consent} onChange={(event) => update("consent", event.target.checked)} className="mt-1 size-4" />I agree that Search My Vacation may use these details to respond to my request, as explained in the <a className="underline" href="/privacy-policy">Privacy Policy</a>.</label>
      <button className="mt-7 rounded-full bg-[#F5951C] px-6 py-3 text-sm font-bold text-[#2A211C] disabled:bg-[#cdbca6]" disabled={!form.consent || Boolean(dateError) || Boolean(phoneError)}>Continue on WhatsApp <span aria-hidden="true">→</span></button>
      <p className="mt-4 text-xs leading-5 text-[#2A211C]">This opens WhatsApp with your details prefilled. No callback request is sent until you choose to send that message.</p>
    </form>
  );
}
