"use client";

import { Fragment, useMemo, useState } from "react";
import ProductCard from "./ProductCard";
import { AssetsFundBanner, EarnWithUsBanner } from "./Banners";
import { products as allProducts, rentFor } from "@/lib/products";
import { CATEGORIES, useShop, type SortKey } from "@/lib/shop";

const PAGE_SIZE = 12;

const SORTS: { key: SortKey; label: string }[] = [
  { key: "popular", label: "Most rented" },
  { key: "rating", label: "Top rated" },
  { key: "price-asc", label: "Price: Low to High" },
  { key: "price-desc", label: "Price: High to Low" },
];

export default function ProductsSection() {
  const { category, query, sort, setSort, setQuery, onlyAvailable, setOnlyAvailable, resetFilters, days } =
    useShop();

  const list = useMemo(() => {
    const cat = CATEGORIES.find((c) => c.key === category) ?? CATEGORIES[0];
    const q = query.trim().toLowerCase();
    const out = allProducts.filter(
      (p) => cat.match(p) && (!q || p.name.toLowerCase().includes(q)) && (!onlyAvailable || !p.out_of_stock),
    );
    const byPopularity = (a: (typeof out)[number], b: (typeof out)[number]) => b.booked_count - a.booked_count;
    switch (sort) {
      case "rating":
        return out.sort((a, b) => b.rating - a.rating || byPopularity(a, b));
      case "price-asc":
        return out.sort((a, b) => rentFor(a, days) - rentFor(b, days));
      case "price-desc":
        return out.sort((a, b) => rentFor(b, days) - rentFor(a, days));
      default:
        return out.sort(byPopularity);
    }
  }, [category, query, sort, onlyAvailable, days]);

  // Reset pagination whenever the result set changes (adjust state while rendering, no effect needed).
  const signature = `${category}|${query}|${sort}|${onlyAvailable}`;
  const [pager, setPager] = useState({ signature, visible: PAGE_SIZE });
  if (pager.signature !== signature) setPager({ signature, visible: PAGE_SIZE });
  const visible = pager.visible;

  const shown = list.slice(0, visible);
  const filtersActive = category !== "all" || query !== "" || onlyAvailable || sort !== "popular";

  return (
    <section className="relative z-[1] pb-10" id="products-section">
      <div className="container px-0">
        <div className="flex items-center justify-between border-b-2 border-neutral-200 pb-3 md:py-4">
          <h1 className="md:max-w-full font-inter text-sh4 capitalize md:text-h2">
            <span>gaming gadgets on rent</span>
          </h1>
          <p className="flex items-center justify-center gap-1 text-b6 text-neutral-300 md:text-b2" aria-live="polite">
            <span className="hidden md:inline-flex">Total items: </span>
            <span className="text-neutral-500">{list.length} items</span>
          </p>
        </div>

        <div className="sp-results">
        <div className="sp-toolbar" role="search">
          <label className="sp-search">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-4-4" />
            </svg>
            <input
              id="sp-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search gaming gadgets"
              aria-label="Search gaming gadgets"
              autoComplete="off"
            />
          </label>

          <div className="sp-chips" role="group" aria-label="Sort products">
            {SORTS.map((s) => (
              <button
                key={s.key}
                type="button"
                className="sp-chip"
                aria-pressed={sort === s.key}
                onClick={() => setSort(s.key)}
              >
                {s.label}
              </button>
            ))}
          </div>

          <label className="sp-switch">
            <input
              type="checkbox"
              checked={onlyAvailable}
              onChange={(e) => setOnlyAvailable(e.target.checked)}
            />
            <span className="sp-switch-track" aria-hidden="true"></span>
            Available only
          </label>
        </div>

        {shown.length === 0 ? (
          <div className="sp-empty">
            <p className="sp-empty-title">No gadgets match your filters</p>
            <p className="sp-empty-text">Try another category or clear your search.</p>
            <button type="button" className="sp-btn-outline" onClick={resetFilters}>
              Clear filters
            </button>
          </div>
        ) : (
          <div className="mt-3 grid grid-cols-2 gap-x-2 gap-y-5 md:mt-6 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
            {shown.map((product, i) => (
              <Fragment key={product.id}>
                <ProductCard product={product} />
                {i === 3 && (
                  <>
                    <AssetsFundBanner />
                    <div className="col-span-full"></div>
                  </>
                )}
                {i === 7 && <EarnWithUsBanner />}
              </Fragment>
            ))}
          </div>
        )}

        </div>

        {list.length > 0 && (
          <div className="mt-5 flex w-full flex-col items-center justify-center border-t border-gray-200 py-7 md:mt-10">
            <p className="pb-3 text-sm text-gray-400 md:text-base">
              Showing {shown.length} of {list.length} results
            </p>
            {visible < list.length && (
              <button
                onClick={() => setPager({ signature, visible: visible + PAGE_SIZE })}
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-4xl font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border-2 border-neutral-900 hover:bg-neutral-150 active:opacity-90 h-9 w-full bg-gray-100 p-5 text-base sm:max-w-72 md:p-6"
              >
                Show More
              </button>
            )}
            {filtersActive && (
              <button type="button" className="sp-link" onClick={resetFilters}>
                Clear all filters
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
