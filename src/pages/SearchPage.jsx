import { useState, useMemo } from 'react';
import Header from '../components/layout/Header';
import FilterTabs from '../components/services/FilterTabs';
import SearchBar from '../components/services/SearchBar';
import ServiceCard from '../components/services/ServiceCard';
import ServiceGrid from '../components/services/ServiceGrid';

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_SERVICES = [
  {
    id: 1,
    title: 'Study Group - Calculus II',
    description:
      'Looking for 3-4 students to join our weekly calculus study sessions. We cover problem sets and prepare for exams together in a relaxed but focused environment.',
    tags: ['Mathematics', 'Study Group'],
    postedAt: '2 hours ago',
    avatarSeed: '5678',
    meta: [
      { icon: 'fa-solid fa-users', label: '4/8' },
      { icon: 'fa-solid fa-clock', label: 'Weekly' },
    ],
    location: 'Library (Floor 2)',
    zone: 'Public Zones',
    actionLabel: 'Join',
  },
  {
    id: 2,
    title: 'Guitar Lessons Available',
    description:
      'Offering beginner to intermediate guitar lessons. 3 years experience teaching. Flexible schedule and very affordable rates — first session free!',
    tags: ['Music', 'Lessons'],
    postedAt: '5 hours ago',
    avatarSeed: '9012',
    meta: [
      { icon: 'fa-solid fa-star', label: '4.9' },
      { icon: 'fa-solid fa-pound-sign', label: '£15/hr' },
    ],
    location: 'Lakeside Common Room',
    zone: 'Student Living',
    actionLabel: 'Contact',
  },
  {
    id: 3,
    title: 'Coding Bootcamp Prep',
    description:
      'Join our intensive coding preparation sessions. Covering algorithms, data structures, and interview preparation. All skill levels welcome.',
    tags: ['Programming', 'Career Prep'],
    postedAt: '1 day ago',
    avatarSeed: '3456',
    meta: [
      { icon: 'fa-solid fa-users', label: '8/12' },
      { icon: 'fa-solid fa-calendar', label: '3x/week' },
    ],
    location: 'Student Union (Tech Hub)',
    zone: 'Public Zones',
    actionLabel: 'Apply',
  },
  {
    id: 4,
    title: 'Photography Workshop',
    description:
      'Learn portrait and landscape photography techniques. Equipment provided. Perfect for beginners and intermediate photographers looking to level up.',
    tags: ['Photography', 'Creative'],
    postedAt: '3 hours ago',
    avatarSeed: '7890',
    meta: [
      { icon: 'fa-solid fa-camera', label: 'Equipment inc.' },
      { icon: 'fa-solid fa-pound-sign', label: '£25' },
    ],
    location: 'Arts Building (Studio 3)',
    zone: 'Public Zones',
    actionLabel: 'Register',
  },
  {
    id: 5,
    title: 'Language Exchange',
    description:
      'Native Spanish speaker looking to practice English. Can help with Spanish conversation in return. Coffee meetups welcome — casual and friendly!',
    tags: ['Languages', 'Cultural Exchange'],
    postedAt: '6 hours ago',
    avatarSeed: '1357',
    meta: [
      { icon: 'fa-solid fa-globe', label: 'Spanish ↔ English' },
      { icon: 'fa-solid fa-mug-hot', label: 'Casual' },
    ],
    location: 'Campus Café (Central)',
    zone: 'Student Living',
    actionLabel: 'Connect',
  },
  {
    id: 6,
    title: 'Virtual Study Session',
    description:
      'Online study group for Economics students. Weekly Zoom sessions covering macro and microeconomics topics. Recording shared after each session.',
    tags: ['Economics', 'Online'],
    postedAt: '4 hours ago',
    avatarSeed: '2468',
    meta: [
      { icon: 'fa-solid fa-video', label: 'Zoom' },
      { icon: 'fa-solid fa-users', label: '6/10' },
    ],
    location: '🌐 Remote/Digital',
    zone: 'Remote/Digital',
    actionLabel: 'Join',
  },
];

const ZONE_FILTERS = [
  { label: '🏛️ Public Zones', value: 'Public Zones' },
  { label: '🏠 Student Living', value: 'Student Living' },
  { label: '🌐 Remote/Digital', value: 'Remote/Digital' },
];

// ─── Page Component ───────────────────────────────────────────────────────────
export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeZone, setActiveZone] = useState(null);

  const filteredServices = useMemo(() => {
    return MOCK_SERVICES.filter((service) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        );

      const matchesZone = activeZone === null || service.zone === activeZone;

      return matchesSearch && matchesZone;
    });
  }, [searchQuery, activeZone]);

  const handleZoneToggle = (zone) => {
    setActiveZone((prev) => (prev === zone ? null : zone));
  };

  return (
    <div className="w-full min-h-screen bg-neutral-100">

      {/* ── Header ── */}
      <Header />

      {/* ──  Search + Zone Filter ── */}
      <section
        className="relative pt-24 pb-8 px-4 sm:px-6 lg:px-8"
        style={{
          background:
            'linear-gradient(135deg, #0047AB 0%, #6A0DAD 50%, #1E1E2E 100%)',
        }}
      >
       
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at top, rgba(255,255,255,0.05), transparent 50%)',
          }}
        />

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-4xl text-white font-light tracking-wide">
              Campus Feed
            </h1>
          </div>

          {/* Search Bar */}
          <div className="mb-8">
            <SearchBar
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onSearch={() => {}} // triggered live via onChange
              placeholder="Search for services, skills, or keywords..."
            />
          </div>

          {/* Location Filter Tabs */}
          <div className="max-w-3xl mx-auto">
            <p className="text-white/60 text-sm mb-3 text-center">
              Filter by Service Location:
            </p>
            <FilterTabs
              tabs={ZONE_FILTERS}
              activeTab={activeZone}
              onTabChange={handleZoneToggle}
            />
          </div>
        </div>
      </section>

      {/* ── Services Grid for the cards── */}
      <section
        className="relative py-12 px-4 sm:px-6 lg:px-8"
        style={{
          background: 'linear-gradient(to right, #690DAB 0%, #decfe8 100%)',
        }}
      >
        <div className="max-w-7xl mx-auto relative z-10">
          {filteredServices.length > 0 ? (
            <ServiceGrid>
              {filteredServices.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </ServiceGrid>
          ) : (
            <div className="text-center py-20">
              <i className="fa-solid fa-magnifying-glass text-4xl text-white/40 mb-4 block" />
              <p className="text-white/60 text-lg">
                No services found matching your search.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveZone(null);
                }}
                className="mt-4 px-6 py-2 bg-white/10 text-white text-sm rounded-full hover:bg-white/20 transition-all"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
