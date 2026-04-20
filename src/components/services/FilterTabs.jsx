export default function FilterTabs({ tabs, activeTab, onTabChange }) {
  return (
    <div className="flex flex-wrap justify-center gap-3">
      {tabs.map(({ label, value }) => {
        const isActive = activeTab === value;
        return (
          <button
            key={value}
            onClick={() => onTabChange(value)}
            className={`flex items-center space-x-2 px-6 py-3 rounded-full border text-sm transition-all
              ${isActive
                ? 'bg-white text-neutral-800 border-white shadow-md'
                : 'bg-neutral-100 text-neutral-700 border-neutral-300 hover:border-neutral-500 hover:bg-white'
              }`}
          >
            <span>{label}</span>
          </button>
        );
      })}
    </div>
  );
}
