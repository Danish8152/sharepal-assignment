"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState } from "react";
import { formatINR, products, rentFor } from "@/lib/products";
import { useShop } from "@/lib/shop";
import { formatShort, toISO } from "@/lib/dates";

function useEscape(open: boolean, onClose: () => void) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);
}

/* ---------------------------------------------------------------- Cart */

function CartDrawer() {
  const { cartOpen, closeCart, cart, setQty, removeFromCart, days, openDateModal, dates } = useShop();
  useEscape(cartOpen, closeCart);
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (cartOpen) closeRef.current?.focus();
  }, [cartOpen]);

  const lines = cart
    .map((l) => ({ ...l, product: products.find((p) => p.id === l.id)! }))
    .filter((l) => l.product);
  const total = lines.reduce((sum, l) => sum + rentFor(l.product, days) * l.qty, 0);
  const unavailable = lines.filter((l) => l.product.out_of_stock);

  return (
    <div className={`sp-layer ${cartOpen ? "is-open" : ""}`} aria-hidden={!cartOpen}>
      <div className="sp-backdrop" onClick={closeCart} />
      <aside className="sp-drawer" role="dialog" aria-modal="true" aria-label="Your cart">
        <header className="sp-drawer-head">
          <h2>Your cart</h2>
          <button ref={closeRef} type="button" className="sp-icon-btn" onClick={closeCart} aria-label="Close cart">
            ✕
          </button>
        </header>

        <button type="button" className="sp-dates-chip" onClick={openDateModal}>
          <span>Rent for {days} {days === 1 ? "day" : "days"}</span>
          <strong>
            {formatShort(dates.delivery)} → {formatShort(dates.pickup)}
          </strong>
          <span className="sp-link-inline">Change</span>
        </button>

        {lines.length === 0 ? (
          <div className="sp-drawer-empty">
            <p className="sp-empty-title">Your cart is empty</p>
            <p className="sp-empty-text">Add a console or VR headset and it will show up here.</p>
            <button type="button" className="sp-btn-outline" onClick={closeCart}>
              Browse gadgets
            </button>
          </div>
        ) : (
          <>
            <ul className="sp-lines">
              {lines.map(({ product, qty }) => (
                <li key={product.id} className="sp-line">
                  <img src={product.image} alt="" width="72" height="72" />
                  <div className="sp-line-body">
                    <p className="sp-line-name">{product.name}</p>
                    {product.out_of_stock ? (
                      <p className="sp-line-warn">Unavailable for these dates</p>
                    ) : (
                      <p className="sp-line-price">{formatINR(rentFor(product, days) * qty)}</p>
                    )}
                    <div className="sp-stepper" role="group" aria-label={`Quantity of ${product.name}`}>
                      <button type="button" onClick={() => setQty(product.id, qty - 1)} aria-label="Decrease quantity">
                        −
                      </button>
                      <span aria-live="polite">{qty}</span>
                      <button type="button" onClick={() => setQty(product.id, qty + 1)} aria-label="Increase quantity">
                        +
                      </button>
                    </div>
                  </div>
                  <button type="button" className="sp-remove" onClick={() => removeFromCart(product.id)}>
                    Remove
                  </button>
                </li>
              ))}
            </ul>
            <footer className="sp-drawer-foot">
              <div className="sp-total">
                <span>Total ({days} {days === 1 ? "day" : "days"}, incl. of GST)</span>
                <strong>{formatINR(total)}</strong>
              </div>
              <p className="sp-note">Free delivery &amp; pickup. Pay online or on delivery.</p>
              <button type="button" className="sp-btn-primary" disabled={unavailable.length > 0 || total === 0}>
                {unavailable.length > 0 ? "Remove unavailable items" : "Proceed to checkout"}
              </button>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}

/* ---------------------------------------------------------- Date picker */

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function Month({
  year,
  month,
  start,
  end,
  today,
  onPick,
}: {
  year: number;
  month: number;
  start: string | null;
  end: string | null;
  today: string;
  onPick: (iso: string) => void;
}) {
  const first = new Date(year, month, 1).getDay();
  const count = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [...Array(first).fill(null), ...Array.from({ length: count }, (_, i) => i + 1)];

  return (
    <div className="sp-month">
      <p className="sp-month-title">
        {MONTHS[month]} {year}
      </p>
      <div className="sp-grid" role="grid">
        {WEEKDAYS.map((d) => (
          <span key={d} className="sp-wd">
            {d}
          </span>
        ))}
        {cells.map((d, i) => {
          if (d === null) return <span key={`b${i}`} />;
          const iso = toISO(new Date(year, month, d));
          const disabled = iso < today;
          const isStart = iso === start;
          const isEnd = iso === end;
          const inRange = start && end && iso > start && iso < end;
          return (
            <button
              key={iso}
              type="button"
              disabled={disabled}
              onClick={() => onPick(iso)}
              aria-pressed={isStart || isEnd}
              aria-label={`${d} ${MONTHS[month]} ${year}`}
              className={`sp-day ${isStart || isEnd ? "is-edge" : ""} ${inRange ? "is-range" : ""} ${isStart && end ? "is-first" : ""} ${isEnd ? "is-last" : ""}`}
            >
              {d}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function DateModal() {
  const { dateModalOpen, closeDateModal, dates, setDates } = useShop();
  useEscape(dateModalOpen, closeDateModal);

  // Empty until first opened so server and client render the same markup.
  const [today, setToday] = useState("");
  const [start, setStart] = useState<string | null>(dates.delivery);
  const [end, setEnd] = useState<string | null>(dates.pickup);
  const [view, setView] = useState(() => {
    const [y, m] = dates.delivery.split("-").map(Number);
    return { y, m: m - 1 };
  });

  // Re-seed the draft from the saved dates every time the modal opens.
  const [wasOpen, setWasOpen] = useState(false);
  if (dateModalOpen !== wasOpen) {
    setWasOpen(dateModalOpen);
    if (dateModalOpen) {
      setToday(toISO(new Date()));
      setStart(dates.delivery);
      setEnd(dates.pickup);
      const [y, m] = dates.delivery.split("-").map(Number);
      setView({ y, m: m - 1 });
    }
  }

  const pick = (iso: string) => {
    if (!start || end) {
      setStart(iso);
      setEnd(null);
    } else if (iso <= start) {
      setStart(iso);
    } else {
      setEnd(iso);
    }
  };

  const diff =
    start && end ? Math.round((new Date(end + "T00:00:00").getTime() - new Date(start + "T00:00:00").getTime()) / 86_400_000) : 0;
  const chargeable = Math.max(0, diff - 1);
  const valid = !!start && !!end && diff >= 2;

  const shift = (n: number) =>
    setView((v) => {
      const d = new Date(v.y, v.m + n, 1);
      return { y: d.getFullYear(), m: d.getMonth() };
    });
  const next = new Date(view.y, view.m + 1, 1);

  return (
    <div className={`sp-layer ${dateModalOpen ? "is-open" : ""}`} aria-hidden={!dateModalOpen}>
      <div className="sp-backdrop" onClick={closeDateModal} />
      <div className="sp-modal" role="dialog" aria-modal="true" aria-labelledby="sp-date-title">
        <header className="sp-modal-head">
          <h2 id="sp-date-title">Select your Dates</h2>
          <button type="button" className="sp-icon-btn" onClick={closeDateModal} aria-label="Close">
            ✕
          </button>
        </header>

        <div className="sp-modal-body">
          <div className="sp-modal-side">
            <div className="sp-fields">
              <div>
                <span className="sp-label">Delivery Date</span>
                <div className={`sp-field ${start ? "has-value" : ""}`}>{start ? formatShort(start) : "Select delivery date"}</div>
              </div>
              <div>
                <span className="sp-label">Pickup Date</span>
                <div className={`sp-field ${end ? "has-value" : ""}`}>{end ? formatShort(end) : "Select pickup date"}</div>
              </div>
            </div>
            <p className="sp-info">
              <strong>Same-day delivery</strong> between 5PM and 11PM. For future dates, you can select a specific time slot at
              checkout. We pickup between <strong>9AM to 1PM</strong>.
            </p>
            <div className="sp-period">
              <p className="sp-label">Your Rental Period:</p>
              <p className="sp-period-days">
                <strong>{String(chargeable).padStart(2, "0")}</strong> {chargeable === 1 ? "Day" : "Days"}
              </p>
              {end && !valid && <p className="sp-line-warn">Pick a pickup date at least 2 days after delivery.</p>}
            </div>
            <button
              type="button"
              className="sp-btn-primary"
              disabled={!valid}
              onClick={() => {
                setDates({ delivery: start!, pickup: end! });
                closeDateModal();
              }}
            >
              Continue
            </button>
          </div>

          <div className="sp-cal">
            <button type="button" className="sp-nav sp-nav-prev" onClick={() => shift(-1)} aria-label="Previous month">
              ‹
            </button>
            <button type="button" className="sp-nav sp-nav-next" onClick={() => shift(1)} aria-label="Next month">
              ›
            </button>
            <Month year={view.y} month={view.m} start={start} end={end} today={today} onPick={pick} />
            <Month year={next.getFullYear()} month={next.getMonth()} start={start} end={end} today={today} onPick={pick} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* --------------------------------------------------------------- Toast */

function Toast() {
  const { toast, openCart } = useShop();
  return (
    <div className={`sp-toast ${toast ? "is-open" : ""}`} role="status" aria-live="polite">
      {toast && (
        <>
          <span>{toast.message}</span>
          {toast.action === "cart" && (
            <button type="button" onClick={openCart}>
              View cart
            </button>
          )}
        </>
      )}
    </div>
  );
}

export default function ShopOverlays() {
  return (
    <>
      <CartDrawer />
      <DateModal />
      <Toast />
    </>
  );
}
