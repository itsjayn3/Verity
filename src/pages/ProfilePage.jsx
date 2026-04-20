// ProfilePage.jsx
// Public-facing profile view — the trust evaluation surface
// RQ1: Verification badge | RQ2: Trust Orb | RQ3: Structured reviews

import { useState } from 'react';
import Header from '../components/layout/Header';
import TrustOrb from '../components/profile/TrustOrb';
import ReviewCard from '../components/profile/ReviewCard';

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_PROFILE = {
  id: 'sarah-j',
  name: 'Sarah J.',
  username: 'sarahj_aston',
  avatarSeed: '5432',
  verified: true,
  course: 'Computer Science',
  year: '3rd Year',
  bio: [
    '💻 React & JavaScript Specialist',
    '🎓 CS @ Aston University',
    '📍 Library & Student Union',
    '⚡ One-on-one & Group Sessions',
  ],
  skills: ['React', 'JavaScript', 'Tutoring', 'Web Dev'],
  instagram: 'sarahj.codes',
  linkedin: 'sarah-j-aston',
  email: 's.johnson@aston.ac.uk',
};

const MOCK_REVIEWS = [
  {
    id: 1,
    reviewerName: 'James M.',
    reviewerSeed: '7821',
    punctuality: 5,
    quality: 5,
    communication: 4.5,
    comment:
      'Sarah helped me understand React hooks in just two sessions. She\'s patient, explains things clearly, and always shows up on time. Highly recommend!',
    createdAt: '2 days ago',
    verified: true,
  },
  {
    id: 2,
    reviewerName: 'Emily R.',
    reviewerSeed: '3492',
    punctuality: 4,
    quality: 4.5,
    communication: 4,
    comment:
      'Great tutor! She made JavaScript so much easier to understand. The library sessions were perfect for focused learning.',
    createdAt: '1 week ago',
    verified: true,
  },
  {
    id: 3,
    reviewerName: 'David K.',
    reviewerSeed: '9183',
    punctuality: 5,
    quality: 5,
    communication: 5,
    comment:
      "Best coding tutor I've had at Aston. Sarah knows her stuff and communicates really well. Worth every penny.",
    createdAt: '2 weeks ago',
    verified: true,
  },
  {
    id: 4,
    reviewerName: 'Sophie T.',
    reviewerSeed: '5647',
    punctuality: 4.5,
    quality: 5,
    communication: 4.5,
    comment:
      "Sarah's teaching style is perfect for visual learners. She uses real examples and always checks if you understand before moving on.",
    createdAt: '3 weeks ago',
    verified: true,
  },
];

const MOCK_PORTFOLIO = [
  { id: 1, label: 'React Project\nDashboard' },
  { id: 2, label: 'JavaScript\nCertificate' },
  { id: 3, label: 'Student\nPortfolio Site' },
  { id: 4, label: 'API Integration\nDemo' },
  { id: 5, label: 'Component\nLibrary' },
  { id: 6, label: 'Tutoring\nSession Notes' },
];

// ─── Aggregate scores ─────────────────────────────────────────────────────────
function aggregateScores(reviews) {
  if (!reviews.length) return { punctuality: 0, quality: 0, communication: 0 };
  const sum = reviews.reduce(
    (acc, r) => ({
      punctuality: acc.punctuality + r.punctuality,
      quality: acc.quality + r.quality,
      communication: acc.communication + r.communication,
    }),
    { punctuality: 0, quality: 0, communication: 0 }
  );
  return {
    punctuality: sum.punctuality / reviews.length,
    quality: sum.quality / reviews.length,
    communication: sum.communication / reviews.length,
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('reviews');
  const profile = MOCK_PROFILE;
  const reviews = MOCK_REVIEWS;
  const scores = aggregateScores(reviews);

  return (
    <div className="min-h-screen bg-neutral-100">
      <Header />

      {/* ── Hero: Identity & Contact ── */}
      <section
        className="relative pt-24 pb-16 px-4 sm:px-6 lg:px-8"
        style={{
          background: 'linear-gradient(135deg, #0047AB 0%, #6A0DAD 50%, #1E1E2E 100%)',
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at top, rgba(255,255,255,0.06), transparent 60%)',
          }}
        />
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="flex flex-col sm:flex-row items-start gap-8">

            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-white/30 shadow-2xl overflow-hidden"
                style={{ background: 'rgba(255,255,255,0.1)' }}>
                <img
                  src={`https://api.dicebear.com/7.x/notionists/svg?scale=200&seed=${profile.avatarSeed}`}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Identity */}
            <div className="flex-1 pt-2">
              {/* Name + Verified badge — RQ1 */}
              <div className="flex items-center gap-3 mb-3 flex-wrap">
                <h1 className="text-4xl sm:text-5xl text-white font-light tracking-wide">
                  {profile.name}
                </h1>
                {profile.verified && (
                  <div className="flex items-center gap-2 bg-white/15 border border-white/30 rounded-full px-4 py-1.5 backdrop-blur-sm">
                    <div className="w-5 h-5 bg-green-400 rounded-full flex items-center justify-center flex-shrink-0">
                      <i className="fa-solid fa-check text-white text-[10px]" />
                    </div>
                    <span className="text-white text-sm font-medium">
                      Verified Student
                    </span>
                  </div>
                )}
              </div>

              {/* Course + Year */}
              <p className="text-white/70 text-sm mb-4">
                {profile.course} · {profile.year}
              </p>

              {/* Bio lines */}
              <div className="space-y-1 mb-6">
                {profile.bio.map((line, i) => (
                  <p key={i} className="text-white/85 text-base leading-relaxed">
                    {line}
                  </p>
                ))}
              </div>

              {/* Skills tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {profile.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 text-white text-xs rounded-full border border-white/30"
                    style={{ background: 'rgba(255,255,255,0.1)' }}
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {/* Contact links */}
              <div>
                <p className="text-white/50 text-xs uppercase tracking-widest mb-3">
                  Where to find me
                </p>
                <div className="flex items-center gap-3">
                  {[
                    { icon: 'fa-brands fa-instagram', href: `https://instagram.com/${profile.instagram}`, label: 'Instagram' },
                    { icon: 'fa-brands fa-linkedin', href: `https://linkedin.com/in/${profile.linkedin}`, label: 'LinkedIn' },
                    { icon: 'fa-solid fa-envelope', href: `mailto:${profile.email}`, label: 'Email' },
                  ].map(({ icon, href, label }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={label}
                      className="w-12 h-12 rounded-full flex items-center justify-center border-2 border-neutral-300/60 hover:scale-110 hover:border-white transition-all"
                      style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)' }}
                    >
                      <i className={`${icon} text-white text-lg`} />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust Orb ── */}
      <section
        className="py-16 px-4 sm:px-6 lg:px-8"
        style={{
          background: 'linear-gradient(135deg, #1E1E2E 0%, #6A0DAD 100%)',
        }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-white/60 text-xs uppercase tracking-widest mb-2">
              Trust Dashboard
            </h2>
            <p className="text-white/40 text-sm">
              Aggregated from {reviews.length} structured reviews across 3 attributes
            </p>
          </div>
          <TrustOrb scores={scores} reviewCount={reviews.length} />
        </div>
      </section>

      {/* ── Reviews + Portfolio tabs ── */}
      <section
        className="py-12 px-4 sm:px-6 lg:px-8"
        style={{
          background: 'linear-gradient(to right, #690DAB 0%, #decfe8 100%)',
        }}
      >
        <div className="max-w-4xl mx-auto">

          {/* Tab switcher */}
          <div className="flex gap-4 mb-8">
            {['reviews', 'portfolio'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="px-6 py-2.5 rounded-full text-sm font-medium transition-all capitalize"
                style={
                  activeTab === tab
                    ? {
                        background: 'linear-gradient(135deg, #0047AB, #6A0DAD)',
                        color: 'white',
                      }
                    : {
                        background: 'rgba(255,255,255,0.6)',
                        color: '#404040',
                      }
                }
              >
                {tab === 'reviews' ? `Reviews (${reviews.length})` : 'Portfolio'}
              </button>
            ))}
          </div>

          {/* Reviews tab */}
          {activeTab === 'reviews' && (
            <div>
              <h2 className="text-white text-2xl font-light mb-6">
                What Students Say
              </h2>
              <div className="space-y-6">
                {reviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            </div>
          )}

          {/* Portfolio tab */}
          {activeTab === 'portfolio' && (
            <div>
              <h2 className="text-white text-2xl font-light mb-6">
                Portfolio
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {MOCK_PORTFOLIO.map((item) => (
                  <div
                    key={item.id}
                    className="aspect-square rounded-2xl flex items-center justify-center cursor-pointer border border-white/20 hover:border-white/60 transition-all hover:shadow-lg"
                    style={{
                      background: 'rgba(255,255,255,0.08)',
                      backdropFilter: 'blur(8px)',
                    }}
                  >
                    <span className="text-white/70 text-sm text-center px-4 whitespace-pre-line leading-relaxed">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </section>
    </div>
  );
}