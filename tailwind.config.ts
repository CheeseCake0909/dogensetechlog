import type { Config } from "tailwindcss";
import fluid, { extract, screens, fontSize } from "fluid-tailwind";

const config: Config = {
  darkMode: 'class',
  content: {
    files: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  extract
},
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        ElenaShine: "var(--font-ElenaShine)",
      },
    },
    screens,　// Fluidが提供するレスポンシブ対応のスクリーンサイズを追加
    fontSize,　// Fluidによって拡張されたフォントサイズを使用可能にする
  },
  plugins: [require('@tailwindcss/typography'),fluid],
  safelist: [
    "aspect-video",
    "relative",
    "overflow-hidden",
    "rounded-lg",
    "my-6",
    "[&>iframe]:absolute",
    "[&>iframe]:inset-0",
    "[&>iframe]:w-full",
    "[&>iframe]:h-full",
  ]
};
export default config;
