import { Link } from "react-router-dom";

export default function Home() {
  return (
    <section className="max-w-5xl mx-auto p-6 pt-20 md:text-left">
      <h1 className="text-3xl md:text-4xl font-extrabold mb-1">Welcome to Goal Tracker</h1>
      <p className="subtle">Your personal goal management application.</p>
      <div className="divider" />

      {/* Example CTA (optional) */}
      <Link to="/" className="btn btn-primary inline-flex mt-2">Go to Dashboard</Link>
    </section>
  );
}
