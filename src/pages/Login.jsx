// import { Link, Navigate } from "react-router-dom";
// import AuthForm from "../components/AuthForm";
// import { useAuth } from "../context/AuthContext";

// export default function Login() {
//     const { user } = useAuth();
//     if (user) return <Navigate to="/home" replace />;

//     return (
//         <div>
//             <div>
//                 <h1>Login</h1>
//                 <p>New Here?{" "}
//                     <Link to="/register" className="">Create an account</Link>
//                 </p>
//             </div>
//             <AuthForm mode="login" />
//         </div>
//     );
// }

import { Link, useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm";
import { useAuth } from "../context/AuthContext";
import { use, useEffect } from "react";

export default function Login() {
    const { user, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && user) {
            navigate("/home", { replace: true });
        }
    }, [user, loading, navigate]);

    return (
        <div>
            <div>
                <h1>Login</h1>
                <p>New Here?{" "}
                    <Link to="/register" className="">Create an account</Link>
                </p>
            </div>
            <AuthForm mode="login" />
        </div>
    );
}