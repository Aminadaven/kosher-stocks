/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      fontFamily: {
        'lulav': ['lulav', 'sans-serif']
      },},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      // {
        // aqua: {
          // ...require("daisyui/src/theming/themes")["[data-theme=aqua]"],
          // "base-100": "#d6d3d1",
        // },
      // },
      "aqua", 
      "luxury", ],
  }
}
