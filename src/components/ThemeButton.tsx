import React from 'react';
import { Pressable, Text } from 'react-native';
import { StyleSheet, UnistylesRuntime } from 'react-native-unistyles';

export default function ThemeButton() {
	const toggleTheme = () => {
		const currentTheme = UnistylesRuntime.themeName;
		const newTheme = currentTheme === 'light' ? 'dark' : 'light';
		UnistylesRuntime.setTheme(newTheme);
	};

	const isDark = UnistylesRuntime.themeName === 'dark';

	return (
		<Pressable style={styles.button} onPress={toggleTheme}>
			<Text style={styles.buttonText}>
				{isDark ? '☀️' : '🌙'}
			</Text>
		</Pressable>
	);
}

const styles = StyleSheet.create((theme) => ({
	button: {
		padding: 8,
		borderRadius: 20,
		backgroundColor: theme.colors.primaryAccent,
		minWidth: 40,
		alignItems: 'center',
		justifyContent: 'center',
	},
	buttonText: {
		fontSize: 18,
	},
})); 