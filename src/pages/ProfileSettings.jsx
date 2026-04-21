// ProfileSettings.jsx
// Authenticated user edits their own profile
// Pulls real data from Supabase profiles table
// Saves updates back to Supabase

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import Header from '../components/layout/Header';
import TrustOrb from '../components/profile/TrustOrb';
import heic2any from 'heic2any';

const YEAR_OPTIONS = ['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year', 'Postgrad'];

const SUGGESTED_SKILLS = [
  'Tutoring', 'Design', 'Photography', 'Coding', 'Hair & Braiding',
  'Nails', 'Makeup', 'Fitness & PT', 'Music Lessons', 'Language Exchange',
  'CV & Interview Prep', 'Essay Editing', 'Video Editing', 'Cooking',
  'Illustration', 'Translation',
];

const SKILL_GRADIENTS = [
  'linear-gradient(135deg, #0047AB, #00D4FF)',
  'linear-gradient(135deg, #6A0DAD, #C77DFF)',
  'linear-gradient(135deg, #00B4D8, #0077B6)',
  'linear-gradient(135deg, #0047AB, #6A0DAD)',
];

export default function ProfileSettings() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [reviewCount, setReviewCount] = useState(0);
  const [trustScores, setTrustScores] = useState({ punctuality: 0, quality: 0, communication: 0 });

  // Form fields
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('');
  const [course, setCourse] = useState('');
  const [selectedYear, setSelectedYear] = useState(null);
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState('');
  const [instagram, setInstagram] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [userId, setUserId] = useState(null);

  // ── Load profile on mount ──
  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate('/auth'); return; }

      setUserEmail(user.email);
      setUserId(user.id);

      // Fetch profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profile) {
        setUsername(profile.username || '');
        setFullName(profile.full_name || '');
        setBio(profile.bio || '');
        setCourse(profile.course || '');
        setSelectedYear(profile.year || null);
        setSkills(profile.skills || []);
        setInstagram(profile.instagram || '');
        setLinkedin(profile.linkedin || '');
        setAvatarPreview(profile.avatar_url || null);
      }

      // Fetch reviews for Trust Orb
      const { data: reviews } = await supabase
        .from('reviews')
        .select('punctuality_rating, quality_rating, communication_rating')
        .eq('reviewee_id', user.id);

      if (reviews && reviews.length > 0) {
        setReviewCount(reviews.length);
        const avg = (key) => reviews.reduce((a, r) => a + r[key], 0) / reviews.length;
        setTrustScores({
          punctuality: avg('punctuality_rating'),
          quality: avg('quality_rating'),
          communication: avg('communication_rating'),
        });
      }

      setLoading(false);
    };
    load();
  }, [navigate]);

  // ── Skills ──
  const addSkill = (skill) => {
    const trimmed = skill.trim();
    if (trimmed && !skills.includes(trimmed)) setSkills([...skills, trimmed]);
    setSkillInput('');
  };
  const removeSkill = (skill) => setSkills(skills.filter((s) => s !== skill));

  // ── Avatar ──
  const handleAvatarChange = async (e) => {
    let file = e.target.files[0];
    if (!file || !userId) return;

    // Convert HEIC to JPEG if needed (iPhone photos)
    if (file.type === 'image/heic' || file.name.toLowerCase().endsWith('.heic')) {
      try {
        const converted = await heic2any({ blob: file, toType: 'image/jpeg', quality: 0.8 });
        file = new File([converted], file.name.replace('.heic', '.jpg'), { type: 'image/jpeg' });
      } catch (err) {
        setError('Could not convert image. Please upload a JPG or PNG.');
        return;
      }
    }

    // Show local preview immediately
    setAvatarPreview(URL.createObjectURL(file));

    const fileExt = file.name.split('.').pop();
    const filePath = `${userId}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      console.error('Upload error:', uploadError.message);
      setError('Failed to upload image: ' + uploadError.message);
      return;
    }

    // Get real public URL and replace blob preview
    const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
    setAvatarPreview(data.publicUrl);
  };

  // ── Save ──
  const handleSave = async () => {
    setError('');
    setSuccessMsg('');

    if (!username.trim()) { setError('Username is required.'); return; }

    setSaving(true);

    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        username: username.trim(),
        full_name: fullName.trim(),
        bio: bio.trim(),
        course: course.trim(),
        year: selectedYear,
        skills,
        instagram: instagram.trim(),
        linkedin: linkedin.trim(),
        avatar_url: avatarPreview,
      })
      .eq('id', userId);

    if (updateError) {
      setError(updateError.message);
    } else {
      setSuccessMsg('Profile updated successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    }

    setSaving(false);
  };

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
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <p className="text-white/50 text-xs uppercase tracking-widest mb-3">Your Account</p>
          <h1 className="text-4xl text-white font-light tracking-wide mb-2">Profile Settings</h1>
          <p className="text-white/60 text-sm">
            Update your verified campus identity
          </p>
        </div>
      </section>

      <section
        className="py-12 px-4 sm:px-6 lg:px-8"
        style={{ background: 'linear-gradient(to right, #690DAB 0%, #decfe8 100%)' }}
      >
        <div className="max-w-4xl mx-auto space-y-8">

          {/* ── Trust Orb (read-only) ── */}
          <div
            className="rounded-3xl p-8 border border-white/20"
            style={{ background: 'linear-gradient(135deg, #1E1E2E 0%, #6A0DAD 100%)' }}
          >
            <div className="text-center mb-6">
              <h2 className="text-white/60 text-xs uppercase tracking-widest mb-1">
                Your Trust Orb
              </h2>
              <p className="text-white/40 text-xs">
                How others see your reputation — updated with every review
              </p>
            </div>
            <TrustOrb scores={trustScores} reviewCount={reviewCount} />
            <div className="text-center mt-6">
              <button
                onClick={() => navigate(`/profile/${userId}`)}
                className="px-6 py-2 text-white/70 text-sm rounded-full border border-white/20 hover:bg-white/10 transition-all"
              >
                <i className="fa-solid fa-eye mr-2" />
                View your public profile
              </button>
            </div>
          </div>

          {/* ── Edit Form ── */}
          <div className="bg-neutral-100 rounded-3xl shadow-2xl border border-neutral-300 p-8 sm:p-10">

            {/* Error / Success */}
            {error && (
              <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2">
                <i className="fa-solid fa-circle-exclamation text-red-500 text-sm mt-0.5 flex-shrink-0" />
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}
            {successMsg && (
              <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-xl flex items-start gap-2">
                <i className="fa-solid fa-circle-check text-green-500 text-sm mt-0.5 flex-shrink-0" />
                <p className="text-green-700 text-sm">{successMsg}</p>
              </div>
            )}

            {/* Avatar */}
            <div className="mb-8">
              <label className="block text-neutral-700 text-lg font-semibold mb-4">
                Profile Picture
              </label>
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="relative group cursor-pointer">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Avatar"
                      className="w-24 h-24 rounded-full object-cover border-4 border-neutral-300 shadow-lg" />
                  ) : (
                    <div className="w-24 h-24 rounded-full border-4 border-neutral-300 bg-neutral-200 flex items-center justify-center">
                      <i className="fa-solid fa-user text-neutral-400 text-3xl" />
                    </div>
                  )}
                  <label className="absolute inset-0 flex items-center justify-center rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-all bg-black/40">
                    <i className="fa-solid fa-camera text-white text-xl" />
                    <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                  </label>
                </div>
                <div>
                  <label className="inline-block px-5 py-2.5 bg-white border border-neutral-200 rounded-xl text-neutral-700 text-sm cursor-pointer hover:bg-neutral-100 transition-all">
                    <i className="fa-solid fa-upload mr-2" />Change Photo
                    <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                  </label>
                  <p className="text-neutral-400 text-xs mt-2">JPG, PNG or GIF. Max 5MB</p>
                </div>
              </div>
            </div>

            {/* Username */}
            <div className="mb-6">
              <label className="block text-neutral-700 font-semibold text-sm mb-2">Username</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">@</span>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}
                  placeholder="johndoe"
                  className="w-full pl-10 pr-4 py-3 bg-white border border-neutral-300 rounded-xl text-neutral-700 placeholder-neutral-400 focus:outline-none focus:border-neutral-500 transition-all text-sm" />
              </div>
            </div>

            {/* Full Name */}
            <div className="mb-6">
              <label className="block text-neutral-700 font-semibold text-sm mb-2">Full Name</label>
              <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
                className="w-full px-4 py-3 bg-white border border-neutral-300 rounded-xl text-neutral-700 placeholder-neutral-400 focus:outline-none focus:border-neutral-500 transition-all text-sm" />
            </div>

            {/* University Email (read-only) */}
            <div className="mb-6">
              <label className="block text-neutral-700 font-semibold text-sm mb-2">University Email</label>
              <div className="relative">
                <i className="fa-solid fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input type="email" value={userEmail} readOnly
                  className="w-full pl-12 pr-32 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-500 text-sm cursor-not-allowed" />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                  <i className="fa-solid fa-check" /> Verified
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="mb-6">
              <label className="block text-neutral-700 font-semibold text-sm mb-2">Bio</label>
              <textarea rows={4} value={bio} onChange={(e) => setBio(e.target.value.slice(0, 500))}
                placeholder="Tell students about yourself, your skills, and what you offer..."
                className="w-full px-4 py-3 bg-white border border-neutral-300 rounded-xl text-neutral-700 placeholder-neutral-400 focus:outline-none focus:border-neutral-500 transition-all text-sm resize-none" />
              <div className="flex justify-between mt-1">
                <p className="text-neutral-400 text-xs">Describe your expertise</p>
                <span className="text-neutral-400 text-xs">{bio.length}/500</span>
              </div>
            </div>

            {/* Course */}
            <div className="mb-6">
              <label className="block text-neutral-700 font-semibold text-sm mb-2">Course / Degree</label>
              <div className="relative">
                <i className="fa-solid fa-graduation-cap absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input type="text" value={course} onChange={(e) => setCourse(e.target.value)}
                  placeholder="e.g. Computer Science, Medicine, Law..."
                  className="w-full pl-12 pr-4 py-3 bg-white border border-neutral-300 rounded-xl text-neutral-700 placeholder-neutral-400 focus:outline-none focus:border-neutral-500 transition-all text-sm" />
              </div>
            </div>

            {/* Year */}
            <div className="mb-6">
              <label className="block text-neutral-700 font-semibold text-sm mb-2">Year of Study</label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                {YEAR_OPTIONS.map((year) => (
                  <button key={year} type="button" onClick={() => setSelectedYear(year)}
                    className="py-2.5 rounded-xl text-sm transition-all border"
                    style={selectedYear === year
                      ? { background: 'linear-gradient(135deg, #0047AB, #6A0DAD)', color: 'white', borderColor: 'transparent' }
                      : { background: 'white', color: '#404040', borderColor: '#d4d4d4' }
                    }>
                    {year}
                  </button>
                ))}
              </div>
            </div>

            {/* Skills */}
            <div className="mb-8">
              <label className="block text-neutral-700 font-semibold text-sm mb-2">Skills & Services</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {skills.map((skill, i) => (
                  <span key={skill} className="px-3 py-1.5 text-white rounded-full text-xs flex items-center gap-2"
                    style={{ background: SKILL_GRADIENTS[i % SKILL_GRADIENTS.length] }}>
                    {skill}
                    <button type="button" onClick={() => removeSkill(skill)}>
                      <i className="fa-solid fa-times text-xs" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 mb-3">
                {SUGGESTED_SKILLS.filter((s) => !skills.includes(s)).map((s) => (
                  <button key={s} type="button" onClick={() => addSkill(s)}
                    className="px-3 py-1 bg-white border border-neutral-300 text-neutral-600 rounded-full text-xs hover:border-neutral-500 transition-all">
                    + {s}
                  </button>
                ))}
              </div>
              <div className="relative">
                <input type="text" value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill(skillInput); } }}
                  placeholder="Add a custom skill..."
                  className="w-full px-4 py-3 bg-white border border-neutral-300 rounded-xl text-neutral-700 placeholder-neutral-400 focus:outline-none focus:border-neutral-500 transition-all text-sm" />
                <button type="button" onClick={() => addSkill(skillInput)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 text-neutral-600 rounded-lg text-sm transition-all">
                  <i className="fa-solid fa-plus" />
                </button>
              </div>
            </div>

            {/* Social Links */}
            <div className="mb-8">
              <label className="block text-neutral-700 font-semibold text-sm mb-1">Contact Links</label>
              <p className="text-neutral-400 text-xs mb-3">
                Students will use these to reach you since Verity doesn't handle messaging yet.
              </p>
              <div className="space-y-3">
                <div className="relative">
                  <i className="fa-brands fa-instagram absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input type="text" value={instagram} onChange={(e) => setInstagram(e.target.value)}
                    placeholder="Instagram username"
                    className="w-full pl-12 pr-4 py-3 bg-white border border-neutral-300 rounded-xl text-neutral-700 placeholder-neutral-400 focus:outline-none focus:border-neutral-500 transition-all text-sm" />
                </div>
                <div className="relative">
                  <i className="fa-brands fa-linkedin absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input type="text" value={linkedin} onChange={(e) => setLinkedin(e.target.value)}
                    placeholder="LinkedIn profile URL"
                    className="w-full pl-12 pr-4 py-3 bg-white border border-neutral-300 rounded-xl text-neutral-700 placeholder-neutral-400 focus:outline-none focus:border-neutral-500 transition-all text-sm" />
                </div>
              </div>
            </div>

            {/* Save */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={handleSave} disabled={saving}
                className="flex-1 py-4 text-white rounded-xl font-semibold transition-all text-sm"
                style={{ background: saving ? '#a3a3a3' : 'linear-gradient(135deg, #0047AB, #6A0DAD)', cursor: saving ? 'not-allowed' : 'pointer' }}>
                {saving ? <><i className="fa-solid fa-spinner fa-spin mr-2" />Saving...</> : <><i className="fa-solid fa-check mr-2" />Save Changes</>}
              </button>
              <button onClick={() => navigate('/services')}
                className="px-8 py-4 bg-white border border-neutral-200 text-neutral-600 rounded-xl text-sm hover:bg-neutral-50 transition-all">
                Cancel
              </button>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}