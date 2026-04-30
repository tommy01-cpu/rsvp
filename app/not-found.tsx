import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f6f2ea] px-6 py-16 text-[#2f2018]">
      <div className="w-full max-w-xl rounded-3xl border border-[#d9c4a3] bg-white/70 p-10 text-center shadow-sm">
        <p className="text-xs uppercase tracking-[0.35em] text-[#bb9457]">404</p>
        <h1 className="mt-3 font-[var(--font-cormorant)] text-5xl">Page Not Found</h1>
        <p className="mt-4 text-[#6a5440]">The page you are looking for does not exist.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="rounded-xl bg-[#c7a461] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#b8934f]"
          >
            Go to Home
          </Link>
          <Link
            href="/users/login"
            className="rounded-xl border border-[#d1b68a] bg-white px-5 py-2.5 text-sm font-semibold text-[#6a4a2a] transition hover:bg-[#f6efe3]"
          >
            User Login
          </Link>
        </div>
      </div>
    </main>
  );
}
