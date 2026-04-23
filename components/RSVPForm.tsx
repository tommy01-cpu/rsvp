'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Check, Loader as Loader2, Heart, X } from 'lucide-react';

type FormState = 'idle' | 'loading' | 'success' | 'error';

export default function RSVPForm() {
  const [attending, setAttending] = useState<boolean | null>(null);
  const [formState, setFormState] = useState<FormState>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    guest_count: 1,
    dietary_restrictions: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: name === 'guest_count' ? parseInt(value) : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (attending === null) return;

    setFormState('loading');
    setErrorMsg('');

    const { error } = await supabase.from('reservations').insert({
      ...form,
      attending,
    });

    if (error) {
      setFormState('error');
      setErrorMsg('Something went wrong. Please try again.');
    } else {
      setFormState('success');
    }
  };

  if (formState === 'success') {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
          style={{ background: 'linear-gradient(135deg, #C9A96E, #A07840)' }}
        >
          <Check className="w-10 h-10 text-white" strokeWidth={2.5} />
        </div>
        <h3 className="font-serif text-3xl md:text-4xl mb-3" style={{ color: '#2C1810' }}>
          {attending ? 'We\'ll see you there!' : 'We\'ll miss you!'}
        </h3>
        <p className="font-sans-body text-base leading-relaxed" style={{ color: '#6B5744', maxWidth: '360px' }}>
          {attending
            ? 'Thank you for your RSVP. We can\'t wait to celebrate with you on our special day.'
            : 'Thank you for letting us know. We\'ll be thinking of you as we celebrate.'}
        </p>
        <div className="mt-8 flex items-center gap-2" style={{ color: '#C9A96E' }}>
          <Heart className="w-4 h-4 fill-current" />
          <span className="font-serif italic text-lg">Claire &amp; James</span>
          <Heart className="w-4 h-4 fill-current" />
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Attending toggle */}
      <div>
        <label className="block font-sans-body text-sm font-700 mb-3 tracking-widest uppercase" style={{ color: '#8B7355' }}>
          Will you attend?
        </label>
        <div className="grid grid-cols-2 gap-3">
          {[true, false].map((val) => (
            <button
              key={String(val)}
              type="button"
              onClick={() => setAttending(val)}
              className="py-3 px-4 rounded-lg border-2 text-sm font-700 tracking-wide transition-all duration-200"
              style={{
                borderColor: attending === val ? '#C9A96E' : '#E8D5B7',
                background: attending === val ? '#C9A96E' : 'transparent',
                color: attending === val ? '#fff' : '#8B7355',
                fontFamily: 'var(--font-lato)',
                fontWeight: 700,
                letterSpacing: '0.08em',
              }}
            >
              {val ? 'Joyfully Accepts' : 'Regretfully Declines'}
            </button>
          ))}
        </div>
      </div>

      {/* Name */}
      <div>
        <label className="block font-sans-body text-xs font-700 mb-1.5 tracking-widest uppercase" style={{ color: '#8B7355' }}>
          Full Name *
        </label>
        <input
          required
          name="full_name"
          value={form.full_name}
          onChange={handleChange}
          placeholder="Your full name"
          className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-all duration-200"
          style={{
            border: '1.5px solid #E8D5B7',
            background: '#FFFDF9',
            color: '#2C1810',
            fontFamily: 'var(--font-lato)',
          }}
          onFocus={e => (e.target.style.borderColor = '#C9A96E')}
          onBlur={e => (e.target.style.borderColor = '#E8D5B7')}
        />
      </div>

      {/* Email */}
      <div>
        <label className="block font-sans-body text-xs font-700 mb-1.5 tracking-widest uppercase" style={{ color: '#8B7355' }}>
          Email Address *
        </label>
        <input
          required
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="your@email.com"
          className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-all duration-200"
          style={{
            border: '1.5px solid #E8D5B7',
            background: '#FFFDF9',
            color: '#2C1810',
            fontFamily: 'var(--font-lato)',
          }}
          onFocus={e => (e.target.style.borderColor = '#C9A96E')}
          onBlur={e => (e.target.style.borderColor = '#E8D5B7')}
        />
      </div>

      {/* Phone + Guests row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block font-sans-body text-xs font-700 mb-1.5 tracking-widest uppercase" style={{ color: '#8B7355' }}>
            Phone (optional)
          </label>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="+1 (555) 000-0000"
            className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-all duration-200"
            style={{
              border: '1.5px solid #E8D5B7',
              background: '#FFFDF9',
              color: '#2C1810',
              fontFamily: 'var(--font-lato)',
            }}
            onFocus={e => (e.target.style.borderColor = '#C9A96E')}
            onBlur={e => (e.target.style.borderColor = '#E8D5B7')}
          />
        </div>
        <div>
          <label className="block font-sans-body text-xs font-700 mb-1.5 tracking-widest uppercase" style={{ color: '#8B7355' }}>
            Number of Guests
          </label>
          <select
            name="guest_count"
            value={form.guest_count}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-all duration-200 cursor-pointer"
            style={{
              border: '1.5px solid #E8D5B7',
              background: '#FFFDF9',
              color: '#2C1810',
              fontFamily: 'var(--font-lato)',
            }}
            onFocus={e => (e.target.style.borderColor = '#C9A96E')}
            onBlur={e => (e.target.style.borderColor = '#E8D5B7')}
          >
            {[1, 2, 3, 4, 5, 6].map(n => (
              <option key={n} value={n}>{n} {n === 1 ? 'guest' : 'guests'}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Dietary */}
      <div>
        <label className="block font-sans-body text-xs font-700 mb-1.5 tracking-widest uppercase" style={{ color: '#8B7355' }}>
          Dietary Restrictions (optional)
        </label>
        <input
          name="dietary_restrictions"
          value={form.dietary_restrictions}
          onChange={handleChange}
          placeholder="Vegetarian, gluten-free, allergies..."
          className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-all duration-200"
          style={{
            border: '1.5px solid #E8D5B7',
            background: '#FFFDF9',
            color: '#2C1810',
            fontFamily: 'var(--font-lato)',
          }}
          onFocus={e => (e.target.style.borderColor = '#C9A96E')}
          onBlur={e => (e.target.style.borderColor = '#E8D5B7')}
        />
      </div>

      {/* Message */}
      <div>
        <label className="block font-sans-body text-xs font-700 mb-1.5 tracking-widest uppercase" style={{ color: '#8B7355' }}>
          Message to the Couple (optional)
        </label>
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          rows={3}
          placeholder="Share your wishes for the happy couple..."
          className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-all duration-200 resize-none"
          style={{
            border: '1.5px solid #E8D5B7',
            background: '#FFFDF9',
            color: '#2C1810',
            fontFamily: 'var(--font-lato)',
          }}
          onFocus={e => (e.target.style.borderColor = '#C9A96E')}
          onBlur={e => (e.target.style.borderColor = '#E8D5B7')}
        />
      </div>

      {formState === 'error' && (
        <div className="flex items-center gap-2 p-3 rounded-lg" style={{ background: '#FEF2F2', color: '#DC2626' }}>
          <X className="w-4 h-4 flex-shrink-0" />
          <span className="text-sm">{errorMsg}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={attending === null || formState === 'loading'}
        className="w-full py-4 rounded-lg text-sm tracking-widest uppercase font-bold transition-all duration-300 flex items-center justify-center gap-2 mt-2"
        style={{
          background: attending === null || formState === 'loading'
            ? '#D5C4A8'
            : 'linear-gradient(135deg, #C9A96E, #A07840)',
          color: '#fff',
          fontFamily: 'var(--font-lato)',
          cursor: attending === null || formState === 'loading' ? 'not-allowed' : 'pointer',
          letterSpacing: '0.12em',
        }}
      >
        {formState === 'loading' ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Sending...
          </>
        ) : (
          'Send RSVP'
        )}
      </button>
    </form>
  );
}
