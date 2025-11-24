import { useNavigate } from "react-router-dom";
import ChangePasswordForm from "../components/user/ChangePasswordForm";

export default function ChangePassword() {
  const navigate = useNavigate();

  return (
    <section className="page-auth text-left">
      <h1 className="text-3xl md:text-4xl font-extrabold">Change Password</h1>
      <p className="subtle mb-8">Keep your account secure.</p>

      <div className="auth-card">
        <ChangePasswordForm
          onSuccess={() => {}}
          onCancel={() => navigate(-1)}
        />
      </div>
    </section>
  );
}
