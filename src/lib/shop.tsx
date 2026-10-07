"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { products, type Product } from "@/lib/products";

export type SortKey = "popular" | "price-asc" | "price-desc" | "rating";
export type CategoryKey = "all" | "gta" | "ps5" | "xbox" | "vr" | "racing" | "bigscreen";

export const CATEGORIES: { key: CategoryKey; label: string; match: (p: Product) => boolean }[] = [
  { key: "all", label: "All", match: () => true },
  { key: "gta", label: "GTA VI", match: (p) => /gta/i.test(p.name) },
  { key: "ps5", label: "PS5 Console", match: (p) => /ps5/i.test(p.name) },
  { key: "xbox", label: "Xbox Console", match: (p) => /xbox/i.test(p.name) },
  { key: "vr", label: "VR", match: (p) => /\bvr\b|oculus|quest/i.test(p.name) },
  { key: "racing", label: "Racing Wheel", match: (p) => /wheel|racing/i.test(p.name) },
  { key: "bigscreen", label: "Big Screen Gaming", match: (p) => /projector|big screen/i.test(p.name) },
];

export type CartLine = { id: number; qty: number };

type Dates = { delivery: string; pickup: string }; // ISO yyyy-mm-dd

const DEFAULT_DATES: Dates = { delivery: "2026-10-08", pickup: "2026-10-17" };
const STORAGE_KEY = "sharepal-shop-v1";

const DAY = 86_400_000;
const toTime = (iso: string) => new Date(iso + "T00:00:00").getTime();

/** Same rule the live site uses: rental starts the day after delivery and ends the day before pickup. */
export function rentalDays(d: Dates) {
  return Math.max(1, Math.round((toTime(d.pickup) - toTime(d.delivery)) / DAY) - 1);
}

type Shop = {
  dates: Dates;
  days: number;
  setDates: (d: Dates) => void;
  dateModalOpen: boolean;
  openDateModal: () => void;
  closeDateModal: () => void;

  cart: CartLine[];
  cartCount: number;
  cartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (p: Product) => void;
  setQty: (id: number, qty: number) => void;
  removeFromCart: (id: number) => void;

  wishlist: number[];
  toggleWishlist: (id: number) => void;

  category: CategoryKey;
  setCategory: (c: CategoryKey) => void;
  sort: SortKey;
  setSort: (s: SortKey) => void;
  query: string;
  setQuery: (q: string) => void;
  onlyAvailable: boolean;
  setOnlyAvailable: (v: boolean) => void;
  resetFilters: () => void;

  toast: { message: string; action?: "cart" } | null;
  showToast: (message: string, action?: "cart") => void;
};

const ShopContext = createContext<Shop | null>(null);

export function useShop() {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error("useShop must be used inside <ShopProvider>");
  return ctx;
}

export function ShopProvider({ children }: { children: ReactNode }) {
  const [dates, setDatesState] = useState<Dates>(DEFAULT_DATES);
  const [dateModalOpen, setDateModalOpen] = useState(false);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [category, setCategory] = useState<CategoryKey>("all");
  const [sort, setSort] = useState<SortKey>("popular");
  const [query, setQuery] = useState("");
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [toast, setToast] = useState<Shop["toast"]>(null);
  const [hydrated, setHydrated] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Restore saved state after mount so server and first client render match (localStorage is an external system).
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        const valid = new Set(products.map((p) => p.id));
        if (saved.dates?.delivery && saved.dates?.pickup) setDatesState(saved.dates);
        if (Array.isArray(saved.cart))
          setCart(saved.cart.filter((l: CartLine) => valid.has(l.id) && l.qty > 0));
        if (Array.isArray(saved.wishlist))
          setWishlist(saved.wishlist.filter((id: number) => valid.has(id)));
      }
    } catch {
      /* storage unavailable or corrupt: start fresh */
    }
    setHydrated(true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ dates, cart, wishlist }));
    } catch {
      /* ignore quota / private mode */
    }
  }, [hydrated, dates, cart, wishlist]);

  const showToast = useCallback((message: string, action?: "cart") => {
    clearTimeout(toastTimer.current);
    setToast({ message, action });
    toastTimer.current = setTimeout(() => setToast(null), 3500);
  }, []);

  const addToCart = useCallback(
    (p: Product) => {
      setCart((c) => {
        const line = c.find((l) => l.id === p.id);
        return line ? c.map((l) => (l.id === p.id ? { ...l, qty: l.qty + 1 } : l)) : [...c, { id: p.id, qty: 1 }];
      });
      showToast(`${p.name} added to cart`, "cart");
    },
    [showToast],
  );

  const setQty = useCallback((id: number, qty: number) => {
    setCart((c) => (qty <= 0 ? c.filter((l) => l.id !== id) : c.map((l) => (l.id === id ? { ...l, qty } : l))));
  }, []);

  const removeFromCart = useCallback((id: number) => setCart((c) => c.filter((l) => l.id !== id)), []);

  const toggleWishlist = useCallback((id: number) => {
    setWishlist((w) => (w.includes(id) ? w.filter((x) => x !== id) : [...w, id]));
  }, []);

  const resetFilters = useCallback(() => {
    setCategory("all");
    setQuery("");
    setOnlyAvailable(false);
    setSort("popular");
  }, []);

  const value = useMemo<Shop>(
    () => ({
      dates,
      days: rentalDays(dates),
      setDates: setDatesState,
      dateModalOpen,
      openDateModal: () => setDateModalOpen(true),
      closeDateModal: () => setDateModalOpen(false),
      cart,
      cartCount: cart.reduce((n, l) => n + l.qty, 0),
      cartOpen,
      openCart: () => {
        setToast(null);
        setCartOpen(true);
      },
      closeCart: () => setCartOpen(false),
      addToCart,
      setQty,
      removeFromCart,
      wishlist,
      toggleWishlist,
      category,
      setCategory,
      sort,
      setSort,
      query,
      setQuery,
      onlyAvailable,
      setOnlyAvailable,
      resetFilters,
      toast,
      showToast,
    }),
    [dates, dateModalOpen, cart, cartOpen, addToCart, setQty, removeFromCart, wishlist, toggleWishlist, category, sort, query, onlyAvailable, resetFilters, toast, showToast],
  );

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}
