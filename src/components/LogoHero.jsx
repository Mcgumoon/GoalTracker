export default function LogoHero({ size = 88, label = "GT" }) {
  const fontSize = Math.max(24, Math.floor(size * 0.42));
  return (
    <div
      aria-label="App logo"
      className="
        mx-auto mb-4 flex items-center justify-center select-none
        rounded-2xl text-white font-extrabold tracking-wide uppercase
        bg-rose2 bg-gradient-to-br from-rose2 via-rose3 to-violet
        shadow-pastel ring-2 ring-rose3/60
        hover:scale-105 transition-transform duration-300 ease-out
      "
      style={{ width: size, height: size, fontSize, lineHeight: 1 }}
    >
      <span className="drop-shadow-[0_2px_3px_rgba(0,0,0,0.35)]">{label}</span>
    </div>
  );
}