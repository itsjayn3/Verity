export default function SearchBar({ value, onChange, onSearch, placeholder }) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') onSearch?.();
  };

  return (
    <div className="relative max-w-2xl mx-auto">
      <i className="fa-solid fa-search absolute left-5 top-1/2 -translate-y-1/2 text-neutral-500 z-10" />
      <input
        type="text"
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder || 'Search...'}
        className="w-full px-6 py-4 pl-14 bg-neutral-100 border border-neutral-300 rounded-full text-neutral-700 placeholder-neutral-500 focus:outline-none focus:border-neutral-500 transition-all text-sm"
      />
      <button
        onClick={onSearch}
        className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-white text-black text-sm rounded-full hover:bg-neutral-200 transition-all border border-neutral-200"
      >
        Search
      </button>
    </div>
  );
}
