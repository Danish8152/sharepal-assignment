import Link from "next/link";

export default function ChatbotPage() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-xl flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="font-ubuntu text-h5 font-bold">SharePal Assistant</h1>
      <p className="text-b3 text-neutral-500">The chatbot is coming soon.</p>
      <Link href="/" className="rounded-full border-2 border-primary-900 px-6 py-2 text-sh3">
        Back to home
      </Link>
    </main>
  );
}
