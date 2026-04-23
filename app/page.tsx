import React from 'react';
import RSVPForm from '@/components/RSVPForm';
import FallingText from '@/components/FallingText';
import ScrollReveal from '@/components/ScrollReveal';
import { Heart, MapPin, Clock, Calendar, Music, Utensils, Camera } from 'lucide-react';

const GOLD = '#C9A96E';
const GOLD_DARK = '#A07840';
const CREAM = '#FDF8F0';
const CREAM_SECTION = '#FAF4EC';
const BROWN_DARK = '#2C1810';
const BROWN_MID = '#6B5744';
const BROWN_LIGHT = '#8B7355';
const BORDER = '#E8D5B7';

function Divider() {
  return (
    <div className="flex items-center justify-center gap-4 my-8">
      <div style={{ width: 60, height: 1, background: GOLD, opacity: 0.5 }} />
      <Heart className="heart-pulse" style={{ color: GOLD, fill: GOLD, width: 14, height: 14 }} />
      <div style={{ width: 60, height: 1, background: GOLD, opacity: 0.5 }} />
    </div>
  );
}

export default function Home() {
  return (
    <main style={{ background: CREAM, minHeight: '100vh' }}>

      {/* ── HERO ─────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ minHeight: '100svh' }}>
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=1600"
            alt="Claire and James"
            className="w-full h-full object-cover hero-zoom"
          />
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to bottom, rgba(20,10,5,0.35) 0%, rgba(20,10,5,0.55) 60%, rgba(20,10,5,0.72) 100%)',
            }}
          />
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-24"
          style={{ minHeight: '100svh' }}>
          <p className="font-sans-body text-xs tracking-[0.35em] uppercase mb-6 opacity-0 animate-fade-in"
            style={{ color: '#E8D5B7', animationFillMode: 'forwards' }}>
           By the grace of God and with the blessings of our families
          </p>
        
          <h1 className="font-serif opacity-0 animate-fade-in-up delay-200"
            style={{
              fontSize: 'clamp(3rem, 10vw, 7rem)',
              fontWeight: 300,
              color: '#FFFDF9',
              lineHeight: 1.1,
              letterSpacing: '-0.01em',
              animationFillMode: 'forwards',
            }}>
            Claire
            <span style={{ color: GOLD, fontStyle: 'italic' }}> &amp; </span>
            James
          </h1>

          <p className="font-serif italic opacity-0 animate-fade-in-up delay-400 mt-2"
            style={{
              fontSize: 'clamp(1.1rem, 3vw, 1.6rem)',
              color: '#E8D5B7',
              fontWeight: 300,
              animationFillMode: 'forwards',
            }}>
           cordially invited you to join us as we celebrate the sacrament of matrimony         </p>

          <div className="mt-10 opacity-0 animate-fade-in-up delay-600"
            style={{ animationFillMode: 'forwards' }}>
            <div
              className="px-8 py-4 rounded-full inline-block"
              style={{
                border: `1.5px solid ${GOLD}`,
                background: 'rgba(201, 169, 110, 0.12)',
                backdropFilter: 'blur(4px)',
              }}
            >
              <p className="font-serif" style={{ color: '#FFFDF9', fontSize: '1.1rem', letterSpacing: '0.05em' }}>
                May 09, 2026
              </p>
            </div>
          </div>

          <div className="mt-16 opacity-0 animate-fade-in delay-800"
            style={{ animationFillMode: 'forwards' }}>
            <div
              style={{ width: 1, height: 60, background: `linear-gradient(to bottom, ${GOLD}, transparent)`, margin: '0 auto' }}
            />
            <p className="font-sans-body text-xs tracking-[0.3em] uppercase mt-4"
              style={{ color: '#C9A96E' }}>scroll</p>
          </div>
        </div>
      </section>

      {/* spacer to prevent gallery images from visually overlapping the programme on small screens */}
      <div className="block md:hidden" style={{ height: 120 }} />

      {/* ── INVITATION TEXT ───────────────────── */}
      <section className="px-6 py-20 text-center" style={{ background: CREAM, position: 'relative', zIndex: 2 }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <p className="font-sans-body text-xs tracking-[0.35em] uppercase mb-4" style={{ color: GOLD }}>
            You are invited
          </p>
          <h2 className="font-serif mb-6"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 300, color: BROWN_DARK, lineHeight: 1.2 }}>
            A Celebration of Love
          </h2>
          <Divider />
          <FallingText className="font-serif italic leading-relaxed"
            style={{ fontSize: 'clamp(1.05rem, 2.5vw, 1.3rem)', color: BROWN_MID, lineHeight: 1.8 }}>
            We joyfully invite you to share in the celebration of our wedding day,
            as we exchange vows and begin our journey together as husband and wife.
            Your presence will make this day truly unforgettable.
          </FallingText>
        </div>
      </section>

      {/* ── EVENT DETAILS ─────────────────────── */}
      <section className="px-6 py-20" style={{ background: CREAM_SECTION }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div className="text-center mb-14">
            <p className="font-sans-body text-xs tracking-[0.35em] uppercase mb-3" style={{ color: GOLD }}>
              Event Details
            </p>
            <h2 className="font-serif"
              style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 300, color: BROWN_DARK }}>
              Mark Your Calendar
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <Calendar className="w-6 h-6" />,
                title: 'Date',
                line1: 'Saturday',
                line2: 'May 09, 2026',
              },
              {
                icon: <Clock className="w-6 h-6" />,
                title: 'Time',
                line1: 'Ceremony at 9:30 AM',
                line2: 'Reception to follow',
              },
              {
                icon: <MapPin className="w-6 h-6" />,
                title: 'Venue',
                line1: 'The Potter’s House Christian Center',
                line2: 'Las Piñas City, Philippines',
              },
            ].map((card) => (
              <div
                key={card.title}
                className="text-center p-8 rounded-2xl reveal-on-scroll"
                data-animate="slide-in-right"
                style={{ background: CREAM, border: `1px solid ${BORDER}` }}
              >
                <div className="flex items-center justify-center mb-4"
                  style={{ color: GOLD }}>
                  {card.icon}
                </div>
                <p className="font-sans-body text-xs tracking-[0.3em] uppercase mb-3"
                  style={{ color: BROWN_LIGHT }}>
                  {card.title}
                </p>
                <p className="font-serif"
                  style={{ fontSize: '1.2rem', color: BROWN_DARK, lineHeight: 1.5 }}>
                  {card.line1}
                </p>
                <p className="font-serif italic mt-1"
                  style={{ fontSize: '1rem', color: BROWN_MID }}>
                  {card.line2}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GALLERY STRIP ─────────────────────── */}
      <section className="py-0">
          <div className="grid grid-cols-1 md:grid-cols-3" style={{ minHeight: 'clamp(260px, 40vw, 480px)' }}>
          {[
            'https://images.pexels.com/photos/2253870/pexels-photo-2253870.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/1128783/pexels-photo-1128783.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/265722/pexels-photo-265722.jpeg?auto=compress&cs=tinysrgb&w=800',
          ].map((src, i) => (
            <div key={i} className="relative overflow-hidden" style={{ height: 'clamp(200px, 35vw, 480px)' }}>
              <img
                src={src}
                alt={`Wedding photo ${i + 1}`}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105 reveal-on-scroll"
                data-animate={i % 2 === 0 ? 'slide-in-left' : 'slide-in-right'}
              />
              <div className="absolute inset-0" style={{ background: 'rgba(20,10,5,0.08)' }} />
            </div>
          ))}
        </div>
      </section>

      {/* ── PROGRAMME ─────────────────────────── */}
      <section className="px-6 py-20 text-center" style={{ background: CREAM, position: 'relative', zIndex: 10 }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <p className="font-sans-body text-xs tracking-[0.35em] uppercase mb-3" style={{ color: GOLD }}>
            The Day
          </p>
          <h2 className="font-serif mb-12"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 300, color: BROWN_DARK }}>
            Wedding Programme
          </h2>

          <div className="space-y-0">
            {[
                { time: '9:30 AM', label: 'Entourage', icon: <Heart className="w-4 h-4" /> },
                { time: '9:45 AM', label: 'Preaching', icon: <Clock className="w-4 h-4" /> },
                { time: '10:05 AM', label: 'Wedding Ceremony', icon: <Heart className="w-4 h-4 fill-current" /> },
                { time: '10:35 AM', label: 'Photos & Preparations', icon: <Camera className="w-4 h-4" /> },
                { time: '10:50 AM', label: 'Wedding Toast', icon: <Music className="w-4 h-4" /> },
                { time: '11:00 AM', label: 'Lunch & Activities', icon: <Utensils className="w-4 h-4" /> },
                { time: '11:50 AM', label: 'Tossing of Bouquet', icon: <Heart className="w-4 h-4" /> },
                { time: '11:55 AM', label: 'Slicing & Eating of Cake', icon: <Utensils className="w-4 h-4" /> },
                { time: '12:00 PM', label: 'Messages', icon: <Heart className="w-4 h-4" /> },
            ].map((item, i, arr) => (
              <div
                key={i}
                className="relative flex items-start gap-6 pb-0 reveal-on-scroll opacity-0"
                style={{ animationDelay: `${i * 120}ms` }}
              >
                {/* timeline line */}
                {i < arr.length - 1 && (
                  <div className="absolute left-[47px] top-10 w-px"
                    style={{ height: 48, background: BORDER }} />
                )}
                {/* dot */}
                <div className="flex-shrink-0 w-24 text-right">
                  <span className="font-sans-body text-xs tracking-wide"
                    style={{ color: BROWN_LIGHT }}>{item.time}</span>
                </div>
                <div
                  className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5"
                  style={{ background: GOLD, color: '#fff' }}
                >
                  <span style={{ transform: 'scale(0.65)', display: 'block' }}>{item.icon}</span>
                </div>
                <div className="pb-10 text-left">
                  <p className="font-serif" style={{ fontSize: '1.1rem', color: BROWN_DARK }}>{item.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ENTOURAGE / NAMES LIST (two columns for parents, centered officiant, two-column sponsors; responsive) ───────────────── */}
      <section className="px-6 py-20 text-center" style={{ background: CREAM }}>
        <div style={{ maxWidth: 980, margin: '0 auto' }}>
          <p className="font-sans-body text-xs tracking-[0.35em] uppercase mb-3" style={{ color: GOLD }}>
            Wedding Entourage
          </p>
          <h2 className="font-serif mb-8"
            style={{ fontSize: 'clamp(1.9rem, 4vw, 3rem)', fontWeight: 300, color: BROWN_DARK }}>
            Entourage
          </h2>

          {/* Parents row: two columns (groom left, bride right). Mobile: centered text */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 items-start">
            <div className="text-center md:text-left">
              <div className="reveal-on-scroll" data-animate="slide-in-right" style={{ animationDelay: '0.12s' }}>
                <p className="font-sans-body text-sm uppercase mb-2" style={{ color: BROWN_LIGHT }}>Parents of the Groom</p>
                <p className="font-serif font-semibold" style={{ color: BROWN_DARK }}>Mr. Sande T. Malinao</p>
                <p className="font-serif font-semibold" style={{ color: BROWN_DARK }}>Mrs. Susana G. Malinao</p>
              </div>
            </div>
            <div className="text-center md:text-right">
              <div className="reveal-on-scroll" data-animate="slide-in-left" style={{ animationDelay: '0.14s' }}>
                <p className="font-sans-body text-sm uppercase mb-2" style={{ color: BROWN_LIGHT }}>Parents of the Bride</p>
                <p className="font-serif font-semibold" style={{ color: BROWN_DARK }}>Mr. Arnel Dungcayan</p>
                <p className="font-serif font-semibold" style={{ color: BROWN_DARK }}>Mrs. Emily Dungcayan</p>
              </div>
            </div>
          </div>

          {/* Officiating minister centered */}
          <div className="text-center mb-10 reveal-on-scroll" data-animate="reveal-fade" style={{ animationDelay: '0.16s' }}>
            <p className="font-sans-body text-sm tracking-wide uppercase mb-2" style={{ color: BROWN_LIGHT }}>Officiating Minister</p>
            <p className="font-serif font-semibold" style={{ color: BROWN_DARK, fontSize: '1.25rem' }}>Pastor Ronilo Garcia</p>
          </div>

          {/* Principal sponsors: two columns (male left, female right) - force two columns */}
          <div className="mb-10 reveal-on-scroll" data-animate="reveal-fade" style={{ animationDelay: '0.12s' }}>
            <p className="font-sans-body text-sm tracking-wide uppercase mb-6" style={{ color: BROWN_LIGHT }}>Principal Sponsors</p>

            <div className="grid grid-cols-2 gap-8 max-w-2xl mx-auto">
              <div className="text-center md:text-right reveal-on-scroll" data-animate="slide-in-right" style={{ animationDelay: '0.18s' }}>
                <div className="space-y-2">
                  <p className="font-serif font-semibold">Mr. Jayrold Visitacion</p>
                  <p className="font-serif font-semibold">Mr. Cris Santos</p>
                  <p className="font-serif font-semibold">Mr. Willy Saturno</p>
                  <p className="font-serif font-semibold">Mr. Jayson Oracion</p>
                  <p className="font-serif font-semibold">Mr. Jijian Arzadon</p>
                  <p className="font-serif font-semibold">Mr. Neil Teraza</p>
                  <p className="font-serif font-semibold">Mr. Henry Saligan</p>
                  <p className="font-serif font-semibold">Mr. Jayson Coloma</p>
                  <p className="font-serif font-semibold">Mr. Rocky Patalinghug</p>
                  <p className="font-serif font-semibold">Mr. Alan Tablada</p>
                </div>
              </div>

              <div className="text-center md:text-left reveal-on-scroll" data-animate="slide-in-left" style={{ animationDelay: '0.2s' }}>
                <div className="space-y-2">
                  <p className="font-serif font-semibold">Mrs. Anna Marie Visitacion</p>
                  <p className="font-serif font-semibold">Mrs. Imelda Amores</p>
                  <p className="font-serif font-semibold">Mrs. Josh Querubin</p>
                  <p className="font-serif font-semibold">Mrs. Amalia Solis</p>
                  <p className="font-serif font-semibold">Mrs. Zeny Arzadon</p>
                  <p className="font-serif font-semibold">Mrs. Nhing Guda</p>
                  <p className="font-serif font-semibold">Mrs. Robee Saligan</p>
                  <p className="font-serif font-semibold">Mrs. Mhean Coloma</p>
                  <p className="font-serif font-semibold">Mrs. Joanna Patalinghug</p>
                  <p className="font-serif font-semibold">Mrs. Sonia Tablada</p>
                </div>
              </div>
            </div>
          </div>

          {/* Secondary sponsors: Best Man & Maid of Honor horizontally, Groomsmen & Bridesmaid aligned horizontally */}
          <div className="mt-8 text-center" style={{ color: BROWN_DARK }}>
            <p className="font-sans-body text-sm tracking-wide uppercase mb-6" style={{ color: BROWN_LIGHT }}>Secondary Sponsors</p>

            <div className="grid grid-cols-2 gap-8 max-w-3xl mx-auto mb-8">
              <div className="text-center md:text-left reveal-on-scroll" data-animate="slide-in-right" style={{ animationDelay: '0.22s' }}>
                <p className="font-sans-body text-sm uppercase" style={{ color: BROWN_LIGHT }}>Best Man</p>
                <p className="font-serif font-semibold mt-2">Macky Nulla</p>

                <p className="font-sans-body text-sm uppercase mt-6" style={{ color: BROWN_LIGHT }}>Groomsmen</p>
                <div className="mt-2 space-y-1">
                  <p className="font-serif font-semibold">Emmanuel Navarez Jr.</p>
                  <p className="font-serif font-semibold">John Arwin Dungcayan</p>
                  <p className="font-serif font-semibold">Darwin Dungcayan</p>
                  <p className="font-serif font-semibold">Jaryll Dungcayan</p>
                </div>
              </div>

              <div className="text-center md:text-right reveal-on-scroll" data-animate="slide-in-left" style={{ animationDelay: '0.24s' }}>
                <p className="font-sans-body text-sm uppercase" style={{ color: BROWN_LIGHT }}>Maid of Honor</p>
                <p className="font-serif font-semibold mt-2">Jessalyn R. Cruz</p>

                <p className="font-sans-body text-sm uppercase mt-6" style={{ color: BROWN_LIGHT }}>Bridesmaid</p>
                <div className="mt-2 space-y-1">
                  <p className="font-serif font-semibold">Emelyn Yap Jandoc</p>
                  <p className="font-serif font-semibold">Sharon Tabisaura</p>
                  <p className="font-serif font-semibold">Abegail Apolinar</p>
                  <p className="font-serif font-semibold">Alexa Granadil</p>
                </div>
              </div>
            </div>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
              <div className="reveal-on-scroll" data-animate="slide-in-right" style={{ animationDelay: '0.26s' }}>
                <p className="font-sans-body text-sm uppercase" style={{ color: BROWN_LIGHT }}>Coin Bearer</p>
                <p className="font-serif font-semibold mt-2">Getulio Celis III</p>
                <p className="font-serif font-semibold">Sean Malinao</p>
              </div>
              <div className="reveal-on-scroll" data-animate="reveal-fade" style={{ animationDelay: '0.28s' }}>
                <p className="font-sans-body text-sm uppercase" style={{ color: BROWN_LIGHT }}>Bible Bearer</p>
                <p className="font-serif font-semibold mt-2">Rohan Zev</p>
                <p className="font-serif font-semibold">Gian Macaraig</p>
              </div>
              <div className="reveal-on-scroll" data-animate="slide-in-left" style={{ animationDelay: '0.3s' }}>
                <p className="font-sans-body text-sm uppercase" style={{ color: BROWN_LIGHT }}>Ring Bearer</p>
                <p className="font-serif font-semibold mt-2">Renz lucas Hilot</p>
              </div>
            </div>

            <div className="mt-8 reveal-on-scroll" data-animate="reveal-fade" style={{ animationDelay: '0.32s' }}>
              <p className="font-sans-body text-sm uppercase" style={{ color: BROWN_LIGHT }}>Flower</p>
              <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
                <p className="font-serif font-semibold">Zoey Del Rosario</p>
                <p className="font-serif font-semibold">Princess Romero</p>
                <p className="font-serif font-semibold">Jeann Faith Dela Cruz</p>
              </div>
            </div>

            <p className="font-serif italic mt-8" style={{ color: BROWN_MID, fontSize: '0.98rem' }}>
              "And above all these things put on love which is the bond of perfectness." — Colossians 3:14
            </p>
          </div>
        </div>
      </section>

      {/* ── VENUE SECTION ─────────────────────── */}
      <section className="overflow-hidden" style={{ background: CREAM_SECTION }}>
        <div className="grid grid-cols-1 md:grid-cols-2" style={{ minHeight: 420 }}>
          <div className="relative reveal-on-scroll" data-animate="slide-in-left" style={{ minHeight: 280, animationDelay: '0.34s' }}>
            <img
              src="https://images.pexels.com/photos/169198/pexels-photo-169198.jpeg?auto=compress&cs=tinysrgb&w=900"
              alt="Wedding venue"
              className="w-full h-full object-cover"
              style={{ minHeight: 280 }}
            />
            <div className="absolute inset-0" style={{ background: 'rgba(20,10,5,0.12)' }} />
          </div>
          <div className="flex flex-col justify-center px-8 md:px-14 py-14">
            <p className="font-sans-body text-xs tracking-[0.35em] uppercase mb-3" style={{ color: GOLD }}>
              Venue
            </p>
            <h2 className="font-serif mb-4"
              style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.3rem)', fontWeight: 300, color: BROWN_DARK }}>
              The Potter's House Christian Center Las Piñas Church
            </h2>
            <div className="mb-5" style={{ width: 48, height: 2, background: GOLD }} />
            <p className="font-sans-body mb-6 leading-relaxed" style={{ color: BROWN_MID, fontSize: '0.95rem' }}>
              God has placed everything necessary to accomplish His will in the setting of the local church.Ephesians 1:22-23 …the church. Which is his body, the fullness of him who fills everything in every way.God’s will is accomplished in us and through us as connect and commit ourselves to a local church.
            </p>
            <div className="flex items-start gap-3 mb-3">
              <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: GOLD }} />
              <div>
                <p className="font-sans-body text-sm" style={{ color: BROWN_DARK }}>347 Diego Cera Avenue, Pulang Lupa</p>
                <p className="font-sans-body text-sm" style={{ color: BROWN_MID }}>Las Piñas City, Philippines</p>
              </div>
            </div>
            <a
              href="https://www.google.com/maps/place/The+Potter's+House+Christian+Center/@14.4727999,120.9712606,17z/data=!3m1!4b1!4m6!3m5!1s0x3397cdc4b4b6d82b:0xb297dcb11ec66ae9!8m2!3d14.4728!4d120.9761315!16s%2Fg%2F11bx1z3sjf?hl=en&entry=ttu&g_ep=EgoyMDI2MDQyMC4wIKXMDSoASAFQAw%3D%3D"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-4 font-sans-body text-sm tracking-wide transition-all duration-200"
              style={{ color: GOLD, textDecoration: 'underline', textUnderlineOffset: '4px' }}
            >
              View on Google Maps
            </a>
          </div>
        </div>
      </section>

      {/* ── RSVP FORM ─────────────────────────── */}
      <section className="px-6 py-20" style={{ background: CREAM }} id="rsvp">
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <div className="text-center mb-10">
            <p className="font-sans-body text-xs tracking-[0.35em] uppercase mb-3" style={{ color: GOLD }}>
              RSVP
            </p>
            <h2 className="font-serif mb-4"
              style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 300, color: BROWN_DARK }}>
              Kindly Reply
            </h2>
            <p className="font-sans-body text-sm" style={{ color: BROWN_LIGHT }}>
              Please RSVP by <strong style={{ color: BROWN_MID }}>May 03, 2026</strong>
            </p>
            <Divider />
          </div>

          <div
            className="rounded-2xl p-7 md:p-10"
            style={{ background: '#fff', border: `1px solid ${BORDER}`, boxShadow: '0 8px 40px rgba(44,24,16,0.07)' }}
          >
            <RSVPForm />
          </div>
        </div>
      </section>

      <ScrollReveal />

      {/* ── FOOTER ────────────────────────────── */}
      <footer className="px-6 py-14 text-center" style={{ background: BROWN_DARK }}>
        <h3 className="font-serif mb-3"
          style={{ fontSize: 'clamp(1.6rem, 4vw, 2.6rem)', color: '#FFFDF9', fontWeight: 300 }}>
          Claire <span style={{ color: GOLD, fontStyle: 'italic' }}>&amp;</span> James
        </h3>
        <p className="font-serif italic mb-6" style={{ color: '#C4A882', fontSize: '1rem' }}>
          May 09, 2026 &bull;The Potter's House Christian Center, Las Piñas City, Philippines
        </p>
        <div className="flex items-center justify-center gap-3">
          <div style={{ width: 40, height: 1, background: GOLD, opacity: 0.4 }} />
          <Heart className="w-4 h-4" style={{ color: GOLD, fill: GOLD }} />
          <div style={{ width: 40, height: 1, background: GOLD, opacity: 0.4 }} />
        </div>
        <p className="font-sans-body text-xs mt-6" style={{ color: '#6B5744' }}>
          With love &amp; gratitude for celebrating with us.
        </p>
      </footer>

    </main>
  );
}
