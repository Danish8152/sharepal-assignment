"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import animationData from "@/data/chat-animation.json";

const CHATBOT_PATH = "/chatbot";

function ChatAnimation({ className }: { className: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    let destroy: (() => void) | undefined;
    let cancelled = false;
    import("lottie-web").then(({ default: lottie }) => {
      if (cancelled || !ref.current) return;
      const anim = lottie.loadAnimation({
        container: ref.current,
        renderer: "svg",
        loop: true,
        autoplay: true,
        animationData,
      });
      destroy = () => anim.destroy();
    });
    return () => {
      cancelled = true;
      destroy?.();
    };
  }, []);

  return <div ref={ref} className={className} />;
}

export default function ChatLink() {
  const pathname = usePathname();
  if (pathname.startsWith(CHATBOT_PATH)) return null;

  return (
    <Link
      href={CHATBOT_PATH}
      title="Open chatbot"
      aria-label="Open chatbot"
      className="fixed bottom-16 right-2 z-[40] md:bottom-10 md:right-6"
    >
      <ChatAnimation className="w-20 lg:w-28" />
    </Link>
  );
}
