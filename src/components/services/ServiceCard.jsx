import { useNavigate } from 'react-router-dom';


export default function ServiceCard({ service }) {
  const {
    title,
    description,
    tags = [],
    postedAt,
    avatarSeed,
    meta = [],
    location,
  } = service;

  const navigate = useNavigate();

<button onClick={() => navigate(`/profile/${service.id}`)}>
  View Profile
</button>

  return (
    <div className="bg-neutral-100 rounded-2xl overflow-hidden hover:shadow-2xl transition-all border border-neutral-300 flex flex-col">
      <div className="p-6 flex flex-col flex-1">

        {/* avatar + title */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <img
              src={`https://api.dicebear.com/7.x/notionists/svg?scale=200&seed=${avatarSeed}`}
              alt="User avatar"
              className="w-10 h-10 rounded-full flex-shrink-0"
            />
            <div>
              <p className="text-neutral-700 text-base font-medium leading-tight">{title}</p>
              <p className="text-neutral-500 text-xs mt-0.5">{postedAt}</p>
            </div>
          </div>
        </div>

        {/* desc */}
        <p className="text-neutral-600 text-sm leading-relaxed mb-4 line-clamp-2 flex-1">
          {description}
        </p>

        {/* tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-5">
            {tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-white text-neutral-600 text-xs rounded-full border border-neutral-200"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* info */}
        {meta.length > 0 && (
          <div className="flex items-center justify-between text-sm text-neutral-600 mb-5">
            {meta.map(({ icon, label }) => (
              <span key={label} className="flex items-center space-x-1">
                <i className={`${icon} text-xs`} />
                <span>{label}</span>
              </span>
            ))}
          </div>
        )}

        {/* footer: location + action */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-neutral-600 text-sm">
            <i className="fa-solid fa-map-pin text-xs" />
            <span>{location}</span>
          </div>
          <button className="px-5 py-2 bg-white text-black text-sm rounded-full hover:bg-neutral-200 transition-all border border-neutral-200">
            View Profile
          </button>
        </div>

      </div>
    </div>
  );
}
