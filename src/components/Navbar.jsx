import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const { user, logout } = useAuth();

    return (
        <header className='border-b bg-white/70 backdrop-blur-2xl'>
            <nav className='flex items-center justify-between'>
                <Link to="/" >Goal Tracker</Link>
                <div className='flex items-center gap-3'>
                    {!user ? (
                        <>
                        <NavLink to="/login" className="rounded-md hover:bg-purple-300" >
                            Login
                        </NavLink>
                        <NavLink to="/register" className="rounded-md hover:bg-purple-300" >
                            Register
                        </NavLink>
                        </>
                    ) : (
                        <>
                        <NavLink to="/home" className="rounded-md hover:bg-purple-200">
                            Home
                        </NavLink>
                        <button onClick={logout} className='rounded-md bg-purple-500 hover:bg-purple-300'>
                            Logout
                        </button>
                        </>
                    )}
                </div>
            </nav>
        </header>
    )
}