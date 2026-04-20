import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/20"
      style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link to="/" className="text-2xl text-white tracking-widest font-light">
            VERITY
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-8">
            {[
              { label: 'Feed', path: '/search' },
              { label: 'Services', path: '/search' },
              { label: 'Community', path: '/' },
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

          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            <button className="text-white/80 hover:text-white transition-all">
              <i className="fa-solid fa-bell text-sm" />
            </button>
            <button onClick={() => navigate('/profile')}>
              <img
                src="https://api.dicebear.com/7.x/notionists/svg?scale=200&seed=1234"
                alt="Profile"
                className="w-8 h-8 rounded-full border-2 border-white/30 hover:border-white/60 transition-all"
              />
            </button>

            {/* Mobile Hamburger */}
            <button
              className="md:hidden text-white/80 hover:text-white transition-all"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <i className={`fa-solid ${menuOpen ? 'fa-xmark' : 'fa-bars'} text-sm`} />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 flex flex-col space-y-3">
            {[
              { label: 'Feed', path: '/search' },
              { label: 'Services', path: '/search' },
              { label: 'Community', path: '/' },
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
          </div>
        )}
      </div>
    </header>
  );
}
