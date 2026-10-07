import raw from "@/data/products.json";

export type Product = {
  id: number;
  name: string;
  image: string;
  rating: number;
  booked_count: number;
  tag: string;
  per_day_rent: number;
  out_of_stock: boolean;
};

export const RENT_DAYS = 8;

export const products: Product[] = raw.products;

export function rentFor(product: Product, days = RENT_DAYS) {
  return Math.round(product.per_day_rent * days);
}

export function formatINR(amount: number) {
  return "₹" + amount.toLocaleString("en-IN");
}
