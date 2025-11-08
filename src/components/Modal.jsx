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
        <div className="" aria-modal="true" role="dialog">
            <div className="" onClick={onClose} aria-hidden="true" />
            <div className="">
                <div className="">
                    <h2>{title}</h2>
                    <button onClick={onClose} className="" aria-label="Close modal">
                        x
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
}