import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f6f2ea] text-[#2f2018]">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-6 py-16">
        <div className="rounded-3xl border border-[#d9c4a3] bg-white/60 p-8 shadow-sm backdrop-blur-sm md:p-12">
          <p className="mb-4 text-xs uppercase tracking-[0.35em] text-[#bb9457]">Welcome</p>
          <h1 className="font-[var(--font-cormorant)] text-5xl leading-tight md:text-7xl">J7 Wedding CMS</h1>
          <p className="mt-4 max-w-2xl text-base text-[#6a5440] md:text-lg">
            Manage weddings, media, sections, and invitations from one place.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Link
              href="/users/login"
              className="rounded-xl bg-[#c7a461] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#b8934f]"
            >
              User Login
            </Link>
            <Link
              href="/admin/login"
              className="rounded-xl border border-[#d1b68a] bg-white px-6 py-3 text-sm font-semibold text-[#6a4a2a] transition hover:bg-[#f6efe3]"
            >
              Admin Login
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
