// src/components/EmptyState.jsx
export default function EmptyState({
  title = "No goals yet",
  subtitle = 'Click "New Goal" to create your first one.',
  size = 220,
}) {
  return (
    <div className="flex flex-col items-center gap-4 py-8">
      <div
        className="rounded-2xl shadow-pastel p-4 bg-gradient-to-br from-rose2/60 to-violet/60"
        style={{ width: size, height: size, display: "grid", placeItems: "center" }}
      >
        {/* Simple SVG: a checklist / star-like illustration */}
        <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="10" width="60" height="44" rx="6" fill="white" opacity="0.9"/>
          <path d="M16 22h32" stroke="#D8B4FE" strokeWidth="2.5" strokeLinecap="round"/>
          <path d="M16 32h32" stroke="#FBCFE8" strokeWidth="2.5" strokeLinecap="round"/>
          <circle cx="48" cy="20" r="3.5" fill="#7C3AED"/>
          <path d="M20 42l6 6 12-12" stroke="#7C3AED" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <p className="subtle text-sm mt-1 text-gray-600">{subtitle}</p>
      </div>
    </div>
  );
}
