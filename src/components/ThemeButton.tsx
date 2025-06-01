import React from 'react';
import { Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, useUnistyles, UnistylesRuntime } from 'react-native-unistyles';

export default function ThemeButton() {
	const { theme, rt } = useUnistyles();
	
	const toggleTheme = () => {
		const currentTheme = rt.themeName;
		const newTheme = currentTheme === 'light' ? 'dark' : 'light';
		UnistylesRuntime.setTheme(newTheme);
	};

	const isDark = rt.themeName === 'dark';

	return (
		<Pressable style={styles.button} onPress={toggleTheme}>
			<Ionicons 
				name={isDark ? 'sunny' : 'moon'} 
				size={24} 
				color={theme.colors.primaryText} 
			/>
		</Pressable>
	);
}

const styles = StyleSheet.create((theme) => ({
	button: {
		padding: 8,
		borderRadius: 20,
		minWidth: 40,
		alignItems: 'center',
		justifyContent: 'center',
	},
})); 