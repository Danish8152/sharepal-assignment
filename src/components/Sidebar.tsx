"use client";

/* eslint-disable @next/next/no-img-element */
import { CATEGORIES, useShop, type CategoryKey } from "@/lib/shop";
import { products } from "@/lib/products";

const IMAGES: Record<CategoryKey, string> = {
  all: "https://images.sharepal.in/misc/hard-coded/sharepal/Product=All%20Products.webp",
  gta: "https://images.sharepal.in/category-icons/gta-vi.webp",
  ps5: "https://images.sharepal.in/sub-category-card/ps5-console-on-rent-sharepal.webp",
  xbox: "https://images.sharepal.in/sub-category-card/xbox-console-on-rent-sharepal.webp",
  vr: "https://images.sharepal.in/sub-category-card/vr-on-rent-sharepal.webp",
  racing:
    "https://images.sharepal.in/categories/gaming-consoles/gaming-accessories/logitech-G29-driving-force-racing-wheel/logitech-g29-racing-wheel-on-rent-sharepal-1.webp",
  bigscreen:
    "https://images.sharepal.in/categories/gaming-consoles/big-screen-gaming/products/ps5-with-2-controllers-with-projector-on-rent+.webp",
};

export default function Sidebar() {
  const { category, setCategory } = useShop();

  return (
    <aside className="block w-[80px] shrink-0 md:w-full" aria-label="Gaming categories">
      <div className="sticky h-full max-h-[calc(100dvh-160px)] overflow-y-auto rounded-lg bg-gray-100 p-1 shadow-[0_2px_15px_rgba(0,0,0,0.06)] transition-all duration-300 scrollbar-none max-md:py-3 md:h-full md:max-h-[calc(100dvh-10rem)] md:rounded-xl md:p-3 top-[140px] md:top-[140px]">
        <div className="flex flex-col gap-2 md:gap-3 lg:gap-4">
          {CATEGORIES.map((c) => {
            const active = category === c.key;
            const count = products.filter(c.match).length;
            return (
              <button
                key={c.key}
                type="button"
                onClick={() => setCategory(c.key)}
                aria-pressed={active}
                title={`${c.label} (${count})`}
                className="sp-cat group flex flex-col items-center justify-center gap-0.5 transition-all duration-300 md:gap-1"
              >
                <div
                  className={`relative flex aspect-square w-12 items-center justify-center overflow-hidden rounded-lg p-1 transition-all duration-300 group-hover:bg-gray-100 md:w-14 md:rounded-xl md:p-1.5 lg:w-16 ${
                    active ? "border-2 border-primary-500 bg-gray-100" : "border bg-gray-50"
                  }`}
                >
                  <img
                    alt=""
                    width="80"
                    height="80"
                    src={IMAGES[c.key]}
                    className={`h-full w-full object-contain transition-transform duration-300 group-hover:scale-110 ${
                      active ? "scale-105" : "scale-100"
                    }`}
                  />
                </div>
                <span
                  className={`text-center text-[10px] font-semibold leading-tight md:text-xs md:font-bold lg:text-sh5 ${
                    active
                      ? "text-primary-500"
                      : "line-clamp-2 max-w-[50px] md:max-w-[60px] lg:max-w-[80px] text-neutral-900"
                  }`}
                >
                  {c.label}
                  {active && <div className="mx-auto mt-0.5 h-[2px] w-4 rounded-full bg-primary-500 md:w-6 lg:w-8"></div>}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
