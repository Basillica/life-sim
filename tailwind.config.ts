import type { Config } from "tailwindcss";

const config: Config = {
	content: [
		"./index.html",
		"./src/**/*.{js,ts,jsx,tsx,css,md,mdx,html,json,scss}",
	],
	darkMode: "class",
	safelist: [
		{
			pattern: /order.+/,
		},
	],
	theme: {
		extend: {
			colors: {
				gray: "rgba(204, 204, 204)",
				nightBlue: "rgba(0,90,180)",
				lightBlue: "rgba(0, 160, 210, 1)",
			},
			transitionProperty: {
				height: "height",
				width: "width",
			},
		},
	},
	plugins: [],
};

export default config;
