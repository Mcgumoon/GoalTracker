import { useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function Settings() {
    const { user } = useAuth();

    const joined = useMemo(() => {
        try {
            return user?.metadata?.creationTime
                ? new Date(user.metadata.creationTime).toLocaleDateString()
                : "N/A";
        } catch {
            return "N/A";
        }
    }, [user]);

    return (
        <div>
            <section>
                <h1>Account Settings</h1>
                <dl>
                    <div>
                        <dt>Name</dt>
                        <dd>{user?.displayName || "-"}</dd>
                    </div>
                    <div>
                        <dt>Email</dt>
                        <dd>{user?.email}</dd>
                    </div>
                    <div>
                        <dt>Member Since</dt>
                        <dd>{joined}</dd>
                    </div>
                    <div>
                        <dt>Email Verified</dt>
                        <dd>{user?.emailVerified ? "Yes" : "No"}</dd>
                    </div>
                </dl>
                <button>
                    <Link to="/settings/change-password" className="bg-purple-500 text-white">Change Password</Link>
                </button>

            </section>

        </div>
    )
}