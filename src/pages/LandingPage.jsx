import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

// scroll animations
function useScrollReveal() {
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .reveal {
        opacity: 0;
        transform: translateY(32px);
        transition: opacity 0.7s ease, transform 0.7s ease;
      }
      .reveal.visible {
        opacity: 1;
        transform: translateY(0);
      }
      .reveal-left {
        opacity: 0;
        transform: translateX(-32px);
        transition: opacity 0.7s ease, transform 0.7s ease;
      }
      .reveal-left.visible {
        opacity: 1;
        transform: translateX(0);
      }
      .reveal-right {
        opacity: 0;
        transform: translateX(32px);
        transition: opacity 0.7s ease, transform 0.7s ease; 
      }
      .reveal-right.visible {
        opacity: 1;
        transform: translateX(0);
      }
      .stagger-1 { transition-delay: 0.1s; }
      .stagger-2 { transition-delay: 0.2s; }
      .stagger-3 { transition-delay: 0.3s; }
      .stagger-4 { transition-delay: 0.4s; }

      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
      }
      .float { animation: float 4s ease-in-out infinite; }
      .float-delayed { animation: float 4s ease-in-out 1s infinite; }

      @keyframes gradientShift {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      .gradient-animate {
        background-size: 200% 200%;
        animation: gradientShift 6s ease infinite;
      }
    `;
    document.head.appendChild(style);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    elements.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);
}

// verity's features description
const TRUST_PILLARS = [
  {
    icon: 'fa-solid fa-shield-halved',
    title: 'Verified Identities',
    desc: 'Every member is verified through their @aston.ac.uk email, no anonymous accounts.',
    gradient: 'linear-gradient(135deg, #0047AB, #00D4FF)'
    
  },
  {
    icon: 'fa-solid fa-gem',
    title: 'Trust Orb',
    desc: 'Visual reputation scores aggregated from structured, attribute-based reviews.',
    gradient: 'linear-gradient(135deg, #6A0DAD, #C77DFF)'
    
  },
  {
    icon: 'fa-solid fa-star-half-stroke',
    title: 'Structured Reviews',
    desc: 'Ratings for punctuality, quality, and communication - not vague free-text feedback.',
    gradient: 'linear-gradient(135deg, #00B4D8, #0047AB)'
    
  },
];

const HOW_IT_WORKS = [
  {
    step: '01',
    icon: 'fa-solid fa-envelope-circle-check',
    title: 'Verify your identity',
    desc: 'Sign up with your @aston.ac.uk email. Your account is confirmed before you can access anything.',
    gradient: 'linear-gradient(135deg, #0047AB, #00D4FF)',
  },
  {
    step: '02',
    icon: 'fa-solid fa-id-card',
    title: 'Build your profile',
    desc: 'Add your skills, bio, year of study, and contact links. Your profile is your verified campus identity.',
    gradient: 'linear-gradient(135deg, #6A0DAD, #C77DFF)',
  },
  {
    step: '03',
    icon: 'fa-solid fa-magnifying-glass',
    title: 'Browse the Campus Feed',
    desc: 'Discover services from verified students. Filter by location - public zones, student living, or remote.',
    gradient: 'linear-gradient(135deg, #00B4D8, #0047AB)',
  },
  {
    step: '04',
    icon: 'fa-solid fa-circle-nodes',
    title: 'Evaluate with the Trust Orb',
    desc: 'View any student\'s Trust Orb - an aggregated visual of their punctuality, quality, and communication.',
    gradient: 'linear-gradient(135deg, #0047AB, #6A0DAD)',
  },
];

// code for the landing page
export default function LandingPage() {
  const navigate = useNavigate();
  useScrollReveal();

  return (
    <div className="min-h-screen overflow-x-hidden">

      {/* header */}
      <header
        className="fixed top-0 left-0 right-0 z-50 border-b border-white/20"
        style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl text-white tracking-widest font-light">VERITY</h1>
            <button
              onClick={() => navigate('/auth')}
              className="px-5 py-2 text-white text-sm rounded-full border border-white/30 hover:bg-white/10 transition-all"
            >
              Sign In
            </button>
          </div>
        </div>
      </header>
      <section
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0047AB 0%, #6A0DAD 50%, #000000 100%)',
        }}
      >
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at top right, rgba(0,71,171,0.4), transparent 50%)' }} />
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at bottom left, rgba(106,13,173,0.4), transparent 50%)' }} />

        <div className="relative z-10 text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-5 py-2 mb-8 backdrop-blur-sm">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-white/80 text-sm tracking-wide">
              Aston University · Verified Access Only
            </span>
          </div>

          <h1
            className="text-6xl sm:text-7xl lg:text-8xl font-light mb-6 leading-tight tracking-tight gradient-animate"
            style={{
              background: 'linear-gradient(135deg, #ffffff, #a78bfa, #60a5fa, #ffffff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Welcome to Verity
          </h1>

          <p className="text-xl text-white/80 mb-4 max-w-xl mx-auto">
            Campus services, built on trust.
          </p>

          <div className="flex items-center justify-center gap-6 mb-12">
            {['Verified', 'Reviewed', 'Trusted'].map((word, i) => (
              <div key={word} className="flex items-center gap-6">
                <span className="text-white/60 text-sm tracking-widest uppercase">{word}</span>
                {i < 2 && <span className="text-white/20">·</span>}
              </div>
            ))}
          </div>

          <button
            onClick={() => navigate('/auth')}
            className="px-12 py-5 text-white rounded-full text-lg font-medium hover:shadow-2xl hover:scale-105 transition-all gradient-animate"
            style={{ background: 'linear-gradient(135deg, #0047AB, #6A0DAD, #0047AB)' }}
          >
            Verify with @aston.ac.uk
          </button>

          <p className="text-white/40 text-xs mt-4">
            Exclusively for verified Aston University students
          </p>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <i className="fa-solid fa-chevron-down text-white/30 text-sm" />
        </div>
      </section>

      {/* instructions */}
      <section
        className="relative py-24 px-4 sm:px-6 lg:px-8"
        style={{
          background: 'linear-gradient(180deg, #000000 0%, #0a0a1a 50%, #0047AB 100%)',
        }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 reveal">
            <span className="text-white/40 text-xs uppercase tracking-widest mb-3 block">
              Simple by design
            </span>
            <h2 className="text-4xl sm:text-5xl text-white font-light mb-4">
              How Verity works
            </h2>
            <p className="text-white/50 text-sm max-w-md mx-auto">
              From sign-up to trusted service discovery in four steps.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {HOW_IT_WORKS.map(({ step, icon, title, desc, gradient }, i) => (
              <div key={step} className={`reveal stagger-${i + 1}`}>
                <div
                  className="relative rounded-3xl p-8 border border-white/10 hover:border-white/25 transition-all h-full"
                  style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(12px)' }}
                >
                  <div className="flex items-start gap-5">
                    <div className="flex-shrink-0">
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg"
                        style={{ background: gradient }}
                      >
                        <i className={`${icon} text-white text-lg`} />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-white/25 text-xs font-mono">{step}</span>
                        <h3 className="text-white font-medium text-base">{title}</h3>
                      </div>
                      <p className="text-white/55 text-sm leading-relaxed">{desc}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* cards */}
      <section
        className="relative py-24 px-4 sm:px-6 lg:px-8"
        style={{
          background: 'linear-gradient(135deg, #0047AB 0%, #6A0DAD 50%, #00CAF3 100%)',
        }}
      >
        <div className="absolute top-20 left-10 w-96 h-96 rounded-full opacity-10 blur-3xl pointer-events-none"
          style={{ background: 'white' }} />
        <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full opacity-10 blur-3xl pointer-events-none"
          style={{ background: 'white' }} />

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-12 reveal">
            <h2 className="text-4xl text-white font-light">Ready to get started?</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">

            <div className="relative group reveal-left">
              <div
                className="absolute inset-0 rounded-3xl opacity-30 blur-xl group-hover:opacity-50 transition-opacity pointer-events-none"
                style={{ background: 'linear-gradient(135deg, #0047AB, #00D4FF)' }}
              />
              <div
                className="relative rounded-3xl p-10 border border-white/20 hover:border-white/40 transition-all"
                style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)' }}
              >
                <div className="text-center">
                  <div
                    className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg float"
                    style={{ background: 'linear-gradient(135deg, #0047AB, #00D4FF)' }}
                  >
                    <i className="fa-solid fa-user-plus text-white text-2xl" />
                  </div>
                  <h3 className="text-2xl text-white font-light mb-3">New Students</h3>
                  <p className="text-white/70 mb-8 text-sm leading-relaxed">
                    Join the verified campus community. Share your skills and connect with peers you can trust.
                  </p>
                  <button
                    onClick={() => navigate('/auth')}
                    className="w-full py-4 text-white rounded-full font-medium hover:scale-105 transition-all text-sm"
                    style={{ background: 'linear-gradient(135deg, #0047AB, #00D4FF)' }}
                  >
                    Verify with @aston.ac.uk
                  </button>
                </div>
              </div>
            </div>

            <div className="relative group reveal-right">
              <div
                className="absolute inset-0 rounded-3xl opacity-20 blur-xl group-hover:opacity-40 transition-opacity pointer-events-none"
                style={{ background: 'linear-gradient(135deg, #6A0DAD, #C77DFF)' }}
              />
              <div
                className="relative rounded-3xl p-10 border border-white/20 hover:border-white/40 transition-all"
                style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)' }}
              >
                <div className="text-center">
                  <div
                    className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center border border-white/30 float-delayed"
                    style={{ background: 'rgba(255,255,255,0.1)' }}
                  >
                    <i className="fa-solid fa-arrow-right-to-bracket text-white text-2xl" />
                  </div>
                  <h3 className="text-2xl text-white font-light mb-3">Returning Users</h3>
                  <p className="text-white/70 mb-8 text-sm leading-relaxed">
                    Welcome back. Access your profile, browse services, and manage your reputation.
                  </p>
                  <button
                    onClick={() => navigate('/auth')}
                    className="w-full py-4 text-white rounded-full font-medium border-2 border-white/40 hover:bg-white/10 transition-all text-sm"
                  >
                    Sign In
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* tagline for why students should trust verity */}
      <section
        className="relative py-24 px-4 sm:px-6 lg:px-8"
        style={{
          background: 'linear-gradient(180deg, #0047AB 0%, #1a1a2e 50%, #000000 100%)',
        }}
      >
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-16 reveal">
            <h2 className="text-4xl sm:text-5xl text-white font-light mb-4">
              Why Students Trust Verity
            </h2>
            <p className="text-white/50 text-sm max-w-md mx-auto">
              Three mechanisms working together to reduce uncertainty in campus service exchange.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {TRUST_PILLARS.map(({ icon, title, desc, gradient, rq }, i) => (
              <div key={title} className={`relative group reveal stagger-${i + 1}`}>
                <div
                  className="relative rounded-3xl p-8 border border-white/10 hover:border-white/25 transition-all h-full"
                  style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(12px)' }}
                >
                  <div className="absolute top-4 right-4">
                    <span className="text-white/20 text-xs font-mono">{rq}</span>
                  </div>
                  <div
                    className="w-14 h-14 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg"
                    style={{ background: gradient }}
                  >
                    <i className={`${icon} text-white text-xl`} />
                  </div>
                  <h3 className="text-lg text-white font-medium mb-3 text-center">{title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed text-center">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        className="relative py-24 px-4 sm:px-6 lg:px-8"
        style={{ background: 'linear-gradient(180deg, #000000 0%, #0a0a1a 100%)' }}
      >
        <div className="max-w-2xl mx-auto text-center relative z-10 reveal">
          <h2 className="text-4xl text-white font-light mb-4">Ready to join?</h2>
          <p className="text-white/50 text-sm mb-8">
            Verify your Aston identity and start building your trusted campus reputation.
          </p>
          <button
            onClick={() => navigate('/auth')}
            className="px-12 py-4 text-white rounded-full font-medium hover:shadow-2xl hover:scale-105 transition-all gradient-animate"
            style={{ background: 'linear-gradient(135deg, #0047AB, #6A0DAD, #0047AB)' }}
          >
            Get Started
          </button>
        </div>
      </section>

      
    </div>
  );
}