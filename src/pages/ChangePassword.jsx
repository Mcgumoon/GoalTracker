import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ChangePasswordForm from "../components/ChangePasswordForm";

export default function ChangePassword() {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleSuccess = async () => {
        await logout();
        navigate("/login", { replace: true });
    };

    const handleCancel = () => {
        navigate("/settings", { replace: true });
    };

    return (
        <div>
            <ChangePasswordForm onSuccess={handleSuccess} onCancel={handleCancel} />
        </div>
    )
}