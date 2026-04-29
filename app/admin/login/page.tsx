'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Heart, Loader as Loader2, CircleAlert as AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      const normalizedEmail = email.trim().toLowerCase();
      const { data: mappedUser, error: mapError } = await supabase
        .from('users')
        .select('id, username, password, wedding_id')
        .eq('username', normalizedEmail)
        .maybeSingle();

      if (mapError) {
        await supabase.auth.signOut();
        setError(`User scope check failed: ${mapError.message}`);
        setLoading(false);
        return;
      }

      if (mappedUser) {
        await supabase.auth.signOut();
        setError('This account is a user account. Please login at /users/login.');
        setLoading(false);
        return;
      }

      router.push('/admin');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ background: '#FDF8F0' }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Heart className="w-6 h-6" style={{ color: '#C9A96E', fill: '#C9A96E' }} />
            <span className="font-serif text-2xl" style={{ color: '#2C1810' }}>J7 Wedding CMS</span>
            <Heart className="w-6 h-6" style={{ color: '#C9A96E', fill: '#C9A96E' }} />
          </div>
          <h1 className="font-serif text-3xl mb-2" style={{ color: '#2C1810' }}>Admin Login</h1>
          <p className="font-sans-body text-sm" style={{ color: '#8B7355' }}>
            Sign in to manage weddings and RSVPs
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="p-8 rounded-2xl" style={{ background: '#fff', border: '1px solid #E8D5B7', boxShadow: '0 8px 40px rgba(44,24,16,0.07)' }}>
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg mb-5" style={{ background: '#FEF2F2', color: '#DC2626' }}>
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm font-sans-body">{error}</span>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block font-sans-body text-xs uppercase tracking-widest mb-1.5" style={{ color: '#8B7355', fontWeight: 700 }}>
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-all"
                  style={{
                    border: '1.5px solid #E8D5B7',
                    background: '#FFFDF9',
                    color: '#2C1810',
                    fontFamily: 'var(--font-lato)',
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#C9A96E'}
                  onBlur={(e) => e.target.style.borderColor = '#E8D5B7'}
                />
              </div>

              <div>
                <label className="block font-sans-body text-xs uppercase tracking-widest mb-1.5" style={{ color: '#8B7355', fontWeight: 700 }}>
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-all"
                  style={{
                    border: '1.5px solid #E8D5B7',
                    background: '#FFFDF9',
                    color: '#2C1810',
                    fontFamily: 'var(--font-lato)',
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#C9A96E'}
                  onBlur={(e) => e.target.style.borderColor = '#E8D5B7'}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg text-sm uppercase tracking-widest font-bold transition-all mt-6 flex items-center justify-center gap-2"
              style={{
                background: loading ? '#D5C4A8' : 'linear-gradient(135deg, #C9A96E, #A07840)',
                color: '#fff',
                fontFamily: 'var(--font-lato)',
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </div>
        </form>

        <p className="text-center font-sans-body text-xs mt-6" style={{ color: '#8B7355' }}>
          Admin accounts only. User accounts should login at /users/login.
        </p>
      </div>
    </div>
  );
}
