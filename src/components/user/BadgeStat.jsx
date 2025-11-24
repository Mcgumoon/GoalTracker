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
          className="w-12 h-12 rounded-full flex items-center justify-center shadow-md badge-gradient-gold"
          aria-hidden
        >
          <div className=" text-3xl">
            🔥
          </div>

          <span className="absolute -bottom-1 -right-1 bg-white text-red-600 text-xs font-bold px-1.5 py-0.5 rounded-full shadow">
            {count}
          </span>
        </div>
      </div>
      <div className="text-sm text-gray-600">Badges</div>
    </div>
  );
}
