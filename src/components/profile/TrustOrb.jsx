const ATTRIBUTES = [
  { key: 'punctuality', label: 'Punctuality', icon: 'fa-solid fa-clock' },
  { key: 'quality', label: 'Quality', icon: 'fa-solid fa-star' },
  { key: 'communication', label: 'Communication', icon: 'fa-solid fa-comment' },
];

function StarRow({ score }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <i
          key={i}
          className={`fa-solid fa-star text-sm ${
            i <= Math.round(score) ? 'text-white' : 'text-white/30'
          }`}
          style={
            i <= Math.round(score)
              ? { filter: 'drop-shadow(0 0 6px rgba(255,255,255,0.8))' }
              : {}
          }
        />
      ))}
      <span className="text-white text-sm ml-1">{score.toFixed(1)}</span>
    </div>
  );
}

export default function TrustOrb({ scores = {}, reviewCount = 0 }) {
  const { punctuality = 0, quality = 0, communication = 0 } = scores;
  const overall =
    reviewCount > 0
      ? ((punctuality + quality + communication) / 3).toFixed(1)
      : null;

  // radial ring: r=90 circum= 565.48
  const circumference = 565.48;
  const progress = overall ? (parseFloat(overall) / 5) * circumference : 0;
  const dashOffset = circumference - progress;

  return (
    <div className="flex flex-col items-center">
      {/* label */}
      <div className="mb-4 text-center">
        <span className="text-white/60 text-xs uppercase tracking-widest">
          Trust Orb
        </span>
      </div>

      {/* the orb */}
      <div className="relative w-64 h-64 sm:w-80 sm:h-80">
        {/* the ring SVG */}
        <svg
          viewBox="0 0 200 200"
          className="absolute inset-0 w-full h-full -rotate-90"
        >
          <defs>
            <linearGradient id="orbGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0047AB" />
              <stop offset="100%" stopColor="#00D4FF" />
            </linearGradient>
            <filter id="orbGlow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/*background */}
          <circle
            cx="100" cy="100" r="90"
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="10"
          />


          {/* radial progression circle */}
          {overall && (
            <circle
              cx="100" cy="100" r="90"
              fill="none"
              stroke="url(#orbGradient)"
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              filter="url(#orbGlow)"
            />
          )}
        </svg>

        {/* score on the top of the ring */}
        {overall && (
        <div className="absolute top-10 left-1/2 -translate-x-1/2 text-center z-10">
            <span
            className="text-white text-3xl sm:text-4xl font-light"
            style={{ filter: 'drop-shadow(0 0 12px rgba(255,255,255,0.7))' }}
            >
            {overall}
            </span>
        </div>
        )}

        {/* attribute scores inside ring*/}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ padding: '14%' }}
        >
          <div
            className="w-full h-full rounded-full flex flex-col items-center justify-center gap-4 sm:gap-5 border border-white/20"
            style={{
              background: 'rgba(255,255,255,0.07)',
              backdropFilter: 'blur(20px)',
            }}
          >
            {reviewCount === 0 ? (
              <p className="text-white/40 text-xs text-center px-4">
                No reviews yet
              </p>
            ) : (
              ATTRIBUTES.map(({ key, label }) => (
                <div key={key} className="flex flex-col items-center gap-1">
                  <span className="text-white/60 text-[9px] uppercase tracking-widest">
                    {label}
                  </span>
                  <StarRow score={scores[key] || 0} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* review number */}
      <p className="text-white/50 text-xs mt-3">
        {reviewCount > 0 ? `Based on ${reviewCount} review${reviewCount !== 1 ? 's' : ''}` : 'Be the first to review'}
      </p>
    </div>
  );
}