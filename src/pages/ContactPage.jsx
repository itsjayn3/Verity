import Header from '../components/layout/Header';

export default function ContactPage() {
  return (
    <div className="bg-neutral-100">
      <Header />
      <section
        className="relative pt-24 pb-16 px-4 sm:px-6 lg:px-8"
        style={{ background: 'linear-gradient(135deg, #0047AB 0%, #6A0DAD 50%, #1E1E2E 100%)' }}
      >
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at top, rgba(255,255,255,0.05), transparent 50%)' }} />
        <div className="max-w-3xl mx-auto relative z-10 text-center">
          <p className="text-white/50 text-xs uppercase tracking-widest mb-3">Get in touch</p>
          <h1 className="text-5xl text-white font-light tracking-wide mb-4">Contact</h1>
          <p className="text-white/70 text-lg">Questions, feedback or issues - we would love to hear from you.</p>
        </div>
      </section>
      <section
        className="py-16 px-4 sm:px-6 lg:px-8"
        style={{ background: 'linear-gradient(to right, #690DAB 0%, #decfe8 100%)' }}
      >
        <div className="max-w-3xl mx-auto space-y-6">
          {/* contact */}
          <div className="bg-neutral-100 rounded-3xl p-8 border border-neutral-300">
            <h2 className="text-neutral-800 text-2xl font-light mb-2">Project Developer</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #0047AB, #6A0DAD)' }}>
                  <i className="fa-solid fa-user text-white text-sm" />
                </div>
                <div>
                  <p className="text-neutral-700 font-medium text-sm">Jayne-Danielle Noah Ekani</p>
                  <p className="text-neutral-400 text-xs">BSc Computer Science, Aston University</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #0047AB, #6A0DAD)' }}>
                  <i className="fa-solid fa-envelope text-white text-sm" />
                </div>
                <a href="mailto:240233925@aston.ac.uk"
                  className="text-neutral-600 text-sm hover:text-neutral-800 transition-all">
                  240233925@aston.ac.uk
                </a>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
