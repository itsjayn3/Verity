// ProfilePage.jsx
// Public-facing profile — loads real data from Supabase
// RQ1: Verified badge | RQ2: Trust Orb | RQ3: Structured reviews

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import Header from '../components/layout/Header';
import TrustOrb from '../components/profile/TrustOrb';
import ReviewCard from '../components/profile/ReviewCard';

// ── Aggregate scores from real reviews ───────────────────────────────────────
function aggregateScores(reviews) {
  if (!reviews.length) return { punctuality: 0, quality: 0, communication: 0 };
  const sum = reviews.reduce(
    (acc, r) => ({
      punctuality: acc.punctuality + (r.punctuality_rating || 0),
      quality: acc.quality + (r.quality_rating || 0),
      communication: acc.communication + (r.communication_rating || 0),
    }),
    { punctuality: 0, quality: 0, communication: 0 }
  );
  return {
    punctuality: sum.punctuality / reviews.length,
    quality: sum.quality / reviews.length,
    communication: sum.communication / reviews.length,
  };
}

export default function ProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('reviews');

  useEffect(() => {
    const load = async () => {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setCurrentUserId(user.id);

      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();

      if (profileError || !profileData) {
        setLoading(false);
        return;
      }
      setProfile(profileData);

      // Fetch reviews for this profile
      const { data: reviewsData } = await supabase
        .from('reviews')
        .select('*, reviewer:reviewer_id(username, avatar_url, verified_student)')
        .eq('reviewee_id', id)
        .order('created_at', { ascending: false });

      setReviews(reviewsData || []);
      setLoading(false);
    };
    load();
  }, [id]);

  // ── Loading ──
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #0047AB 0%, #6A0DAD 50%, #1E1E2E 100%)' }}>
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-white/20 border-t-white animate-spin mx-auto mb-4" />
          <p className="text-white/60 text-sm tracking-widest uppercase">Loading</p>
        </div>
      </div>
    );
  }

  // ── Not found ──
  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #0047AB 0%, #6A0DAD 50%, #1E1E2E 100%)' }}>
        <div className="text-center">
          <i className="fa-solid fa-user-slash text-white/30 text-5xl mb-4 block" />
          <p className="text-white/60 text-lg mb-4">Profile not found</p>
          <button onClick={() => navigate('/services')}
            className="px-6 py-2 text-white rounded-full border border-white/30 hover:bg-white/10 transition-all text-sm">
            Back to Feed
          </button>
        </div>
      </div>
    );
  }

  const scores = aggregateScores(reviews);
  const isOwnProfile = currentUserId === id;
  const skills = Array.isArray(profile.skills) ? profile.skills : [];

  return (
    <div className="min-h-screen bg-neutral-100">
      <Header />

      {/* ── Hero: Identity & Contact ── */}
      <section
        className="relative pt-24 pb-16 px-4 sm:px-6 lg:px-8"
        style={{ background: 'linear-gradient(135deg, #0047AB 0%, #6A0DAD 50%, #1E1E2E 100%)' }}
      >
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at top, rgba(255,255,255,0.06), transparent 60%)' }} />

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="flex flex-col sm:flex-row items-start gap-8">

            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-white/30 shadow-2xl overflow-hidden"
                style={{ background: 'rgba(255,255,255,0.1)' }}>
                <img
                  src={profile.avatar_url || `https://api.dicebear.com/7.x/notionists/svg?scale=200&seed=${profile.id}`}
                  alt={profile.username}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Identity */}
            <div className="flex-1 pt-2">

              {/* Name + Verified badge — RQ1 */}
              <div className="flex items-center gap-3 mb-3 flex-wrap">
                <h1 className="text-4xl sm:text-5xl text-white font-light tracking-wide">
                  {profile.full_name || `@${profile.username}`}
                </h1>
                {profile.verified_student && (
                  <div className="flex items-center gap-2 bg-white/15 border border-white/30 rounded-full px-4 py-1.5 backdrop-blur-sm">
                    <div className="w-5 h-5 bg-green-400 rounded-full flex items-center justify-center flex-shrink-0">
                      <i className="fa-solid fa-check text-white text-[10px]" />
                    </div>
                    <span className="text-white text-sm font-medium">Verified Student</span>
                  </div>
                )}
              </div>

              {/* Username */}
              <p className="text-white/50 text-sm mb-2">@{profile.username}</p>

              {/* Course + Year */}
              {(profile.course || profile.year) && (
                <p className="text-white/70 text-sm mb-4">
                  {[profile.course, profile.year].filter(Boolean).join(' · ')}
                </p>
              )}

              {/* Bio */}
              {profile.bio && profile.bio.trim() && (
                <p className="text-white/85 text-base leading-relaxed mb-6">
                  {profile.bio}
                </p>
              )}

              {/* Skills */}
              {skills.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {skills.map((skill) => (
                    <span key={skill}
                      className="px-3 py-1 text-white text-xs rounded-full border border-white/30"
                      style={{ background: 'rgba(255,255,255,0.1)' }}>
                      {skill}
                    </span>
                  ))}
                </div>
              )}

              {/* Contact links */}
              {(profile.instagram || profile.linkedin) && (
                <div>
                  <p className="text-white/50 text-xs uppercase tracking-widest mb-3">
                    Where to connect
                  </p>
                  <div className="flex items-center gap-3 flex-wrap">
                    {profile.instagram && (
                      <a href={`https://instagram.com/${profile.instagram}`}
                        target="_blank" rel="noopener noreferrer" title="Instagram"
                        className="w-12 h-12 rounded-full flex items-center justify-center border-2 border-neutral-300/60 hover:scale-110 hover:border-white transition-all"
                        style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)' }}>
                        <i className="fa-brands fa-instagram text-white text-lg" />
                      </a>
                    )}
                    {profile.linkedin && (
                      <a href={`https://linkedin.com/in/${profile.linkedin}`}
                        target="_blank" rel="noopener noreferrer" title="LinkedIn"
                        className="w-12 h-12 rounded-full flex items-center justify-center border-2 border-neutral-300/60 hover:scale-110 hover:border-white transition-all"
                        style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)' }}>
                        <i className="fa-brands fa-linkedin text-white text-lg" />
                      </a>
                    )}
                    <a href={`mailto:${profile.id}@aston.ac.uk`}
                      title="Email"
                      className="w-12 h-12 rounded-full flex items-center justify-center border-2 border-neutral-300/60 hover:scale-110 hover:border-white transition-all"
                      style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)' }}>
                      <i className="fa-solid fa-envelope text-white text-lg" />
                    </a>
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex items-center gap-3 mt-6 flex-wrap">
                {isOwnProfile ? (
                  <button onClick={() => navigate('/settings')}
                    className="px-6 py-3 text-white text-sm rounded-full font-medium hover:scale-105 transition-all border border-white/30 hover:bg-white/10">
                    <i className="fa-solid fa-gear mr-2" />Edit Profile
                  </button>
                ) : (
                  <button onClick={() => navigate(`/review/${profile.id}`)}
                    className="px-6 py-3 text-white text-sm rounded-full font-medium hover:scale-105 transition-all"
                    style={{ background: 'linear-gradient(135deg, #0047AB, #6A0DAD)' }}>
                    <i className="fa-solid fa-star mr-2" />Leave a Review
                  </button>
                )}
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ── Trust Orb — RQ2 ── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8"
        style={{ background: 'linear-gradient(135deg, #1E1E2E 0%, #6A0DAD 100%)' }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-white/60 text-xs uppercase tracking-widest mb-2">Trust Dashboard</h2>
            <p className="text-white/40 text-sm">
              Aggregated from {reviews.length} structured review{reviews.length !== 1 ? 's' : ''} across 3 attributes
            </p>
          </div>
          <TrustOrb scores={scores} reviewCount={reviews.length} />
        </div>
      </section>

      {/* ── Reviews & Portfolio Tabs ── */}
      <section className="py-12 px-4 sm:px-6 lg:px-8"
        style={{ background: 'linear-gradient(to right, #690DAB 0%, #decfe8 100%)' }}>
        <div className="max-w-4xl mx-auto">

          <div className="flex gap-4 mb-8">
            {['reviews', 'portfolio'].map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className="px-6 py-2.5 rounded-full text-sm font-medium transition-all capitalize"
                style={activeTab === tab
                  ? { background: 'linear-gradient(135deg, #0047AB, #6A0DAD)', color: 'white' }
                  : { background: 'rgba(255,255,255,0.6)', color: '#404040' }}>
                {tab === 'reviews' ? `Reviews (${reviews.length})` : 'Portfolio'}
              </button>
            ))}
          </div>

          {/* Reviews tab — RQ3 */}
          {activeTab === 'reviews' && (
            <div>
              <h2 className="text-white text-2xl font-light mb-6">What Students Say</h2>
              {reviews.length === 0 ? (
                <div className="text-center py-12">
                  <i className="fa-solid fa-star text-white/20 text-4xl mb-3 block" />
                  <p className="text-white/50 text-sm">No reviews yet.</p>
                  {!isOwnProfile && (
                    <button onClick={() => navigate(`/review/${profile.id}`)}
                      className="mt-4 px-6 py-2 text-white text-sm rounded-full border border-white/30 hover:bg-white/10 transition-all">
                      Be the first to leave a review
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <ReviewCard key={review.id} review={{
                      reviewerName: review.reviewer?.username || 'Anonymous',
                      reviewerSeed: review.reviewer_id,
                      avatarUrl: review.reviewer?.avatar_url,
                      punctuality: review.punctuality_rating,
                      quality: review.quality_rating,
                      communication: review.communication_rating,
                      comment: review.comment,
                      createdAt: new Date(review.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
                      verified: review.reviewer?.verified_student,
                    }} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Portfolio tab */}
          {activeTab === 'portfolio' && (
            <div>
              <h2 className="text-white text-2xl font-light mb-6">Portfolio</h2>
              <div className="text-center py-12">
                <i className="fa-solid fa-images text-white/20 text-4xl mb-3 block" />
                <p className="text-white/50 text-sm">No portfolio items yet.</p>
              </div>
            </div>
          )}

        </div>
      </section>
    </div>
  );
}