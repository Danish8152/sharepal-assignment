import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Gaming Gadgets on Rent in Bangalore | SharePal",
  description:
    "Rent PS5, Xbox, VR and more gaming gadgets in Bangalore with free delivery and pickup.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <head>
        {/* Served as static files so the stylesheet is used byte-for-byte as shipped. */}
        <link rel="stylesheet" href="/css/fonts.css" />
        <link rel="stylesheet" href="/css/site.css" />
        <link rel="stylesheet" href="/css/swiper.css" />
        <link rel="stylesheet" href="/css/enhancements.css" />
      </head>
      <body className="font-sans-body antialiased">{children}</body>
    </html>
  );
}
