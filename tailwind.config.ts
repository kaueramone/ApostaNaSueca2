import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                ios: {
                    blue: "#007AFF",
                    green: "#34C759",
                    indigo: "#5856D6",
                    orange: "#FF9500",
                    pink: "#FF2D55",
                    purple: "#AF52DE",
                    red: "#FF3B30",
                    teal: "#5AC8FA",
                    yellow: "#FFCC00",
                    gray: "#8E8E93",
                    gray2: "#AEAEB2",
                    gray3: "#C7C7CC",
                    gray4: "#D1D1D6",
                    gray5: "#E5E5EA",
                    gray6: "#F2F2F7",
                },
                background: "var(--background)",
                foreground: "var(--foreground)",
            },
            fontFamily: {
                sans: ["var(--font-inter)"],
            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic":
                    "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            },
        },
    },
    plugins: [],
};
export default config;
