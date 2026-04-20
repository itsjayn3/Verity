import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import { supabase } from '../supabaseClient';

const SUGGESTED_SKILLS = [
  'Tutoring', 'Design', 'Photography', 'Coding', 'Hair & Braiding',
  'Nails', 'Makeup', 'Fitness & PT', 'Music Lessons', 'Language Exchange',
  'CV & Interview Prep', 'Essay Editing', 'Video Editing', 'Cooking',
  'Illustration', 'Translation',
];

const YEAR_OPTIONS = ['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year', 'Postgrad'];

const SKILL_GRADIENTS = [
  'linear-gradient(135deg, #0047AB, #00D4FF)',
  'linear-gradient(135deg, #6A0DAD, #C77DFF)',
  'linear-gradient(135deg, #00B4D8, #0077B6)',
  'linear-gradient(135deg, #0047AB, #6A0DAD)',
];

export default function CompleteProfile() {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('');
  const [course, setCourse] = useState('');
  const [selectedYear, setSelectedYear] = useState(null);
  const [skills, setSkills] = useState(['Tutoring', 'Design', 'Photography']);
  const [skillInput, setSkillInput] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [instagram, setInstagram] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setUserEmail(user.email);
    };
    getUser();
  }, []);

  const addSkill = (skill) => {
    const trimmed = skill.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
    }
    setSkillInput('');
  };

  const removeSkill = (skill) => setSkills(skills.filter((s) => s !== skill));

  const handleSkillKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill(skillInput);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSubmit = () => {
    if (!agreed) return;
    // TODO: save to Supabase profiles table
    navigate('/services');
  };

  return (
    <div className="min-h-screen bg-neutral-100">
      <Header />

      {/* Hero banner matching SearchPage */}
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
        <div className="max-w-3xl mx-auto relative z-10 text-center">
          <div className="inline-block bg-white/10 backdrop-blur-md rounded-full px-6 py-2 mb-6">
            <span className="text-white text-sm font-medium">Step 1 of 1</span>
          </div>
          <h1 className="text-4xl sm:text-5xl text-white font-light tracking-wide mb-4">
            Complete Your Profile
          </h1>
          <p className="text-lg text-white/80">
            Let's get you set up in the Verity community
          </p>
        </div>
      </section>

      {/* Form section with purple-to-light gradient like SearchPage cards section */}
      <section
        className="py-12 px-4 sm:px-6 lg:px-8"
        style={{
          background: 'linear-gradient(to right, #690DAB 0%, #decfe8 100%)',
        }}
      >
        <div className="max-w-3xl mx-auto">
          <div className="bg-neutral-100 rounded-3xl shadow-2xl border border-neutral-300 p-8 sm:p-12">

            {/* ── Profile Picture ── */}
            <div className="mb-10">
              <label className="block text-neutral-700 text-lg font-semibold mb-4">
                Profile Picture
              </label>
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="relative group cursor-pointer">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Preview"
                      className="w-28 h-28 rounded-full object-cover border-4 border-neutral-300 shadow-lg"
                    />
                  ) : (
                    <div className="w-28 h-28 rounded-full border-4 border-neutral-300 shadow-lg bg-neutral-200 flex items-center justify-center">
                      <i className="fa-solid fa-user text-neutral-400 text-4xl" />
                    </div>
                  )}
                  <label className="absolute inset-0 flex items-center justify-center rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-all bg-black/40">
                    <i className="fa-solid fa-camera text-white text-2xl" />
                    <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                  </label>
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <label className="inline-block px-6 py-3 bg-white border border-neutral-200 rounded-xl text-neutral-700 cursor-pointer hover:bg-neutral-200 transition-all shadow-sm mb-3">
                    <i className="fa-solid fa-upload mr-2" />Upload Photo
                    <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                  </label>
                  <p className="text-neutral-500 text-sm">JPG, PNG or GIF. Max size 5MB</p>
                </div>
              </div>
            </div>

            {/* ── Username ── */}
            <div className="mb-8">
              <label className="block text-neutral-700 text-lg font-semibold mb-3">Username</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 font-medium">@</span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="johndoe"
                  className="w-full pl-10 pr-4 py-4 bg-white border border-neutral-300 rounded-xl text-neutral-700 placeholder-neutral-400 focus:outline-none focus:border-neutral-500 transition-all shadow-sm"
                />
              </div>
              <p className="text-neutral-500 text-sm mt-2">Choose a unique username for your profile</p>
            </div>

            {/* ── Full Name ── */}
            <div className="mb-8">
              <label className="block text-neutral-700 text-lg font-semibold mb-3">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
                className="w-full px-4 py-4 bg-white border border-neutral-300 rounded-xl text-neutral-700 placeholder-neutral-400 focus:outline-none focus:border-neutral-500 transition-all shadow-sm"
              />
            </div>

            {/* ── University Email (read-only) ── */}
            <div className="mb-8">
              <label className="block text-neutral-700 text-lg font-semibold mb-3">University Email</label>
              <div className="relative">
                <i className="fa-solid fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="email"
                  value={userEmail}
                  readOnly
                  className="w-full pl-12 pr-32 py-4 bg-neutral-50 border border-neutral-300 rounded-xl text-neutral-500 placeholder-neutral-400 cursor-not-allowed"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                  <i className="fa-solid fa-check" /> Verified
                </div>
              </div>
            </div>

            {/* ── Bio ── */}
            <div className="mb-8">
              <label className="block text-neutral-700 text-lg font-semibold mb-3">Bio</label>
              <textarea
                rows={5}
                value={bio}
                onChange={(e) => setBio(e.target.value.slice(0, 500))}
                placeholder="Tell us about yourself, your skills, and what services you can offer..."
                className="w-full px-4 py-4 bg-white border border-neutral-300 rounded-xl text-neutral-700 placeholder-neutral-400 focus:outline-none focus:border-neutral-500 transition-all shadow-sm resize-none"
              />
              <div className="flex justify-between items-center mt-2">
                <p className="text-neutral-500 text-sm">Describe your expertise and interests</p>
                <span className="text-neutral-500 text-sm">{bio.length}/500</span>
              </div>
            </div>

            {/* ── Course ── */}
            <div className="mb-8">
              <label className="block text-neutral-700 text-lg font-semibold mb-3">Course / Degree</label>
              <div className="relative">
                <i className="fa-solid fa-graduation-cap absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  placeholder="e.g. Computer Science, Medicine, Law..."
                  className="w-full pl-12 pr-4 py-4 bg-white border border-neutral-300 rounded-xl text-neutral-700 placeholder-neutral-400 focus:outline-none focus:border-neutral-500 transition-all shadow-sm"
                />
              </div>
            </div>

            {/* ── Year of Study ── */}
            <div className="mb-8">
              <label className="block text-neutral-700 text-lg font-semibold mb-3">Year of Study</label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                {YEAR_OPTIONS.map((year) => (
                  <button
                    key={year}
                    type="button"
                    onClick={() => setSelectedYear(year)}
                    className="py-3 rounded-xl text-sm transition-all border"
                    style={
                      selectedYear === year
                        ? {
                            background: 'linear-gradient(135deg, #0047AB, #6A0DAD)',
                            color: 'white',
                            borderColor: 'transparent',
                          }
                        : {
                            background: 'white',
                            color: '#404040',
                            borderColor: '#d4d4d4',
                          }
                    }
                  >
                    {year}
                  </button>
                ))}
              </div>
            </div>

            {/* ── Skills & Services ── */}
            <div className="mb-10">
              <label className="block text-neutral-700 text-lg font-semibold mb-3">
                Skills & Services
              </label>

              {/* Selected tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {skills.map((skill, i) => (
                  <span
                    key={skill}
                    className="px-4 py-2 text-white rounded-full text-sm shadow-md flex items-center gap-2"
                    style={{ background: SKILL_GRADIENTS[i % SKILL_GRADIENTS.length] }}
                  >
                    {skill}
                    <button type="button" onClick={() => removeSkill(skill)}>
                      <i className="fa-solid fa-times text-xs" />
                    </button>
                  </span>
                ))}
              </div>

              {/* Suggested tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {SUGGESTED_SKILLS.filter((s) => !skills.includes(s)).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => addSkill(s)}
                    className="px-3 py-1.5 bg-white border border-neutral-300 text-neutral-600 rounded-full text-xs hover:border-neutral-500 transition-all"
                  >
                    + {s}
                  </button>
                ))}
              </div>

              {/* Custom skill input */}
              <div className="relative">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={handleSkillKeyDown}
                  placeholder="Add a custom skill or service..."
                  className="w-full px-4 py-4 bg-white border border-neutral-300 rounded-xl text-neutral-700 placeholder-neutral-400 focus:outline-none focus:border-neutral-500 transition-all shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => addSkill(skillInput)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 text-neutral-600 rounded-lg transition-all"
                >
                  <i className="fa-solid fa-plus" />
                </button>
              </div>
            </div>

            {/* ── Social Links (Mandatory) ── */}
            <div className="mb-10">
              <label className="block text-neutral-700 text-lg font-semibold mb-1">
                Contact / Social Links
              </label>
              <p className="text-neutral-500 text-sm mb-4">
                Required — since Verity doesn't handle bookings or messages yet, other students will use these to reach you.
              </p>
              <div className="space-y-4">
                <div className="relative">
                  <i className="fa-brands fa-instagram absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="text"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    placeholder="Instagram username"
                    className="w-full pl-12 pr-4 py-4 bg-white border border-neutral-300 rounded-xl text-neutral-700 placeholder-neutral-400 focus:outline-none focus:border-neutral-500 transition-all shadow-sm"
                  />
                </div>
                <div className="relative">
                  <i className="fa-brands fa-linkedin absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="text"
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    placeholder="LinkedIn profile URL"
                    className="w-full pl-12 pr-4 py-4 bg-white border border-neutral-300 rounded-xl text-neutral-700 placeholder-neutral-400 focus:outline-none focus:border-neutral-500 transition-all shadow-sm"
                  />
                </div>
              </div>
            </div>

            {/* ── Terms ── */}
            <div className="mb-8">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-1 w-5 h-5 rounded border-neutral-300"
                />
                <span className="text-neutral-600 text-sm leading-relaxed">
                  I agree to Verity's{' '}
                  <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>{' '}
                  and{' '}
                  <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>.
                </span>
              </label>
            </div>

            {/* ── Submit ── */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!agreed}
              className="w-full py-4 text-white rounded-xl text-lg font-semibold transition-all"
              style={{
                background: agreed
                  ? 'linear-gradient(135deg, #0047AB 0%, #6A0DAD 100%)'
                  : '#d4d4d4',
                cursor: agreed ? 'pointer' : 'not-allowed',
              }}
            >
              <i className="fa-solid fa-check mr-2" />
              Complete Profile
            </button>

          </div>

          {/* Privacy notice */}
          <div className="mt-6 text-center">
            <p className="text-white/70 text-sm">
              <i className="fa-solid fa-lock mr-2" />
              Your information is only visible to verified Aston students
            </p>
          </div>

        </div>
      </section>
    </div>
  );
}