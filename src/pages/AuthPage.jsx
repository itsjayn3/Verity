// AuthPage.jsx
// Login + Sign up with @aston.ac.uk domain restriction
// Frontend validation + Supabase trigger = two-layer enforcement (RQ1)

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function AuthPage() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // ── Validation ─────────────────────────────────────────────────────────────
  const isAstonEmail = (val) => val.trim().toLowerCase().endsWith('@aston.ac.uk');

  const validate = () => {
    if (!email.trim()) {
      setError('Please enter your university email.');
      return false;
    }
    if (!isAstonEmail(email)) {
      setError('Only @aston.ac.uk email addresses are permitted. Verity is exclusive to verified Aston students.');
      return false;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return false;
    }
    return true;
  };


  // ── Submit ──────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    setError('');
    setSuccessMsg('');
    if (!validate()) return;

    setLoading(true);

    if (isLogin) {
      // ── Sign In ──
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (signInError) {
        setError(signInError.message);
      } else {
        navigate('/services');
      }
    } else {
      // ── Sign Up ──
      const { error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
      });

      if (signUpError) {
        // Surface the Postgres trigger error clearly
        if (signUpError.message.includes('aston')) {
          setError('Only @aston.ac.uk email addresses are permitted.');
        } else {
          setError(signUpError.message);
        }
      } else {
        setSuccessMsg(
          'Account created! Check your Aston email to confirm your account, then come back to log in.'
        );
      }
    }

    setLoading(false);
  };


  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSubmit();
  };

  const handleForgotPassword = async () => {
  if (!email.trim()) {
    setError('Please enter your email address first, then click Forgot Password.');
    return;
  }
  if (!isAstonEmail(email)) {
    setError('Please enter your @aston.ac.uk email address first.');
    return;
  }

  setLoading(true);
  const { error: resetError } = await supabase.auth.resetPasswordForEmail(
    email.trim(),
    { redirectTo: 'http://localhost:5173/reset-password' }
  );

  if (resetError) {
    setError(resetError.message);
  } else {
    setSuccessMsg('Password reset email sent! Check your Aston inbox.');
  }
  setLoading(false);
};

{isLogin && (
  <div className="text-right">
    <button
      onClick={handleForgotPassword}
      className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
    >
      Forgot password?
    </button>
  </div>
)}
  // ── Email field border colour ───────────────────────────────────────────────
  const emailBorderColor = () => {
    if (!email) return 'border-neutral-300';
    if (isAstonEmail(email)) return 'border-green-400';
    return 'border-red-400';
  };

  return (
    <div className="min-h-screen flex">

      {/* ── Left branding panel (desktop only) ── */}
      <div
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-center items-center text-center text-white p-12"
        style={{
          background: 'linear-gradient(135deg, #0047AB 0%, #6A0DAD 60%, #1E1E2E 100%)',
        }}
      >
        {/* Radial highlights */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at top right, rgba(255,255,255,0.08), transparent 50%)' }} />
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at bottom left, rgba(255,255,255,0.04), transparent 50%)' }} />

        <div className="relative z-10 max-w-md">
          {/* Logo */}
          <h1 className="text-6xl text-white font-light tracking-widest mb-3">
            VERITY
          </h1>
          <p className="text-white/70 text-lg mb-12">
            A trusted student marketplace
          </p>

          {/* Trust feature cards */}
          <div className="space-y-4 text-left">
            {[
              {
                icon: 'fa-solid fa-shield-halved',
                title: 'Verified Identities',
                desc: 'Every user is a real Aston student — no anonymous accounts, no strangers.',
              },
              {
                icon: 'fa-solid fa-gem',
                title: 'Trust Orb',
                desc: 'Visual reputation scores built from structured, attribute-based reviews.',
              },
              {
                icon: 'fa-solid fa-star-half-stroke',
                title: 'Structured Reviews',
                desc: 'Ratings for punctuality, quality, and communication — not vague star scores.',
              },
            ].map(({ icon, title, desc }) => (
              <div
                key={title}
                className="flex items-start gap-4 p-4 rounded-2xl border border-white/15"
                style={{ background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(10px)' }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(255,255,255,0.15)' }}>
                  <i className={`${icon} text-white text-sm`} />
                </div>
                <div>
                  <p className="text-white font-medium text-sm mb-1">{title}</p>
                  <p className="text-white/60 text-xs leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right: Auth form ── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 bg-neutral-50">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <h1 className="text-4xl font-light tracking-widest text-neutral-800 mb-2">
              VERITY
            </h1>
            <p className="text-neutral-500 text-sm">A trusted student marketplace</p>
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-neutral-100 p-8">

            {/* Tab toggle */}
            <div className="flex bg-neutral-100 rounded-xl p-1 mb-8">
              {['Log In', 'Sign Up'].map((tab) => {
                const active = (tab === 'Log In') === isLogin;
                return (
                  <button
                    key={tab}
                    onClick={() => {
                      setIsLogin(tab === 'Log In');
                      setError('');
                      setSuccessMsg('');
                    }}
                    className="flex-1 py-2.5 px-4 text-sm font-medium rounded-lg transition-all"
                    style={
                      active
                        ? { background: 'white', color: '#171717', boxShadow: '0 1px 4px rgba(0,0,0,0.1)' }
                        : { color: '#737373' }
                    }
                  >
                    {tab}
                  </button>
                );
              })}
            </div>

            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-neutral-800 mb-1">
                {isLogin ? 'Welcome back' : 'Join Verity'}
              </h2>
              <p className="text-neutral-500 text-sm">
                {isLogin
                  ? 'Sign in to your student account'
                  : 'Create your verified student account'}
              </p>
            </div>

            {/* Error message */}
            {error && (
              <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2">
                <i className="fa-solid fa-circle-exclamation text-red-500 text-sm mt-0.5 flex-shrink-0" />
                <p className="text-red-600 text-sm leading-relaxed">{error}</p>
              </div>
            )}

            {/* Success message */}
            {successMsg && (
              <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-xl flex items-start gap-2">
                <i className="fa-solid fa-circle-check text-green-500 text-sm mt-0.5 flex-shrink-0" />
                <p className="text-green-700 text-sm leading-relaxed">{successMsg}</p>
              </div>
            )}

            {/* Form */}
            <div className="space-y-5">

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                  University Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError('');
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder="your.name@aston.ac.uk"
                    className={`w-full px-4 py-3 pr-10 border rounded-xl text-neutral-800 placeholder-neutral-400 focus:outline-none transition-all text-sm ${emailBorderColor()}`}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    {email && isAstonEmail(email) ? (
                      <i className="fa-solid fa-circle-check text-green-500 text-sm" />
                    ) : (
                      <i className="fa-solid fa-envelope text-neutral-400 text-sm" />
                    )}
                  </div>
                </div>
                <p className="text-neutral-400 text-xs mt-1.5">
                  Must be a verified <span className="font-medium">@aston.ac.uk</span> address
                </p>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError('');
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder={isLogin ? 'Enter your password' : 'Create a password (min. 8 characters)'}
                    className="w-full px-4 py-3 pr-10 border border-neutral-300 rounded-xl text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-neutral-500 transition-all text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-600 transition-colors"
                  >
                    <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'} text-sm`} />
                  </button>
                </div>
              </div>

              {/* Forgot password */}
              {isLogin && (
                <div className="text-right">
                  <button className="text-sm text-blue-600 hover:text-blue-800 transition-colors">
                    Forgot password?
                  </button>
                </div>
              )}

              {/* Submit */}
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full py-3 text-white rounded-xl font-medium transition-all text-sm"
                style={{
                  background: loading
                    ? '#a3a3a3'
                    : 'linear-gradient(135deg, #0047AB 0%, #6A0DAD 100%)',
                  cursor: loading ? 'not-allowed' : 'pointer',
                }}
              >
                {loading ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin mr-2" />
                    {isLogin ? 'Signing in...' : 'Creating account...'}
                  </>
                ) : (
                  isLogin ? 'Sign In' : 'Create Account'
                )}
              </button>
            </div>

            {/* Switch mode */}
            <div className="text-center mt-6 pt-6 border-t border-neutral-100">
              <p className="text-neutral-500 text-sm">
                {isLogin ? "Don't have an account?" : 'Already have an account?'}
                <button
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError('');
                    setSuccessMsg('');
                  }}
                  className="ml-1 text-blue-600 font-medium hover:text-blue-800 transition-colors"
                >
                  {isLogin ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>
          </div>

          {/* Security notice */}
          <div className="mt-6 text-center">
            <div className="flex items-center justify-center gap-2 text-sm text-neutral-500">
              <i className="fa-solid fa-shield-halved text-green-500" />
              <span>Access restricted to verified Aston University students</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );


}