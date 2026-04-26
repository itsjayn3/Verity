import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import Header from '../components/layout/Header';

const STEPS = [
  {
    key: 'punctuality',
    label: 'Punctuality',
    icon: 'fa-solid fa-clock',
    question: 'How was their punctuality?',
    subtext: 'Did they show up on time and meet deadlines?',
    gradient: 'linear-gradient(135deg, #0047AB, #00D4FF)',
  },
  {
    key: 'quality',
    label: 'Quality',
    icon: 'fa-solid fa-star',
    question: 'How was the quality of their service?',
    subtext: 'Was the work or service delivered to a good standard?',
    gradient: 'linear-gradient(135deg, #6A0DAD, #C77DFF)',
  },
  {
    key: 'communication',
    label: 'Communication',
    icon: 'fa-solid fa-comment',
    question: 'How was their communication?',
    subtext: 'Were they responsive, clear, and easy to work with?',
    gradient: 'linear-gradient(135deg, #00B4D8, #0047AB)',
  },
];



// star rating styling
function StarRating({ value, onChange }) {
  const [hovered, setHovered] = useState(0);
  const active = hovered || value;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            className="transition-all hover:scale-110 focus:outline-none"
          >
            <i
              className={`${star <= active ? 'fa-solid' : 'fa-regular'} fa-star text-5xl sm:text-6xl transition-all duration-150`}
              style={
                star <= active
                  ? {
                      color: '#FBBF24',
                      filter: 'drop-shadow(0 0 12px rgba(251,191,36,0.8))',
                    }
                  : { color: 'rgba(255,255,255,0.25)' }
              }
            />
          </button>
        ))}
      </div>

    </div>
  );
}

////////////////////////////////////////////////////////////////////////
export default function LeaveReview() {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [reviewee, setReviewee] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loadingPage, setLoadingPage] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  // review form state
  const [step, setStep] = useState(0); // 0-2 = attribute steps, 3 = comment, 4 = done
  const [ratings, setRatings] = useState({ punctuality: 0, quality: 0, communication: 0 });
  const [comment, setComment] = useState('');

  //loading 
  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, username, avatar_url, verified_student')
        .eq('id', userId)
        .single();

      if (profileError || !profile) {
        setError('Profile not found.');
      } else {
        setReviewee(profile);
      }
      setLoadingPage(false);
    };
    load();
  }, [userId]);

  const overallRating = () => {
    const vals = Object.values(ratings);
    return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
  };

  //go to next q
  const handleNext = () => {
    const currentKey = STEPS[step]?.key;
    if (ratings[currentKey] === 0) return; // must rate before continuing
    setStep((s) => s + 1);
  };

  //submit button
  const handleSubmit = async () => {
    if (!currentUser) { setError('You must be logged in.'); return; }
    if (currentUser.id === userId) { setError("You can't review yourself."); return; }

    setSubmitting(true);

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

  // loading
  if (loadingPage) {
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

  // submitted successfully
  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4"
        style={{ background: 'linear-gradient(135deg, #0047AB 0%, #6A0DAD 50%, #1E1E2E 100%)' }}>
        <div className="text-center max-w-md">
          <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl"
            style={{ background: 'linear-gradient(135deg, #0047AB, #6A0DAD)' }}>
            <i className="fa-solid fa-check text-white text-4xl" />
          </div>
          <h2 className="text-4xl text-white font-light mb-3">Done!</h2>
          <p className="text-white/60 text-sm mb-2 leading-relaxed">
            Your review has been added to{' '}
            <span className="text-white font-medium">@{reviewee?.username}</span>'s Trust Profile.
          </p>
          <p className="text-white/40 text-xs mb-10">
            Thank you for helping build a more trustworthy campus community.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={() => navigate(`/profile/${userId}`)}
              className="px-8 py-3 text-white rounded-full font-medium hover:scale-105 transition-all text-sm"
              style={{ background: 'linear-gradient(135deg, #0047AB, #6A0DAD)' }}>
              View Their Profile
            </button>
            <button onClick={() => navigate('/services')}
              className="px-8 py-3 text-white/70 rounded-full border border-white/20 hover:bg-white/10 transition-all text-sm">
              Back to Feed
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isAttributeStep = step < STEPS.length;
  const isCommentStep = step === STEPS.length;
  const currentStep = isAttributeStep ? STEPS[step] : null;
  const currentRating = isAttributeStep ? ratings[currentStep.key] : 0;

  return (
    <div className="min-h-screen"
      style={{ background: 'linear-gradient(135deg, #0047AB 0%, #6A0DAD 50%, #1E1E2E 100%)' }}>
      <Header />

      <div className="min-h-screen flex flex-col items-center justify-center px-4 pt-20 pb-12">
        <div className="w-full max-w-lg">

          {/* reviewee's name  */}
          {reviewee && (
            <div className="flex items-center justify-center gap-3 mb-10">
              <img
                src={reviewee.avatar_url || `https://api.dicebear.com/7.x/notionists/svg?scale=200&seed=${reviewee.id}`}
                alt={reviewee.username}
                className="w-10 h-10 rounded-full border-2 border-white/30"
              />
              <div className="flex items-center gap-2">
                <span className="text-white font-medium text-sm">@{reviewee.username}</span>
                {reviewee.verified_student && (
                  <span className="flex items-center gap-1 bg-green-500/20 border border-green-400/30 rounded-full px-2 py-0.5">
                    <i className="fa-solid fa-check text-green-400 text-[10px]" />
                    <span className="text-green-400 text-xs">Verified</span>
                  </span>
                )}
              </div>
            </div>
          )}

          {/* error message */}
          {error && (
            <div className="mb-6 p-3 bg-red-500/10 border border-red-400/30 rounded-xl flex items-start gap-2">
              <i className="fa-solid fa-circle-exclamation text-red-400 text-sm mt-0.5 flex-shrink-0" />
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          {/* attributes */}
          {isAttributeStep && currentStep && (
            <div className="text-center">
              {/* svg icon */}
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-xl"
                style={{ background: currentStep.gradient }}>
                <i className={`${currentStep.icon} text-white text-3xl`} />
              </div>

              {/* question */}
              <h2 className="text-3xl sm:text-4xl text-white font-light mb-3">
                {currentStep.question}
              </h2>
              <p className="text-white/50 text-sm mb-12">{currentStep.subtext}</p>

              {/* star system  */}
              <div className="mb-12">
                <StarRating
                  value={currentRating}
                  onChange={(val) => setRatings((prev) => ({ ...prev, [currentStep.key]: val }))}
                />
              </div>

              {/* next button */}
              <button
                onClick={handleNext}
                disabled={currentRating === 0}
                className="w-full py-4 text-white rounded-2xl font-medium text-lg transition-all"
                style={{
                  background: currentRating > 0
                    ? currentStep.gradient
                    : 'rgba(255,255,255,0.1)',
                  cursor: currentRating > 0 ? 'pointer' : 'not-allowed',
                  opacity: currentRating > 0 ? 1 : 0.5,
                }}
              >
                {step < STEPS.length - 1 ? 'Next' : 'Continue'}
              </button>
            </div>
          )}

          {/*optional comment */}
          {isCommentStep && (
            <div className="text-center">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-xl"
                style={{ background: 'linear-gradient(135deg, #0047AB, #6A0DAD)' }}>
                <i className="fa-solid fa-pen text-white text-3xl" />
              </div>

              <h2 className="text-3xl sm:text-4xl text-white font-light mb-3">
                Want to add anything?
              </h2>
              <p className="text-white/50 text-sm mb-2">
                No worries if not — your star ratings are the main trust signal.
              </p>
              <p className="text-white/35 text-xs mb-8">
                If you'd like to share any context about your experience, you can do so here.
              </p>

              <textarea
                rows={5}
                value={comment}
                onChange={(e) => setComment(e.target.value.slice(0, 300))}
                placeholder="Share any additional context... (optional)"
                className="w-full px-5 py-4 rounded-2xl text-white placeholder-white/30 focus:outline-none resize-none text-sm mb-2 border border-white/15"
                style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)' }}
              />
              <div className="text-right mb-8">
                <span className="text-white/30 text-xs">{comment.length}/300</span>
              </div>

              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full py-4 text-white rounded-2xl font-medium text-lg transition-all mb-3"
                style={{ background: 'linear-gradient(135deg, #0047AB, #6A0DAD)' }}
              >
                {submitting ? (
                  <><i className="fa-solid fa-spinner fa-spin mr-2" />Submitting...</>
                ) : (
                  <><i className="fa-solid fa-paper-plane mr-2" />Submit Review</>
                )}
              </button>

              <button
                onClick={() => setStep((s) => s - 1)}
                className="text-white/40 text-sm hover:text-white/70 transition-colors"
              >
                ← Back
              </button>
            </div>
          )}

          {/* pagination below steps */}
          <div className="flex items-center justify-center gap-3 mt-10">
            {[...STEPS, { key: 'comment' }].map((s, i) => (
              <div
                key={s.key}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === step ? '24px' : '8px',
                  height: '8px',
                  background: i === step
                    ? 'white'
                    : i < step
                    ? 'rgba(255,255,255,0.5)'
                    : 'rgba(255,255,255,0.2)',
                }}
              />
            ))}
          </div>
          <p className="text-white/30 text-xs text-center mt-3">
            {isAttributeStep ? `${step + 1} of ${STEPS.length}` : 'Almost done'}
          </p>

        </div>
      </div>
    </div>
  );
}