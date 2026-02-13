// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  darkMode: "class", // 'media' or 'class'
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "1.5rem",
        lg: "2rem",
      },
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1280px", // Limite max-width à 1280px pour les grands écrans
      },
    },
    extend: {
      fontFamily: {
        heading: ["Outfit", "sans-serif"],
        body: ["Poppins", "sans-serif"],
      },
      colors: {
        // Design System Colors mapping to CSS Variables
        primary: {
          DEFAULT: "var(--espace-vert)", // #14532d
          light: "#166534", // Pour les hovers
          dark: "#052e16",
        },
        secondary: {
          DEFAULT: "var(--espace-or)", // #facc15
          light: "#fde047",
          dark: "#eab308",
        },
        surface: {
          DEFAULT: "var(--surface)",
          hover: "var(--surface-hover)",
        },
        background: "var(--background)",
        border: "var(--border)",
      },
      borderRadius: {
        xl: "1rem", // Standard pour vos cartes
        "2xl": "1.5rem", // Standard pour vos sections
      },
      animation: {
        "fade-in-up": "fadeInUp 0.5s ease-out",
        "fade-in": "fadeIn 0.3s ease-out",
        "slide-up": "slideUp 0.3s ease-out",
        "scale-in": "scaleIn 0.2s ease-out",
      },
      keyframes: {
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.9)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
      screens: {
        xs: "475px", // Ajout breakpoint très petit mobile
      },
    },
  },
  plugins: [],
};
