import Navbar from "./Navbar";

export default function Shell({ children }) {
  return (
    <div className="min-h-screen bg-white text-text">
      <Navbar />
      <main className="pt-20 px-4 max-w-6xl mx-auto w-full">{children}</main>
    </div>
  );
}
