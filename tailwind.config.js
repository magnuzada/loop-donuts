/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#FE6100",
          500: "#FE6100",
          light: "#FFF0E5",
        },
        secondary: {
          DEFAULT: "#FFBD03",
          cta: "#FFBD03",
          "cta-hover": "#E5A900",
        },
        // Aliases adicionados para corrigir a transparência (bg-cta)
        cta: "#FFBD03",
        "cta-hover": "#E5A900",
        paper: "#FFFFFF",
      },
      borderRadius: {
        'card': '16px',
        'btn': '12px',
        'pill': '9999px',
      },
    },
  },
  plugins: [],
}