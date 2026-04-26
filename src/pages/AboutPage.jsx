import Header from '../components/layout/Header';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-neutral-100">
      <Header />
      <section
        className="relative pt-24 pb-16 px-4 sm:px-6 lg:px-8"
        style={{ background: 'linear-gradient(135deg, #0047AB 0%, #6A0DAD 50%, #1E1E2E 100%)' }}
      >
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at top, rgba(255,255,255,0.05), transparent 50%)' }} />
        <div className="max-w-3xl mx-auto relative z-10 text-center">
          <p className="text-white/50 text-xs uppercase tracking-widest mb-3">About</p>
          <h1 className="text-5xl text-white font-light tracking-wide mb-4">What is Verity?</h1>
          <p className="text-white/70 text-lg leading-relaxed">
            A trust-first peer-to-peer service marketplace built exclusively for Aston University students.
          </p>
        </div>
      </section>

      {/* main body of page */}
      <section
        className="py-16 px-4 sm:px-6 lg:px-8"
        style={{ background: 'linear-gradient(to right, #690DAB 0%, #decfe8 100%)' }}
      >
        <div className="max-w-3xl mx-auto space-y-8">

          {/* verity mission statement */}
          <div className="bg-neutral-100 rounded-3xl p-8 border border-neutral-300">
            <h2 className="text-neutral-800 text-2xl font-light mb-4">Our Mission</h2>
            <p className="text-neutral-600 leading-relaxed">
              Verity was built to solve a real problem <br/>Students on campus offer incredible services, from tutoring and photography to beauty/cosmetic services and tech support, but there is no trusted, verified place to find them. Generic popular platforms lack the context and trust that comes from being part of the same university community.
            </p>
            <p className="text-neutral-600 leading-relaxed mt-4">
              Verity changes that. Every user is verified through their @aston.ac.uk email address, and every review is structured around three attributes that actually matter: punctuality, quality, and communication.<br/> The result? A platform where trust is built in.
            </p>
          </div>
          <div className="bg-neutral-100 rounded-3xl p-8 border border-neutral-300">
            <h2 className="text-neutral-800 text-2xl font-light mb-6">How It Works</h2>
            <div className="space-y-5">
              {[
                { icon: 'fa-solid fa-envelope', title: 'Verify your identity', desc: 'Sign up with your @aston.ac.uk email. Your identity needs to be confirmed before you can access the platform.' },
                { icon: 'fa-solid fa-user', title: 'Build your profile', desc: 'Tell the community what you offer. Add your skills, bio, course and how to contact you.' },
                { icon: 'fa-solid fa-magnifying-glass', title: 'Browse the Campus Feed', desc: 'Find services posted by verified students across Public Zones, Student Living and Remote services.' },
                { icon: 'fa-solid fa-star', title: 'Leave structured reviews', desc: 'After using a service, leave a review rating punctuality, quality and communication. No anonymous feedback.' },
              ].map(({ icon, title, desc }) => (
                <div key={title} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #0047AB, #6A0DAD)' }}>
                    <i className={`${icon} text-white text-sm`} />
                  </div>
                  <div>
                    <p className="text-neutral-700 font-medium text-sm mb-1">{title}</p>
                    <p className="text-neutral-500 text-sm leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* the research question link */}
          <div className="bg-neutral-100 rounded-3xl p-8 border border-neutral-300">
            <h2 className="text-neutral-800 text-2xl font-light mb-4">The Research Behind Verity</h2>
            <p className="text-neutral-600 leading-relaxed">
              Verity was developed as part of a final year Computer Science project at Aston University, exploring how trust mechanisms can be embedded into peer-to-peer platforms. <br/> The Trust Orb — the visual reputation indicator on every profile — is grounded in research into peer review systems, identity verification and cognitive trust signals.
            </p>
            <p className="text-neutral-600 leading-relaxed mt-4">
              The platform was designed using a User-Centred Design approach, with wireframe evaluation surveys conducted with university students to ensure the interface is intuitive and the trust indicators are meaningful.
            </p>
          </div>

        </div>
      </section>
    </div>
  );
}
