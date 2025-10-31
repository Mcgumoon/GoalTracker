/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        violet:  "#B78FCB",
        violet2: "#CB99C7",
        rose1:   "#EFBBCD",
        rose2:   "#FFCBD8",
        rose3:   "#FF91AE",
        divider: "#eeeeee",
        text:    "#222222",
        muted:   "#6b6b6b",
      },
      boxShadow: {
        pastel: "0 8px 24px rgba(183,143,203,0.18)",
        pastelSm: "0 6px 14px rgba(183,143,203,0.30)",
      },
      borderRadius: { xl2: "1rem" },
    },
  },
  plugins: [],
};


