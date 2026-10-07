"use client";

import { useState } from "react";

const faqs = [
  {
    "q": "How can I rent from SharePal?",
    "a": "Renting from SharePal is quick and easy. You can browse the products, select your dates and add them to cart and checkout. You can choose to pay online or upon delivery."
  },
  {
    "q": "If I rent multiple products, do I need to extend the rental duration for all or partial extension is possible?",
    "a": "No, partial extension is not possible, all the products that are rented in that particular order have to be extended."
  },
  {
    "q": "When does the rental start?",
    "a": "The rental starts from the following day of the delivery day and ends a day prior to the return date. So for example, if you select the delivery date as 5th June and return date as 8th June. The rental is charged for 2 days."
  },
  {
    "q": "What will be the condition of the products at the time of delivery?",
    "a": "At SharePal.in, we make sure that the products you receive are in great condition upon delivery. We thoroughly inspect and clean each item before sending it your way. If you ever face any issues, our friendly customer support team is here to help. Your satisfaction matters to us the most!"
  },
  {
    "q": "Why is verification required?",
    "a": "Profile verification is a crucial step at SharePal.in to ensure the safety and security of our platform and users. It helps us confirm the identity of our users, prevent fraud, and maintain a secure environment for everyone involved."
  }
];

export default function Faq() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section className="container !my-10 rounded-3xl bg-gray-100 p-4 py-10">
      <div className="flex h-full w-full flex-col items-start gap-2 p-4 !pt-0 md:p-6">
        <h3 className="flex flex-col flex-wrap items-start gap-0.5 py-2 text-h4 text-neutral-900 md:flex-row md:items-center md:gap-2 md:text-h2">
          Frequently Asked Questions (FAQs)
        </h3>
        <div className="w-full" data-orientation="vertical">
          {faqs.map((f, i) => {
            const state = open === i ? "open" : "closed";
            return (
              <div
                key={f.q}
                data-state={state}
                data-orientation="vertical"
                className="border-b rounded-xl border-none bg-gray-100 transition-colors duration-300 hover:bg-gray-150"
              >
                <h3 data-orientation="vertical" data-state={state} className="flex">
                  <button
                    type="button"
                    aria-expanded={open === i}
                    data-state={state}
                    data-orientation="vertical"
                    onClick={() => setOpen(open === i ? null : i)}
                    className="flex flex-1 items-center justify-between py-4 text-sm font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180 px-4 text-left text-sh4 md:text-sh3"
                  >
                    {f.q}
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200"><path d="m6 9 6 6 6-6" /></svg>
                  </button>
                </h3>
                {open === i && (
                  <div
                    data-state="open"
                    role="region"
                    data-orientation="vertical"
                    className="overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
                  >
                    <div className="pt-0 px-4 pb-4 text-xs text-gray-700 md:text-sm">{f.a}</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-4xl ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-neutral-150 text-primary-900 hover:bg-neutral-200 active:opacity-90 h-11 px-6 py-3 text-sm w-full font-semibold md:text-base">View more FAQ&apos;s</button>
      </div>
    </section>
  );
}
