export default function LogoHero({ size = 88, label = "GT" }) {
  return (
    <div
      style={{ width: size, height: size, fontSize: Math.max(22, Math.floor(size*0.42)) }}
      className="mx-auto mb-3 rounded-2xl bg-gradient-to-br from-rose2 to-violet text-white
                 font-extrabold flex items-center justify-center shadow-pastel"
      aria-label="App logo"
    >
      {label}
    </div>
  );
}
