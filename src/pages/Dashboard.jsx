import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
    const { user } = useAuth();
    return (
        <div>
            <h1>Dashboard</h1>
            <p>Welcome back, {" "}
                <span className='font-medium text-purple-600'>
                    {user?.displayName}
                </span>
            </p>
        </div>
    );
}