import type { Config } from "tailwindcss";
import {
  content as flowbiteContent,
  plugin as flowbitePlugin,
} from "flowbite-react/tailwind";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    flowbiteContent(),
  ],
  theme: {
    extend: {
      colors: {
        "custom-white": "#ffffff",
      },
      fontFamily: {
        sans: ["var(--font-montserrat)", "sans-serif"],
      },
    },
  },
  plugins: [flowbitePlugin()],
};

export default config;
