import { useEffect } from "react";

export default function Modal({ open, title, children, onClose }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      aria-modal="true"
      role="dialog"
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal container */}
      <div className="relative w-full max-w-lg mx-4 bg-white rounded-2xl shadow-[0_18px_30px_rgba(199,139,255,0.12)] border border-rose1/30 p-6 z-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-rose2/20 transition"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">{children}</div>
      </div>
    </div>
  );
}
