import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { supabase } from '../../supabaseClient';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userId, setUserId] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        // fetch avatar from profiles
        const { data: profile } = await supabase
          .from('profiles')
          .select('avatar_url')
          .eq('id', user.id)
          .single();
        if (profile?.avatar_url) setAvatarUrl(profile.avatar_url);
      }
    };
    getUser();
  }, []);

  // close dropdown when clicking anywhere else on screen
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 border-b border-white/20"
      style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* logo */}
          <Link to="/services" className="text-2xl text-white tracking-widest font-light">
            VERITY
          </Link>

          {/* desktop nav */}
          <nav className="hidden md:flex space-x-8">
            {[
              { label: 'Feed', path: '/services' },
              { label: 'Services', path: '/services' },
              { label: 'Community', path: '/services' },
            ].map(({ label, path }) => (
              <Link
                key={label}
                to={path}
                className="text-white/80 hover:text-white transition-all text-sm tracking-wide"
              >
                {label}
              </Link>
            ))}
          </nav>

          
          <div className="flex items-center space-x-4">
            <button className="text-white/80 hover:text-white transition-all">
              <i className="fa-solid fa-bell text-sm" />
            </button>

            {/* profile pic + dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="focus:outline-none"
              >
                <img
                  src={avatarUrl || `https://api.dicebear.com/7.x/notionists/svg?scale=200&seed=${userId || '1234'}`}
                  alt="Profile"
                  className="w-8 h-8 rounded-full border-2 border-white/30 hover:border-white/60 transition-all"
                />
              </button>

              {/* dropdown menu */}
              {dropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-48 rounded-2xl border border-white/15 shadow-2xl overflow-hidden z-50"
                  style={{ background: 'rgba(15,15,30,0.95)', backdropFilter: 'blur(20px)' }}
                >
                  <button
                    onClick={() => { navigate(`/profile/${userId}`); setDropdownOpen(false); }}
                    className="w-full text-left px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 transition-all text-sm flex items-center gap-3"
                  >
                    <i className="fa-solid fa-user text-xs w-4" />
                    View Profile
                  </button>
                  <button
                    onClick={() => { navigate('/settings'); setDropdownOpen(false); }}
                    className="w-full text-left px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 transition-all text-sm flex items-center gap-3"
                  >
                    <i className="fa-solid fa-gear text-xs w-4" />
                    Settings
                  </button>
                  <div className="border-t border-white/10" />
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-4 py-3 text-red-400 hover:text-red-300 hover:bg-white/10 transition-all text-sm flex items-center gap-3"
                  >
                    <i className="fa-solid fa-right-from-bracket text-xs w-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>

            {/* phone hamburger menu */}
            <button
              className="md:hidden text-white/80 hover:text-white transition-all"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <i className={`fa-solid ${menuOpen ? 'fa-xmark' : 'fa-bars'} text-sm`} />
            </button>
          </div>
        </div>

        {/* phone menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 flex flex-col space-y-3">
            {[
              { label: 'Feed', path: '/services' },
              { label: 'Services', path: '/services' },
              { label: 'Community', path: '/services' },
            ].map(({ label, path }) => (
              <Link
                key={label}
                to={path}
                onClick={() => setMenuOpen(false)}
                className="text-white/80 hover:text-white transition-all text-sm tracking-wide px-2 py-1"
              >
                {label}
              </Link>
            ))}
            <button
              onClick={() => { navigate(`/profile/${userId}`); setMenuOpen(false); }}
              className="text-white/80 hover:text-white transition-all text-sm tracking-wide px-2 py-1 text-left"
            >
              View Profile
            </button>
            <button
              onClick={() => { navigate('/settings'); setMenuOpen(false); }}
              className="text-white/80 hover:text-white transition-all text-sm tracking-wide px-2 py-1 text-left"
            >
              Settings
            </button>
            <button
              onClick={handleSignOut}
              className="text-red-400 hover:text-red-300 transition-all text-sm tracking-wide px-2 py-1 text-left"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}