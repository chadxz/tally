import type { Config } from "tailwindcss";
import daisyui from "daisyui";

export default {
  content: [
    "./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}",
    "node_modules/daisyui/dist/**/*.js",
    "node_modules/react-daisyui/dist/**/*.js",
  ],
  daisyui: {
    logs: false,
    themes: [
      {
        light: {
          primary: "#1E91D6",
          "primary-focus": "#1b7ebb",
          "primary-content": "#ffffff",

          secondary: "#c26040",
          "secondary-focus": "#a85438",
          "secondary-content": "#ffffff",

          accent: "#c7f401",
          "accent-focus": "#bce506",
          "accent-content": "#171718",

          neutral: "#171718",
          "neutral-focus": "#383839",
          "neutral-content": "#ffffff",

          "base-100": "#e8ebed",
          "base-200": "#dddfdf",
          "base-300": "#d0d1d2",
          "base-content": "#171718",

          info: "#1E91D6",
          success: "#71bd99",
          warning: "#ff9900",
          error: "#e65d33",

          "--rounded-box": "1rem",
          "--rounded-btn": ".5rem",
          "--rounded-badge": "1.9rem",
          "--animation-btn": ".25s",
          "--animation-input": ".2s",
          "--btn-text-case": "uppercase",
          "--navbar-padding": ".5rem",
          "--border-btn": "1px",
        },
        dark: {
          primary: "#1E91D6",
          "primary-focus": "#1b7ebb",
          "primary-content": "#1b1c22",

          secondary: "#C26040",
          "secondary-focus": "#a85438",
          "secondary-content": "#1b1c22",

          accent: "#DEFB61",
          "accent-focus": "#b7d33c",
          "accent-content": "#1b1c22",

          neutral: "#22212c",
          "neutral-focus": "#1b1c22",
          "neutral-content": "#71BD99",

          "base-100": "#282f33",
          "base-200": "#22212c",
          "base-300": "#1b1c22",
          "base-content": "#b3ccdb",

          info: "#1E91D6",
          success: "#71BD99",
          warning: "#ff9900",
          error: "#ff6738",

          "--rounded-box": "1rem",
          "--rounded-btn": ".5rem",
          "--rounded-badge": "1.9rem",

          "--animation-btn": ".25s",
          "--animation-input": ".2s",

          "--btn-text-case": "uppercase",
          "--navbar-padding": ".5rem",
          "--border-btn": "1px",
        },

      },
    ],
  },
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '"Inter"',
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
          '"Noto Color Emoji"',
        ],
      },
    },
  },
  plugins: [daisyui],
} satisfies Config;
