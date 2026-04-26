import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import Header from '../components/layout/Header';
import TrustOrb from '../components/profile/TrustOrb';
import ReviewCard from '../components/profile/ReviewCard';

//  scores from reviews
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
  const [services, setServices] = useState([]);
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [expandedImage, setExpandedImage] = useState(null);

  useEffect(() => {
    const load = async () => {
      //  current user
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setCurrentUserId(user.id);

      // fetch the profile
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

      // fetch reviews
      const { data: reviewsData } = await supabase
        .from('reviews')
        .select('*, reviewer:reviewer_id(username, avatar_url, verified_student)')
        .eq('reviewee_id', id)
        .order('created_at', { ascending: false });

      setReviews(reviewsData || []);
      // fetch their services 
        const { data: servicesData } = await supabase
        .from('services')
        .select('*')
        .eq('provider_id', id)
        .order('created_at', { ascending: false });
        setServices(servicesData || []);

        // fetch portfolio 
        const { data: portfolioData } = await supabase
        .from('portfolio_items')
        .select('*')
        .eq('profile_id', id)
        .order('created_at', { ascending: false });
        setPortfolioItems(portfolioData || []);
            setLoading(false);
            };
            load();
        }, [id]);

// a loading screen
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
      <section
        className="relative pt-24 pb-16 px-4 sm:px-6 lg:px-8"
        style={{ background: 'linear-gradient(135deg, #0047AB 0%, #6A0DAD 50%, #1E1E2E 100%)' }}
      >
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at top, rgba(255,255,255,0.06), transparent 60%)' }} />

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="flex flex-col sm:flex-row items-start gap-8">

            {/* avatar/icon */}
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

            {/* person */}
            <div className="flex-1 pt-2">

              {/* Name + verified badge */}
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

              {/* username */}
              <p className="text-white/50 text-sm mb-2">@{profile.username}</p>

              {/* course + year */}
              {(profile.course || profile.year) && (
                <p className="text-white/70 text-sm mb-4">
                  {[profile.course, profile.year].filter(Boolean).join(' · ')}
                </p>
              )}

              {/* bio */}
              {profile.bio && profile.bio.trim() && (
                <p className="text-white/85 text-base leading-relaxed mb-6">
                  {profile.bio}
                </p>
              )}

              {/* skills tag section */}
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

              {/* media links */}
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

              {/*  buttons */}
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

      {/*Trust Orb */}
      <section className="py-16 px-4 sm:px-6 lg:px-8"
        style={{ background: 'linear-gradient(135deg, #1E1E2E 0%, #6A0DAD 100%)' }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-white/60 text-xs uppercase tracking-widest mb-2">Trust Dashboard</h2>
            <p className="text-white/40 text-sm">
              Aggregated across our attributes
            </p>
          </div>
          <TrustOrb scores={scores} reviewCount={reviews.length} />
        </div>
      </section>

      {/* the reviews & portfolio sections*/}
      <section className="py-12 px-4 sm:px-6 lg:px-8"
        style={{ background: 'linear-gradient(to right, #690DAB 0%, #decfe8 100%)' }}>
        <div className="max-w-4xl mx-auto">

          <div className="flex gap-4 mb-8">
            {['reviews', 'services', 'portfolio'].map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className="px-6 py-2.5 rounded-full text-sm font-medium transition-all capitalize"
                style={activeTab === tab
                  ? { background: 'linear-gradient(135deg, #0047AB, #6A0DAD)', color: 'white' }
                  : { background: 'rgba(255,255,255,0.6)', color: '#404040' }}>
               {tab === 'reviews' ? `Reviews (${reviews.length})`
                : tab === 'services' ? `Services (${services.length})`
                : 'Portfolio'}
              </button>
            ))}
          </div>
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

          {/* services tab */}


    {activeTab === 'services' && (
        <div>
            <h2 className="text-white text-2xl font-light mb-6">Services Offered</h2>
            {services.length === 0 ? (
            <div className="text-center py-12">
                <i className="fa-solid fa-briefcase text-white/20 text-4xl mb-3 block" />
                <p className="text-white/50 text-sm">No services posted yet.</p>
                {isOwnProfile && (
                <button onClick={() => navigate('/post-service')}
                    className="mt-4 px-6 py-2 text-white text-sm rounded-full border border-white/30 hover:bg-white/10 transition-all">
                    Post your first service
                </button>
                )}
            </div>
            ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {services.map((service) => (
                <div key={service.id}
                    className="bg-neutral-100 rounded-2xl p-5 border border-neutral-300 hover:shadow-lg transition-all">
                    <div className="flex items-start justify-between mb-2">
                    <h3 className="text-neutral-700 font-medium text-sm">{service.title}</h3>
                    {service.price && (
                        <span className="text-neutral-500 text-xs font-medium ml-2 flex-shrink-0">
                        {service.price}
                        </span>
                    )}
                    </div>
                    <p className="text-neutral-500 text-xs leading-relaxed mb-3 line-clamp-2">
                    {service.description}
                    </p>
                    <div className="flex items-center gap-2 flex-wrap">
                    {service.category && (
                        <span className="px-2 py-0.5 bg-white border border-neutral-200 text-neutral-500 text-xs rounded-full">
                        {service.category}
                        </span>
                    )}
                    {service.zone && (
                        <span className="px-2 py-0.5 bg-white border border-neutral-200 text-neutral-500 text-xs rounded-full">
                        {service.zone}
                        </span>
                    )}
                    </div>
                    {service.location && (
                    <p className="text-neutral-400 text-xs mt-2">
                        <i className="fa-solid fa-map-pin mr-1" />{service.location}
                    </p>
                    )}
                </div>
                ))}
            </div>
            )}
        </div>
    )}

{/* portfolio tab */}


        {activeTab === 'portfolio' && (
        <div>
            <h2 className="text-white text-2xl font-light mb-6">Portfolio</h2>
            {portfolioItems.length === 0 ? (
            <div className="text-center py-12">
                <i className="fa-solid fa-images text-white/20 text-4xl mb-3 block" />
                <p className="text-white/50 text-sm">No portfolio items yet.</p>
                {isOwnProfile && (
                <button onClick={() => navigate('/settings')}
                    className="mt-4 px-6 py-2 text-white text-sm rounded-full border border-white/30 hover:bg-white/10 transition-all">
                    Add portfolio photos in Settings
                </button>
                )}
            </div>
            ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              
{portfolioItems.map((item) => (
  <div key={item.id}
    onClick={() => setExpandedImage(item.image_url)}
    className="aspect-square rounded-2xl overflow-hidden border border-neutral-300 hover:shadow-lg transition-all cursor-pointer">
    <img src={item.image_url} alt="Portfolio"
      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
  </div>
))}

{/* expanding the image */}
{expandedImage && (
  <div
    onClick={() => setExpandedImage(null)}
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm cursor-pointer">
    <img src={expandedImage} alt="Expanded"
      className="max-w-3xl max-h-[90vh] rounded-2xl shadow-2xl object-contain" />
    <button className="absolute top-6 right-6 text-white text-2xl">
      <i className="fa-solid fa-xmark" />
    </button>
  </div>
)}
            </div>
            )}
        </div>
        )}

                </div>
            </section>
            </div>
        );
}