// SearchPage.jsx — Campus Feed
// Fetches real services from Supabase, joined with provider profile data
// Supports search by title/description and filter by zone

import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import Header from '../components/layout/Header';
import FilterTabs from '../components/services/FilterTabs';
import SearchBar from '../components/services/SearchBar';
import ServiceGrid from '../components/services/ServiceGrid';

const ZONE_FILTERS = [
  { label: '🏛️ Public Zones', value: 'Public Zones' },
  { label: '🏠 Student Living', value: 'Student Living' },
  { label: '🌐 Remote/Digital', value: 'Remote/Digital' },
];

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);
  if (days > 0) return `${days} day${days !== 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  return `${mins} min${mins !== 1 ? 's' : ''} ago`;
}

function ServiceCard({ service, onViewProfile }) {
  const { title, description, category, price, location, zone, created_at, provider } = service;
  const avatarUrl = provider?.avatar_url ||
    `https://api.dicebear.com/7.x/notionists/svg?scale=200&seed=${provider?.id || 'default'}`;

  return (
    <div className="bg-neutral-100 rounded-2xl overflow-hidden hover:shadow-2xl transition-all border border-neutral-300 flex flex-col">
      <div className="p-6 flex flex-col flex-1">

        {/* Avatar + Title */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <img
              src={avatarUrl}
              alt={provider?.username}
              className="w-10 h-10 rounded-full flex-shrink-0"
            />
            <div>
              <p className="text-neutral-700 text-base font-medium leading-tight">{title}</p>
              <p className="text-neutral-500 text-xs mt-0.5">{timeAgo(created_at)}</p>
            </div>
          </div>
          {provider?.verified_student && (
            <div className="flex items-center gap-1 bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full border border-green-200 flex-shrink-0">
              <i className="fa-solid fa-check text-[10px]" />
              <span>Verified</span>
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-neutral-600 text-sm leading-relaxed mb-4 line-clamp-2 flex-1">
          {description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-5">
          {category && (
            <span className="px-3 py-1 bg-white text-neutral-600 text-xs rounded-full border border-neutral-200">
              {category}
            </span>
          )}
          {zone && (
            <span className="px-3 py-1 bg-white text-neutral-600 text-xs rounded-full border border-neutral-200">
              {zone}
            </span>
          )}
        </div>

        {/* Price + provider */}
        <div className="flex items-center justify-between text-sm text-neutral-600 mb-5">
          {price && (
            <span className="flex items-center gap-1">
              <i className="fa-solid fa-tag text-xs" />
              <span>{price}</span>
            </span>
          )}
          {provider?.username && (
            <span className="text-neutral-400 text-xs">@{provider.username}</span>
          )}
        </div>

        {/* Location + button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-neutral-600 text-sm">
            <i className="fa-solid fa-map-pin text-xs" />
            <span>{location}</span>
          </div>
          <button
            onClick={() => onViewProfile(provider?.id)}
            className="px-5 py-2 bg-white text-black text-sm rounded-full hover:bg-neutral-200 transition-all border border-neutral-200"
          >
            View Profile
          </button>
        </div>

      </div>
    </div>
  );
}

export default function SearchPage() {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeZone, setActiveZone] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      const { data, error } = await supabase
        .from('services')
        .select(`
          *,
          provider:provider_id (
            id,
            username,
            full_name,
            avatar_url,
            verified_student
          )
        `)
        .order('created_at', { ascending: false });

      if (!error && data) setServices(data);
      setLoading(false);
    };
    fetchServices();
  }, []);

  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = !q ||
        service.title?.toLowerCase().includes(q) ||
        service.description?.toLowerCase().includes(q) ||
        service.category?.toLowerCase().includes(q) ||
        service.provider?.username?.toLowerCase().includes(q);

      const matchesZone = !activeZone || service.zone === activeZone;

      return matchesSearch && matchesZone;
    });
  }, [services, searchQuery, activeZone]);

  const handleZoneToggle = (zone) => {
    setActiveZone((prev) => (prev === zone ? null : zone));
  };

  return (
    <div className="w-full min-h-screen bg-neutral-100">
      <Header />

      {/* Hero */}
      <section
        className="relative pt-24 pb-8 px-4 sm:px-6 lg:px-8"
        style={{ background: 'linear-gradient(135deg, #0047AB 0%, #6A0DAD 50%, #1E1E2E 100%)' }}
      >
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at top, rgba(255,255,255,0.05), transparent 50%)' }} />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="mb-8">
            <h1 className="text-4xl text-white font-light tracking-wide">Campus Feed</h1>
          </div>
          <div className="mb-8">
            <SearchBar
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onSearch={() => {}}
              placeholder="Search for services, skills, or keywords..."
            />
          </div>
          <div className="max-w-3xl mx-auto">
            <p className="text-white/60 text-sm mb-3 text-center">Filter by Service Location:</p>
            <FilterTabs
              tabs={ZONE_FILTERS}
              activeTab={activeZone}
              onTabChange={handleZoneToggle}
            />
          </div>
        </div>
      </section>

      {/* Grid */}
      <section
        className="relative py-12 px-4 sm:px-6 lg:px-8"
        style={{ background: 'linear-gradient(to right, #690DAB 0%, #decfe8 100%)' }}
      >
        <div className="max-w-7xl mx-auto relative z-10">

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-10 h-10 rounded-full border-4 border-white/20 border-t-white animate-spin" />
            </div>
          ) : filteredServices.length > 0 ? (
            <ServiceGrid>
              {filteredServices.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  onViewProfile={(id) => id && navigate(`/profile/${id}`)}
                />
              ))}
            </ServiceGrid>
          ) : (
            <div className="text-center py-20">
              <i className="fa-solid fa-magnifying-glass text-4xl text-white/40 mb-4 block" />
              <p className="text-white/60 text-lg">No services found matching your search.</p>
              <button
                onClick={() => { setSearchQuery(''); setActiveZone(null); }}
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