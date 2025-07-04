import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable } from "react-native";
import { MMKV } from "react-native-mmkv";
import {
	StyleSheet,
	UnistylesRuntime,
	useUnistyles,
} from "react-native-unistyles";

export const themeStorage = new MMKV({ id: "explora-theme" });

export function ThemeButton() {
	const { theme, rt } = useUnistyles();

	function toggleTheme() {
		const currentTheme = rt.themeName;
		const newTheme = currentTheme === "light" ? "dark" : "light";
		UnistylesRuntime.setTheme(newTheme);
		themeStorage.set("themeName", newTheme);
	}

	const isDark = rt.themeName === "dark";

	return (
		<Pressable style={styles.button} hitSlop={15} onPress={toggleTheme}>
			<Ionicons
				name={isDark ? "sunny" : "moon"}
				size={24}
				color={theme.colors.primaryText}
			/>
		</Pressable>
	);
}

const styles = StyleSheet.create({
	button: {
		padding: 8,
		borderRadius: 20,
		minWidth: 40,
		alignItems: "center",
		justifyContent: "center",
	},
});
