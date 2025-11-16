// src/components/BadgeStat.jsx
import { useEffect, useRef, useState } from "react";

export default function BadgeStat({ stats }) {
  const count = stats?.badges_count ?? 0;
  const [prev, setPrev] = useState(count);
  const popRef = useRef(null);

  useEffect(() => {
    if (count > prev) {
      // add pop class then remove after animation
      const el = popRef.current;
      if (el) {
        el.classList.remove("badge-pop");
        // force reflow
        void el.offsetWidth;
        el.classList.add("badge-pop");
      }
    }
    setPrev(count);
  }, [count, prev]);

  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <div
          ref={popRef}
          className="w-12 h-12 rounded-full flex items-center justify-center shadow-md bg-gradient-to-br from-orange-400 to-red-500"
          aria-hidden
        >
          {/* fire SVG */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-6 h-6">
            <path d="M12 2c1.5 2.5 3 4 3 6.5 0 1.8-.8 3.5-2 4.5 3.5-.5 5-3.5 5-6 0-3-2-5-3-7-.5 1-1.5 2-3 2zm0 20c-4.5 0-7-3.5-7-7 0-2.5 1.5-5 4-6.5-.2 1-.2 2 0 3 .4 1.7 1.4 3 3 3 1.5 0 2.6-1.3 3-3 .3-1 .3-2 0-3 2.5 1.5 4 4 4 6.5 0 3.5-2.5 7-7 7z"/>
          </svg>

          <span className="absolute -bottom-1 -right-1 bg-white text-red-600 text-xs font-bold px-1.5 py-0.5 rounded-full shadow">
            {count}
          </span>
        </div>
      </div>
      <div className="text-sm text-gray-600">Badges</div>
    </div>
  );
}
