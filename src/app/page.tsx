import Header from "@/components/Header";
import TopTabs from "@/components/TopTabs";
import Sidebar from "@/components/Sidebar";
import Hero from "@/components/Hero";
import ProductsSection from "@/components/ProductsSection";
import Faq from "@/components/Faq";
import Breadcrumb from "@/components/Breadcrumb";
import Reviews from "@/components/Reviews";
import ChatLink from "@/components/ChatLink";
import Footer from "@/components/Footer";
import { ShopProvider } from "@/lib/shop";
import ShopOverlays from "@/components/ShopOverlays";
import BackToTop from "@/components/BackToTop";

export default function Home() {
  return (
    <ShopProvider>
      <Header />
      <main className="min-h-dvh">
        <div className="min-h-screen w-full">
          <div className="px container mx-auto px-0 py-24 md:py-20">
            <TopTabs />
            <div className="flex flex-row gap-2 px-2 max-md:pt-4 md:grid md:grid-cols-[100px_1fr] md:gap-8 md:px-0 lg:grid-cols-[120px_1fr]">
              <Sidebar />
              <main className="min-w-0 flex-1">
                <Hero />
                <div className="w-full">
                  <ProductsSection />
                </div>
              </main>
            </div>
          </div>
          <Faq />
          <Breadcrumb />
          <Reviews />
        </div>
      </main>
      <ChatLink />
      <Footer />
      <ShopOverlays />
      <BackToTop />
    </ShopProvider>
  );
}
