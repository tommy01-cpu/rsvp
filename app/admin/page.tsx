'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Users, CircleCheck as CheckCircle, Circle as XCircle, Mail, Phone, Utensils, MessageSquare, Calendar, Search, Download, LogOut } from 'lucide-react';

type Reservation = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  attending: boolean;
  guest_count: number;
  dietary_restrictions: string;
  message: string;
  created_at: string;
};

export default function AdminPage() {
  const router = useRouter();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'attending' | 'declined'>('all');

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push('/admin/login');
      return;
    }
    fetchReservations();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  const fetchReservations = async () => {
    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from('reservations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      setError('Failed to load reservations. Make sure you are authenticated.');
    } else {
      setReservations(data || []);
    }
    setLoading(false);
  };

  const filteredReservations = reservations.filter(r => {
    const matchesSearch = r.full_name.toLowerCase().includes(search.toLowerCase()) ||
      r.email.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' ||
      (filter === 'attending' && r.attending) ||
      (filter === 'declined' && !r.attending);
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: reservations.length,
    attending: reservations.filter(r => r.attending).length,
    declined: reservations.filter(r => !r.attending).length,
    totalGuests: reservations.filter(r => r.attending).reduce((sum, r) => sum + r.guest_count, 0),
  };

  const exportCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Attending', 'Guest Count', 'Dietary', 'Message', 'Submitted'];
    const rows = filteredReservations.map(r => [
      r.full_name,
      r.email,
      r.phone || '',
      r.attending ? 'Yes' : 'No',
      r.guest_count,
      r.dietary_restrictions || '',
      r.message || '',
      new Date(r.created_at).toLocaleDateString(),
    ]);
    const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'wedding-rsvps.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#FDF8F0' }}>
        <div className="text-center">
          <div className="w-12 h-12 border-4 rounded-full animate-spin mx-auto mb-4"
            style={{ borderColor: '#E8D5B7', borderTopColor: '#C9A96E' }} />
          <p className="font-sans-body" style={{ color: '#6B5744' }}>Loading reservations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6" style={{ background: '#FDF8F0' }}>
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ background: '#FEF2F2' }}>
            <XCircle className="w-8 h-8" style={{ color: '#DC2626' }} />
          </div>
          <h2 className="font-serif text-2xl mb-2" style={{ color: '#2C1810' }}>Access Denied</h2>
          <p className="font-sans-body mb-6" style={{ color: '#6B5744' }}>{error}</p>
          <p className="font-sans-body text-sm" style={{ color: '#8B7355' }}>
            You need to be logged in to view this page. Please check your Supabase authentication.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: '#FDF8F0' }}>
      {/* Header */}
      <header className="px-6 py-6 border-b" style={{ borderColor: '#E8D5B7', background: '#fff' }}>
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl md:text-3xl" style={{ color: '#2C1810' }}>
              Wedding RSVP Admin
            </h1>
            <p className="font-sans-body text-sm mt-1" style={{ color: '#8B7355' }}>
              Claire & James — May 09, 2026
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={exportCSV}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-sans-body transition-all"
              style={{
                background: '#C9A96E',
                color: '#fff',
                fontWeight: 600,
              }}
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-sans-body transition-all"
              style={{
                background: '#fff',
                color: '#6B5744',
                border: '1.5px solid #E8D5B7',
                fontWeight: 600,
              }}
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total RSVPs', value: stats.total, icon: <Users className="w-5 h-5" />, color: '#C9A96E' },
            { label: 'Attending', value: stats.attending, icon: <CheckCircle className="w-5 h-5" />, color: '#16A34A' },
            { label: 'Declined', value: stats.declined, icon: <XCircle className="w-5 h-5" />, color: '#DC2626' },
            { label: 'Total Guests', value: stats.totalGuests, icon: <Users className="w-5 h-5" />, color: '#2563EB' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="p-5 rounded-xl"
              style={{ background: '#fff', border: '1px solid #E8D5B7' }}
            >
              <div className="flex items-center gap-2 mb-2" style={{ color: stat.color }}>
                {stat.icon}
                <span className="font-sans-body text-xs uppercase tracking-wider" style={{ color: '#8B7355' }}>
                  {stat.label}
                </span>
              </div>
              <p className="font-serif text-3xl" style={{ color: '#2C1810' }}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#8B7355' }} />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg text-sm outline-none"
              style={{
                border: '1.5px solid #E8D5B7',
                background: '#fff',
                color: '#2C1810',
                fontFamily: 'var(--font-lato)',
              }}
            />
          </div>
          <div className="flex gap-2">
            {(['all', 'attending', 'declined'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className="px-4 py-2 rounded-lg text-sm font-sans-body transition-all capitalize"
                style={{
                  background: filter === f ? '#C9A96E' : '#fff',
                  color: filter === f ? '#fff' : '#6B5744',
                  border: '1.5px solid #E8D5B7',
                  fontWeight: 600,
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Reservations List */}
        {filteredReservations.length === 0 ? (
          <div className="text-center py-16 rounded-xl" style={{ background: '#fff', border: '1px solid #E8D5B7' }}>
            <Users className="w-12 h-12 mx-auto mb-4" style={{ color: '#C9A96E', opacity: 0.5 }} />
            <p className="font-serif text-xl mb-2" style={{ color: '#2C1810' }}>No RSVPs yet</p>
            <p className="font-sans-body text-sm" style={{ color: '#8B7355' }}>
              {search || filter !== 'all' ? 'Try adjusting your filters' : 'RSVPs will appear here once submitted'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredReservations.map((r) => (
              <div
                key={r.id}
                className="p-5 rounded-xl"
                style={{ background: '#fff', border: '1px solid #E8D5B7' }}
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-serif text-lg" style={{ color: '#2C1810' }}>{r.full_name}</h3>
                      <span
                        className="px-2 py-0.5 rounded text-xs font-sans-body"
                        style={{
                          background: r.attending ? '#DCFCE7' : '#FEE2E2',
                          color: r.attending ? '#16A34A' : '#DC2626',
                          fontWeight: 600,
                        }}
                      >
                        {r.attending ? 'Attending' : 'Declined'}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm font-sans-body" style={{ color: '#6B5744' }}>
                      <span className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5" /> {r.email}
                      </span>
                      {r.phone && (
                        <span className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5" /> {r.phone}
                        </span>
                      )}
                      {r.attending && (
                        <span className="flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5" /> {r.guest_count} {r.guest_count === 1 ? 'guest' : 'guests'}
                        </span>
                      )}
                      {r.dietary_restrictions && (
                        <span className="flex items-center gap-1.5">
                          <Utensils className="w-3.5 h-3.5" /> {r.dietary_restrictions}
                        </span>
                      )}
                    </div>
                    {r.message && (
                      <div className="mt-3 p-3 rounded-lg" style={{ background: '#FAF4EC' }}>
                        <p className="text-sm font-sans-body flex items-start gap-2" style={{ color: '#6B5744' }}>
                          <MessageSquare className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#C9A96E' }} />
                          {r.message}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-sans-body" style={{ color: '#8B7355' }}>
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(r.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
