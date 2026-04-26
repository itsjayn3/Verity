import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer
      className="w-full border-t border-white/10 py-10 px-4 sm:px-6 lg:px-8"
      style={{ background: '#1E1E2E' }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-white text-xl tracking-widest font-light mb-1">VERITY</p>
            <p className="text-white/40 text-xs">Trusted student services at Aston University</p>
          </div>

          {/* links */}
          <div className="flex items-center gap-8">
            <Link to="/about" className="text-white/60 hover:text-white text-sm transition-all">
              About
            </Link>
            <Link to="/faqs" className="text-white/60 hover:text-white text-sm transition-all">
              FAQs
            </Link>
            <Link to="/contact" className="text-white/60 hover:text-white text-sm transition-all">
              Contact
            </Link>
          </div>
          <p className="text-white/30 text-xs">
            © 2026 Verity · Aston University Final Year Project
          </p>
        </div>
      </div>
    </footer>
  );
}
