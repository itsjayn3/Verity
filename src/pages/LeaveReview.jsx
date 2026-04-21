// Structured review submission  
// Attributes -> Punctuality, Quality, Communication
// This will submit to the Supabase reviews table with reviewee_id & reviewer_id

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import Header from '../components/layout/Header';

const ATTRIBUTES = [
  {
    key: 'punctuality',
    label: 'Punctuality',
    icon: 'fa-solid fa-clock',
    desc: 'Did they show up on time and meet deadlines?',
    gradient: 'linear-gradient(135deg, #0047AB, #00D4FF)',
  },
  {
    key: 'quality',
    label: 'Quality',
    icon: 'fa-solid fa-star',
    desc: 'How good was the overall quality of their service?',
    gradient: 'linear-gradient(135deg, #6A0DAD, #C77DFF)',
  },
  {
    key: 'communication',
    label: 'Communication',
    icon: 'fa-solid fa-comment',
    desc: 'Were they responsive, clear, and easy to work with?',
    gradient: 'linear-gradient(135deg, #00B4D8, #0047AB)',
  },
];

// -------------------------star rating logic ----------------------------------------------------------------
function StarRating({ value, onChange, gradient }) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex items-center gap-2">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= (hovered || value);
        return (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            className="transition-all hover:scale-125 focus:outline-none"
          >
            <i
              className={`fa-${filled ? 'solid' : 'regular'} fa-star text-3xl transition-all`}
              style={
                filled
                  ? { filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.6))', color: 'white' }
                  : { color: 'rgba(255,255,255,0.2)' }
              }
            />
          </button>
        );
      })}
      {value > 0 && (
        <span className="text-white/60 text-sm ml-2">{value}.0</span>
      )}
    </div>
  );
}

// --------------page-----------------------------------------------------------------------------

export default function LeaveReview() {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [reviewee, setReviewee] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const [ratings, setRatings] = useState({
    punctuality: 0,
    quality: 0,
    communication: 0,
  });
  const [comment, setComment] = useState('');

  // -------------------- fetch reviewee profile + current user ------------------------------------------------------------------------------
  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, username, bio, avatar_url, verified_student')
        .eq('id', userId)
        .single();

      if (profileError || !profile) {
        setError('Profile not found.');
      } else {
        setReviewee(profile);
      }
      setLoading(false);
    };
    load();
  }, [userId]);

  // ------------ overall rating -------------------------------------------------------------------------
  const overallRating = () => {
    const vals = Object.values(ratings).filter((v) => v > 0);
    if (vals.length === 0) return 0;
    return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
  };

  const allRated = Object.values(ratings).every((v) => v > 0);

  //----------------submit review -----------------------------------------------------
  const handleSubmit = async () => {
    if (!allRated) {
      setError('Please rate all three attributes before submitting.');
      return;
    }
    if (!currentUser) {
      setError('You must be logged in to leave a review.');
      return;
    }
    if (currentUser.id === userId) {
      setError("You can't review yourself.");
      return;
    }

    setSubmitting(true);
    setError('');

    const { error: insertError } = await supabase.from('reviews').insert({
      reviewee_id: userId,
      reviewer_id: currentUser.id,
      punctuality_rating: ratings.punctuality,
      quality_rating: ratings.quality,
      communication_rating: ratings.communication,
      overall_rating: overallRating(),
      comment: comment.trim() || null,
    });

    if (insertError) {
      if (insertError.code === '23505') {
        setError("You've already reviewed this student.");
      } else {
        setError(insertError.message);
      }
      setSubmitting(false);
      return;
    }

    setSubmitted(true);
    setSubmitting(false);
  };

  
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

  // -------------- it worked ---------------------------------------------------------
  if (submitted) {
    return (
      <div className="min-h-screen"
        style={{ background: 'linear-gradient(135deg, #0047AB 0%, #6A0DAD 50%, #1E1E2E 100%)' }}>
        <Header />
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="text-center max-w-md">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl"
              style={{ background: 'linear-gradient(135deg, #0047AB, #6A0DAD)' }}
            >
              <i className="fa-solid fa-check text-white text-3xl" />
            </div>
            <h2 className="text-3xl text-white font-light mb-3">Review submitted!</h2>
            <p className="text-white/60 text-sm mb-8 leading-relaxed">
              Your structured review has been added to{' '}
              <span className="text-white font-medium">
                {reviewee?.username || 'this student'}
              </span>
              's Trust Profile.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => navigate(`/profile/${userId}`)}
                className="px-8 py-3 text-white rounded-full font-medium transition-all hover:scale-105 text-sm"
                style={{ background: 'linear-gradient(135deg, #0047AB, #6A0DAD)' }}
              >
                View Their Profile
              </button>
              <button
                onClick={() => navigate('/services')}
                className="px-8 py-3 text-white/70 rounded-full font-medium border border-white/20 hover:bg-white/10 transition-all text-sm"
              >
                Back to Feed
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-100">
      <Header />

      
      <section
        className="relative pt-24 pb-12 px-4 sm:px-6 lg:px-8"
        style={{
          background: 'linear-gradient(135deg, #0047AB 0%, #6A0DAD 50%, #1E1E2E 100%)',
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at top, rgba(255,255,255,0.05), transparent 50%)',
          }}
        />
        <div className="max-w-2xl mx-auto relative z-10 text-center">
          <p className="text-white/50 text-xs uppercase tracking-widest mb-4">
            Structured Review
          </p>
          <h1 className="text-3xl sm:text-4xl text-white font-light mb-6">
            Leave a Review
          </h1>

          {/* reviewee's profile */}
          {reviewee && (
            <div className="flex items-center justify-center gap-4">
              <img
                src={
                  reviewee.avatar_url ||
                  `https://api.dicebear.com/7.x/notionists/svg?scale=200&seed=${reviewee.id}`
                }
                alt={reviewee.username}
                className="w-14 h-14 rounded-full border-2 border-white/30 shadow-lg"
              />
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <span className="text-white font-medium">
                    @{reviewee.username}
                  </span>
                  {reviewee.verified_student && (
                    <div className="flex items-center gap-1 bg-green-500/20 border border-green-400/30 rounded-full px-2 py-0.5">
                      <i className="fa-solid fa-check text-green-400 text-[10px]" />
                      <span className="text-green-400 text-xs">Verified</span>
                    </div>
                  )}
                </div>
                <p className="text-white/50 text-xs mt-0.5">
                  Rate their punctuality, quality and communication
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ---- review form ----- */}
      <section
        className="py-12 px-4 sm:px-6 lg:px-8"
        style={{
          background: 'linear-gradient(to right, #690DAB 0%, #decfe8 100%)',
        }}
      >
        <div className="max-w-2xl mx-auto">
          <div className="bg-neutral-100 rounded-3xl shadow-2xl border border-neutral-300 p-8 sm:p-10">

            {/* error */}
            {error && (
              <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2">
                <i className="fa-solid fa-circle-exclamation text-red-500 text-sm mt-0.5 flex-shrink-0" />
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* attribute */}
            <div className="space-y-8 mb-8">
              {ATTRIBUTES.map(({ key, label, icon, desc, gradient }) => (
                <div key={key}>
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: gradient }}
                    >
                      <i className={`${icon} text-white text-sm`} />
                    </div>
                    <div>
                      <p className="text-neutral-700 font-semibold text-sm">{label}</p>
                      <p className="text-neutral-400 text-xs">{desc}</p>
                    </div>
                  </div>
                  <div className="mt-3 pl-12">
                    <StarRating
                      value={ratings[key]}
                      onChange={(val) => setRatings((prev) => ({ ...prev, [key]: val }))}
                      gradient={gradient}
                    />
                  </div>
                  <div className="mt-3 pl-12 h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${(ratings[key] / 5) * 100}%`,
                        background: gradient,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* overall score preview */}
            {allRated && (
              <div
                className="mb-8 p-4 rounded-2xl border border-white/20 text-center"
                style={{ background: 'linear-gradient(135deg, #0047AB, #6A0DAD)' }}
              >
                <p className="text-white/70 text-xs uppercase tracking-widest mb-1">
                  Overall Score
                </p>
                <p className="text-white text-4xl font-light">
                  {overallRating()}.0
                  <span className="text-white/40 text-lg"> / 5</span>
                </p>
                <p className="text-white/50 text-xs mt-1">
                  Averaged across all three attributes
                </p>
              </div>
            )}

            {/*comment */}
            <div className="mb-8">
              <label className="block text-neutral-700 font-semibold text-sm mb-2">
                Comment{' '}
                <span className="text-neutral-400 font-normal">(optional)</span>
              </label>
              <textarea
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value.slice(0, 300))}
                placeholder="Share any additional context about your experience..."
                className="w-full px-4 py-3 bg-white border border-neutral-300 rounded-xl text-neutral-700 placeholder-neutral-400 focus:outline-none focus:border-neutral-500 transition-all resize-none text-sm"
              />
              <div className="flex justify-between mt-1">
                <p className="text-neutral-400 text-xs">
                  Optional — ratings are the primary trust signal
                </p>
                <span className="text-neutral-400 text-xs">{comment.length}/300</span>
              </div>
            </div>

            {/* submit */}
            <button
              onClick={handleSubmit}
              disabled={submitting || !allRated}
              className="w-full py-4 text-white rounded-xl font-semibold transition-all text-sm"
              style={{
                background: allRated
                  ? 'linear-gradient(135deg, #0047AB, #6A0DAD)'
                  : '#d4d4d4',
                cursor: allRated ? 'pointer' : 'not-allowed',
              }}
            >
              {submitting ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin mr-2" />
                  Submitting...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-paper-plane mr-2" />
                  Submit Review
                </>
              )}
            </button>

            <p className="text-neutral-400 text-xs text-center mt-4">
              Reviews are tied to your verified Aston identity and cannot be anonymous
            </p>

          </div>
        </div>
      </section>
    </div>
  );
}