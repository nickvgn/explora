export const lightTheme = {
	colors: {
		primary: '#29B8CC',
		primaryAccent: '#C0EDF2',
		primaryText: '#1A2233',
		background: '#FFFCF8',
		cardBackground: '#FFFFFF',
		destructive: '#EF4444',
		success: '#4CAF50',
	}
};

export const darkTheme = {
	colors: {
		primary: '#3ACDE0',
		primaryAccent: '#1E4A4F',
		primaryText: '#F5F5F5',
		background: '#121212',
		cardBackground: '#1E1E1E',
		destructive: '#FF6B6B',
		success: '#66BB6A',
	}
};

// TypeScript type definitions
export type AppThemes = {
	light: typeof lightTheme;
	dark: typeof darkTheme;
};

declare module 'react-native-unistyles' {
	export interface UnistylesThemes extends AppThemes {}
} 