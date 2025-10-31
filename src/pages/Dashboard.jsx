import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <section className="max-w-5xl mx-auto p-6 pt-20">
      <h1 className="text-3xl md:text-4xl font-extrabold mb-1">Dashboard</h1>
      <p className="subtle">
        Welcome back,{" "}
        <span className="font-semibold text-violet">
          {user?.displayName || "Name Placeholder"}
        </span>
        .
      </p>

      <div className="divider" />
      {/* TODO: add goal list / groups here */}
    </section>
  );
}
