const ATTRIBUTES = [
  { key: 'punctuality', label: 'Punctuality' },
  { key: 'quality', label: 'Quality' },
  { key: 'communication', label: 'Communication' },
];

function MiniStars({ score }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <i key={i}
          className={`fa-solid fa-star text-xs ${i <= Math.round(score) ? 'text-neutral-700' : 'text-neutral-300'}`} />
      ))}
    </div>
  );
}

export default function ReviewCard({ review }) {
  const {
    reviewerName,
    reviewerSeed,
    avatarUrl,
    comment,
    punctuality,
    quality,
    communication,
    createdAt,
    verified = true,
  } = review;

  return (
    <div className="bg-neutral-100 rounded-2xl p-6 border border-neutral-300 hover:shadow-xl transition-all">
      {/* reviewer */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <img
            src={avatarUrl || `https://api.dicebear.com/7.x/notionists/svg?scale=200&seed=${reviewerSeed}`}
            alt={reviewerName}
            className="w-10 h-10 rounded-full border-2 border-neutral-300"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-neutral-700 font-medium text-sm">@{reviewerName}</span>
              {verified && (
                <span className="flex items-center gap-1 bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full border border-green-200">
                  <i className="fa-solid fa-check text-[10px]" />Verified Student
                </span>
              )}
            </div>
            <span className="text-neutral-400 text-xs">{createdAt}</span>
          </div>
        </div>
      </div>

      {/* scores */}
      <div className="grid grid-cols-3 gap-3 mb-4 p-3 bg-white rounded-xl border border-neutral-200">
        {ATTRIBUTES.map(({ key, label }) => (
          <div key={key} className="flex flex-col items-center gap-1">
            <span className="text-neutral-500 text-[10px] uppercase tracking-wider">{label}</span>
            <MiniStars score={review[key] || 0} />
            <span className="text-neutral-600 text-xs font-medium">{(review[key] || 0).toFixed(1)}</span>
          </div>
        ))}
      </div>

      {/* user's comment */}
      {comment && (
        <p className="text-neutral-600 text-sm leading-relaxed">{comment}</p>
      )}
    </div>
  );
}