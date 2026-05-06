/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
    "./src/context/**/*.{js,jsx,ts,tsx}",
    "./src/hooks/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
          cyber: {
          bg: "#050505",
          card: "#0a0a0a",
          panel: "#1a1a1a",
          red: "#ff1a1a",
          redSoft: "rgba(255,26,26,0.14)",
          muted: "#9ca3af",
          line: "rgba(255,26,26,0.10)",
          glow: "rgba(255,26,26,0.25)"
        }
      },
      boxShadow: {
        glow: "0 0 20px rgba(255,0,0,0.5)",
        "glow-strong": "0 0 18px rgba(255,0,0,0.55), 0 0 64px rgba(255,0,0,0.25)",
        "glow-hero": "0 0 70px rgba(255,0,0,0.5), 0 0 140px rgba(255,0,0,0.18)",
        "glow-card": "0 0 25px rgba(255,0,0,0.35)",
        soft: "0 18px 80px rgba(0,0,0,0.45)"
      },
        fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        display: ["var(--font-poppins)", "Poppins", "Inter", "system-ui", "sans-serif"],
        cyber: ["Orbitron", "var(--font-poppins)", "Poppins", "monospace"]
      },
        backgroundImage: {
        "cyber-grid": 
          "linear-gradient(rgba(255,26,26,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,26,26,0.08) 1px, transparent 1px)",
        "radial-glow": "radial-gradient(circle at 30% 70%, rgba(255,26,26,0.2) 0%, transparent 50%)",
        scan:
          "linear-gradient(180deg, transparent 0%, rgba(255,26,26,0.08) 50%, transparent 100%)"
      },
      backgroundSize: {
        "grid": "40px 40px"
      },
        animation: {
        scan: "scan 8s linear infinite",
        glitch: "glitch 2.8s infinite",
        pulseGlow: "pulseGlow 2.4s ease-in-out infinite",
        "hero-glow": "pulseGlow 3s ease-in-out infinite",
        "hud-ring": "hud-rotate 20s linear infinite"
      },
      keyframes: {
        "hud-rotate": {
          "0%, 100%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" }
        }
      }
    }
  },
  plugins: []
};
