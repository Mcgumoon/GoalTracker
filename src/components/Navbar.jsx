import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
    const { user, logout } = useAuth();
    const [open, setOpen] = useState(false);
    const location = useLocation();

    const toggle = () => setOpen(v => !v);
    const close = () => setOpen(false);

    
    useEffect(() => { close(); }, [location.pathname]);

    
    useEffect(() => {
        if (!open) return;
        const onKey = (e) => e.key === "Escape" && close();
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open]);

    const itemClass = ({ isActive }) =>
        "flex items-center gap-3 rounded-xl px-3 py-2 transition " +
        (isActive ? "bg-white/30 text-white" : "text-white/90 hover:bg-white/20");

    return (
        <>
            {/* Top bar */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-divider h-16">
                <div className="h-full px-4 flex items-center gap-3">
                   
                    {user ? (
                        <button
                            type="button"
                            aria-label={open ? "Close menu" : "Open menu"}
                            aria-controls="app-drawer"
                            aria-expanded={open}
                            onClick={toggle}
                            className="h-10 w-10 inline-flex items-center justify-center rounded-xl bg-white/70 hover:bg-white
                         shadow-pastelSm active:translate-y-[1px] transition"
                        >
                           
                            <span className="relative block h-5 w-6">
                                <span
                                    className={`absolute left-0 top-0 h-0.5 w-6 rounded bg-[#6f3f83] transition-transform duration-300
                    ${open ? 'translate-y-2 rotate-45' : ''}`}
                                />
                                <span
                                    className={`absolute left-0 top-2 h-0.5 w-6 rounded bg-[#6f3f83] transition-all duration-300
                    ${open ? 'opacity-0' : 'opacity-100'}`}
                                />
                                <span
                                    className={`absolute left-0 top-4 h-0.5 w-6 rounded bg-[#6f3f83] transition-transform duration-300
                    ${open ? '-translate-y-2 -rotate-45' : ''}`}
                                />
                            </span>
                        </button>
                    ) : (
                        <div className="w-10" />
                    )}

                    <Link
                        to={user ? "/" : "/login"}
                        className="no-underline flex items-center gap-2 group transition-transform duration-300"
                    >
                        {/* Mini Logo */}
                        <span className=" inline-flex items-center justify-center select-none rounded-lg text-white font-extrabold tracking-wide bg-gradient-to-br from-rose2 via-rose3 to-violet shadow-pastelSm-[0_4px_12px_rgba(183,143,203,0.35)] ring-1 ring-rose3/50 group-hover:scale-110 group-hover:shadow-pastelSm transition-all duration-300 ease-out" style={{ width: 32, height: 32, fontSize: 14, lineHeight: 1,}} aria-hidden="true" title="GT">
                            GT
                        </span>

                        {/* Text */}
                        <span className=" font-extrabold text-violet text-xl tracking-tight group-hover:text-violet2 transition-colors duration-300">
                            Goal Tracker
                        </span>
                    </Link>
                </div>
            </header>

            
            {user && (
                <>
                    {/* Backdrop */}
                    <div
                        onClick={close}
                        className={`fixed inset-0 bg-black/30 z-30 transition-opacity
                        ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}
                    />

                   
                    <aside
                        id="app-drawer"
                        className={`fixed z-40 top-0 left-0 h-full w-64 bg-violet 
                        transition-transform duration-300
                        ${open ? "translate-x-0" : "-translate-x-full"}`}
                        aria-label="App navigation"
                    >
                        <div className="h-16" />
                        <nav className="p-4 flex flex-col gap-2">
                            <NavLink to="/" className={itemClass} onClick={close}>Home</NavLink>
                            <NavLink to="/settings" className={itemClass} onClick={close}>Settings</NavLink>
                            <NavLink to="/completed-goal-history" className={itemClass} onClick={close}>Completed Goal History</NavLink>
                            <div className="divider" />
                            <button
                                onClick={() => { logout(); close(); }}
                                className="text-left mt-2 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white"
                            >
                                Logout
                            </button>
                        </nav>
                    </aside>
                </>
            )}
        </>
    );
}
