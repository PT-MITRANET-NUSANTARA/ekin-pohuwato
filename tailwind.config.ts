import type { Config } from "tailwindcss";
import defaultTheme from 'tailwindcss/defaultTheme';

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "color-primary-100": "#E5FAF3",
        "color-primary-200": "#CCF5EC",
        "color-primary-300": "#AAE2DA",
        "color-primary-400": "#88C5C2",
        "color-primary-500": "#5E9EA0",
        "color-primary-600": "#448189",
        "color-primary-700": "#2F6573",
        "color-primary-800": "#1D4A5C",
        "color-primary-900": "#12374C",
        "color-success-100": "#F5FBD2",
        "color-success-200": "#E9F7A7",
        "color-success-300": "#D2E877",
        "color-success-400": "#B5D252",
        "color-success-500": "#90B522",
        "color-success-600": "#779B18",
        "color-success-700": "#5F8211",
        "color-success-800": "#49680A",
        "color-success-900": "#3A5606",
        "color-info-100": "#DCF6FF",
        "color-info-200": "#B9E9FF",
        "color-info-300": "#96D9FF",
        "color-info-400": "#7CC9FF",
        "color-info-500": "#51AEFF",
        "color-info-600": "#3B88DB",
        "color-info-700": "#2865B7",
        "color-info-800": "#194793",
        "color-info-900": "#0F317A",
        "color-warning-100": "#FEF3D6",
        "color-warning-200": "#FEE5AE",
        "color-warning-300": "#FED285",
        "color-warning-400": "#FDC067",
        "color-warning-500": "#FCA235",
        "color-warning-600": "#D88026",
        "color-warning-700": "#B5611A",
        "color-warning-800": "#924610",
        "color-warning-900": "#78320A",
        "color-danger-100": "#FFEBE1",
        "color-danger-200": "#FFD2C4",
        "color-danger-300": "#FFB4A7",
        "color-danger-400": "#FF9891",
        "color-danger-500": "#FF6D70",
        "color-danger-600": "#DB4F5E",
        "color-danger-700": "#B73650",
        "color-danger-800": "#932242",
        "color-danger-900": "#7A143A"
      }
    },
  },
  plugins: [],
};
export default config;
