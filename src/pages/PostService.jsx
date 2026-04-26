// PostService.jsx
// Authenticated users post a new service to the Campus Feed
// Saves to Supabase services table with provider_id, zone, category etc.

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import Header from '../components/layout/Header';

const CATEGORIES = [
  'Tutoring', 'Design', 'Photography', 'Coding', 'Hair & Braiding',
  'Nails', 'Makeup', 'Fitness & PT', 'Music Lessons', 'Language Exchange',
  'CV & Interview Prep', 'Essay Editing', 'Video Editing', 'Cooking',
  'Illustration', 'Translation', 'Other',
];

const ZONES = [
  { value: 'Public Zones', label: '🏛️ Public Zones', desc: 'Library, Student Union, campus buildings' },
  { value: 'Student Living', label: '🏠 Student Living', desc: 'Halls, student accommodation areas' },
  { value: 'Remote/Digital', label: '🌐 Remote/Digital', desc: 'Online, Zoom, Discord etc.' },
];

export default function PostService() {
  const navigate = useNavigate();

  const [userId, setUserId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Form fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [price, setPrice] = useState('');
  const [isFree, setIsFree] = useState(false);
  const [zone, setZone] = useState('');
  const [location, setLocation] = useState('');

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setUserId(user.id);
    };
    getUser();
  }, []);

  const handleSubmit = async () => {
    setError('');

    if (!title.trim()) { setError('Please enter a service title.'); return; }
    if (!description.trim()) { setError('Please enter a description.'); return; }
    if (!category) { setError('Please select a category.'); return; }
    if (!zone) { setError('Please select a service zone.'); return; }
    if (!userId) { setError('Not authenticated.'); return; }

    setSaving(true);

    const finalCategory = category === 'Other' ? customCategory.trim() : category;
    const finalPrice = isFree ? 'Free' : price.trim() ? `£${price.trim()}` : null;

    const { error: insertError } = await supabase
      .from('services')
      .insert({
        provider_id: userId,
        title: title.trim(),
        description: description.trim(),
        category: finalCategory,
        price: finalPrice,
        zone,
        location: location.trim() || null,
      });

    if (insertError) {
      setError(insertError.message);
      setSaving(false);
      return;
    }

    navigate('/services');
  };

  return (
    <div className="min-h-screen bg-neutral-100">
      <Header />

      {/* ── Hero ── */}
      <section
        className="relative pt-24 pb-12 px-4 sm:px-6 lg:px-8"
        style={{ background: 'linear-gradient(135deg, #0047AB 0%, #6A0DAD 50%, #1E1E2E 100%)' }}
      >
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at top, rgba(255,255,255,0.05), transparent 50%)' }} />
        <div className="max-w-3xl mx-auto relative z-10 text-center">
          <p className="text-white/50 text-xs uppercase tracking-widest mb-3">Campus Feed</p>
          <h1 className="text-4xl text-white font-light tracking-wide mb-2">Post a Service</h1>
          <p className="text-white/60 text-sm">
            Share what you're offering with the verified Aston community
          </p>
        </div>
      </section>

      {/* ── Form ── */}
      <section
        className="py-12 px-4 sm:px-6 lg:px-8"
        style={{ background: 'linear-gradient(to right, #690DAB 0%, #decfe8 100%)' }}
      >
        <div className="max-w-3xl mx-auto">
          <div className="bg-neutral-100 rounded-3xl shadow-2xl border border-neutral-300 p-8 sm:p-10">

            {error && (
              <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2">
                <i className="fa-solid fa-circle-exclamation text-red-500 text-sm mt-0.5 flex-shrink-0" />
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* ── Title ── */}
            <div className="mb-6">
              <label className="block text-neutral-700 font-semibold text-sm mb-2">
                Service Title <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value.slice(0, 80))}
                placeholder="e.g. One-on-one Calculus Tutoring"
                className="w-full px-4 py-3 bg-white border border-neutral-300 rounded-xl text-neutral-700 placeholder-neutral-400 focus:outline-none focus:border-neutral-500 transition-all text-sm"
              />
              <div className="flex justify-end mt-1">
                <span className="text-neutral-400 text-xs">{title.length}/80</span>
              </div>
            </div>

            {/* ── Description ── */}
            <div className="mb-6">
              <label className="block text-neutral-700 font-semibold text-sm mb-2">
                Description <span className="text-red-400">*</span>
              </label>
              <textarea
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value.slice(0, 500))}
                placeholder="Describe your service, what's included, your experience, availability..."
                className="w-full px-4 py-3 bg-white border border-neutral-300 rounded-xl text-neutral-700 placeholder-neutral-400 focus:outline-none focus:border-neutral-500 transition-all text-sm resize-none"
              />
              <div className="flex justify-between mt-1">
                <p className="text-neutral-400 text-xs">Be clear and specific to attract the right students</p>
                <span className="text-neutral-400 text-xs">{description.length}/500</span>
              </div>
            </div>

            {/* ── Category ── */}
            <div className="mb-6">
              <label className="block text-neutral-700 font-semibold text-sm mb-2">
                Category <span className="text-red-400">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className="px-4 py-2 rounded-full text-sm transition-all border"
                    style={category === cat
                      ? { background: 'linear-gradient(135deg, #0047AB, #6A0DAD)', color: 'white', borderColor: 'transparent' }
                      : { background: 'white', color: '#404040', borderColor: '#d4d4d4' }
                    }
                  >
                    {cat}
                  </button>
                ))}
              </div>
              {category === 'Other' && (
                <input
                  type="text"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  placeholder="Describe your category..."
                  className="mt-3 w-full px-4 py-3 bg-white border border-neutral-300 rounded-xl text-neutral-700 placeholder-neutral-400 focus:outline-none focus:border-neutral-500 transition-all text-sm"
                />
              )}
            </div>

            {/* ── Zone ── */}
            <div className="mb-6">
              <label className="block text-neutral-700 font-semibold text-sm mb-2">
                Service Location <span className="text-red-400">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {ZONES.map(({ value, label, desc }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setZone(value)}
                    className="p-4 rounded-2xl text-left border transition-all"
                    style={zone === value
                      ? { background: 'linear-gradient(135deg, #0047AB, #6A0DAD)', borderColor: 'transparent' }
                      : { background: 'white', borderColor: '#d4d4d4' }
                    }
                  >
                    <p className={`font-medium text-sm mb-1 ${zone === value ? 'text-white' : 'text-neutral-700'}`}>
                      {label}
                    </p>
                    <p className={`text-xs leading-relaxed ${zone === value ? 'text-white/70' : 'text-neutral-400'}`}>
                      {desc}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* ── Specific Location ── */}
            <div className="mb-6">
              <label className="block text-neutral-700 font-semibold text-sm mb-2">
                Specific Location <span className="text-neutral-400 font-normal">(optional)</span>
              </label>
              <div className="relative">
                <i className="fa-solid fa-map-pin absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Library Floor 2, Main Building Room 101..."
                  className="w-full pl-12 pr-4 py-3 bg-white border border-neutral-300 rounded-xl text-neutral-700 placeholder-neutral-400 focus:outline-none focus:border-neutral-500 transition-all text-sm"
                />
              </div>
            </div>

            {/* ── Price ── */}
            <div className="mb-8">
              <label className="block text-neutral-700 font-semibold text-sm mb-2">
                Price <span className="text-neutral-400 font-normal">(optional)</span>
              </label>

              {/* Free toggle */}
              <label className="flex items-center gap-3 mb-3 cursor-pointer">
                <div
                  onClick={() => { setIsFree(!isFree); setPrice(''); }}
                  className="w-10 h-6 rounded-full transition-all relative cursor-pointer"
                  style={{ background: isFree ? 'linear-gradient(135deg, #0047AB, #6A0DAD)' : '#d4d4d4' }}
                >
                  <div
                    className="w-4 h-4 bg-white rounded-full absolute top-1 transition-all"
                    style={{ left: isFree ? '22px' : '4px' }}
                  />
                </div>
                <span className="text-neutral-600 text-sm">This service is free</span>
              </label>

              {!isFree && (
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 font-medium">£</span>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0.00"
                    min="0"
                    step="0.50"
                    className="w-full pl-10 pr-4 py-3 bg-white border border-neutral-300 rounded-xl text-neutral-700 placeholder-neutral-400 focus:outline-none focus:border-neutral-500 transition-all text-sm"
                  />
                </div>
              )}
            </div>

            {/* ── Submit ── */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleSubmit}
                disabled={saving}
                className="flex-1 py-4 text-white rounded-xl font-semibold transition-all text-sm"
                style={{
                  background: saving ? '#a3a3a3' : 'linear-gradient(135deg, #0047AB, #6A0DAD)',
                  cursor: saving ? 'not-allowed' : 'pointer',
                }}
              >
                {saving
                  ? <><i className="fa-solid fa-spinner fa-spin mr-2" />Posting...</>
                  : <><i className="fa-solid fa-paper-plane mr-2" />Post Service</>
                }
              </button>
              <button
                onClick={() => navigate('/services')}
                className="px-8 py-4 bg-white border border-neutral-200 text-neutral-600 rounded-xl text-sm hover:bg-neutral-50 transition-all"
              >
                Cancel
              </button>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
