import { useState } from 'react';
import Header from '../components/layout/Header';

const FAQS = [
  {
    q: 'Who can use Verity?',
    a: 'Verity is exclusively for Aston University students. You must sign up with a valid @aston.ac.uk email address to access the platform.'
  },
  {
    q: 'How do I know if a user is a real student?',
    a: 'Every Verity account is verified through Aston University email confirmation. You cannot create an account or access the platform without confirming your @aston.ac.uk email. Verified users display a green Verified Student badge on their profile.'
  },
  {
    q: 'What is the Trust Orb?',
    a: 'The Trust Orb is a visual reputation indicator on every profile. It aggregates structured reviews across three attributes: punctuality, quality and communication into a single score. The outer ring shows your overall score and the inner breakdown shows how you perform on each attribute.'
  },
  {
    q: 'How do reviews work?',
    a: 'After using a service, you can leave a structured review rating the provider on punctuality, quality and communication (each out of 5). You can also leave an optional comment. Each reviewer can only leave one review per provider to prevent duplicate submissions.'
  },
  {
    q: 'Can I review myself?',
    a: 'No, the system prevents self-reviews.'
  },
  {
    q: 'How do I contact a service provider?',
    a: 'Verity does not currently handle messaging directly. Each provider can attach their social media contacts on their profile so you can reach out to them directly to arrange services.'
  },
  {
    q: 'Is Verity free to use?',
    a: 'Yes! Verity is completely free to use. Service providers set their own prices for their services. Some services are offered for free by students who want to build their portfolio or give back to the community.'
  },
  {
    q: 'How do I post a service?',
    a: 'Once logged in, click "Post a Service" in the navigation bar. Fill in your service title, description, category, zone and price. Your service will appear on the Campus Feed immediately after posting.'
  },
];

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-neutral-100 rounded-2xl border border-neutral-300 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-neutral-50 transition-all"
      >
        <span className="text-neutral-700 font-medium text-sm pr-4">{q}</span>
        <i className={`fa-solid fa-chevron-down text-neutral-400 text-xs transition-transform flex-shrink-0 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="px-6 pb-5">
          <p className="text-neutral-500 text-sm leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
}

export default function FAQsPage() {
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
          <p className="text-white/50 text-xs uppercase tracking-widest mb-3">Help</p>
          <h1 className="text-5xl text-white font-light tracking-wide mb-4">FAQs</h1>
          <p className="text-white/70 text-lg">Everything you need to know about Verity.</p>
        </div>
      </section>

      {/* FAQ list */}
      <section
        className="py-16 px-4 sm:px-6 lg:px-8"
        style={{ background: 'linear-gradient(to right, #690DAB 0%, #decfe8 100%)' }}
      >
        <div className="max-w-3xl mx-auto space-y-3">
          {FAQS.map((faq) => (
            <FAQItem key={faq.q} q={faq.q} a={faq.a} />
          ))}
        </div>
      </section>
    </div>
  );
}
