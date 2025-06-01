import { StyleSheet } from "react-native-unistyles";

const lightTheme = {
	colors: {
		primary: "#14B8A6",
		secondary: "rgba(20, 184, 166, 0.12)",
		text: "#000000",
		background: "#F8F9FA",
	},
};

const darkTheme = {
	colors: {
		primary: "#5EEAD4",
		secondary: "rgba(94, 234, 212, 0.15)",
		text: "#FFFFFF",
		background: "#0D1117",
	},
};

const appThemes = {
	light: lightTheme,
	dark: darkTheme,
};

const breakpoints = {
	xs: 0,
	sm: 576,
	md: 768,
	lg: 992,
	xl: 1200,
};

const settings = {
	initialTheme: "light",
} as const;

type AppBreakpoints = typeof breakpoints;
type AppThemes = typeof appThemes;

declare module "react-native-unistyles" {
	export interface UnistylesThemes extends AppThemes {}
	export interface UnistylesBreakpoints extends AppBreakpoints {}
}

StyleSheet.configure({
	themes: appThemes,
	breakpoints,
	settings,
});

export { appThemes, breakpoints };
