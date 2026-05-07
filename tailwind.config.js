module.exports = {
  // ...
  darkMode: ["class"],
  safelist: [
    {
      pattern: /(bg|text|border)-(red|blue|green|emerald|amber|secondary)-(500|20|400)/,
    },
  ],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
}