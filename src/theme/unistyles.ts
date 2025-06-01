import { StyleSheet } from "react-native-unistyles";
import { darkTheme, lightTheme } from "./themes";

const breakpoints = {
	xs: 0,
	sm: 576,
	md: 768,
	lg: 992,
	xl: 1200,
};

type AppBreakpoints = typeof breakpoints;

declare module "react-native-unistyles" {
	export interface UnistylesBreakpoints extends AppBreakpoints {}
}

StyleSheet.configure({
	themes: {
		light: lightTheme,
		dark: darkTheme,
	},
	breakpoints,
	settings: {
		initialTheme: "light",
	},
});

export { lightTheme, darkTheme, breakpoints };

