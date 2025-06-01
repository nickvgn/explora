import React, { ReactNode } from "react";
import { View, StyleSheet } from "react-native";
import { useFonts, Manrope_400Regular, Manrope_500Medium, Manrope_600SemiBold, Manrope_700Bold, Manrope_800ExtraBold } from "@expo-google-fonts/manrope";

interface FontProviderProps {
	children: ReactNode;
}

export default function FontProvider({ children }: FontProviderProps) {
	const [fontsLoaded] = useFonts({
		Manrope_400Regular,
		Manrope_500Medium,
		Manrope_600SemiBold,
		Manrope_700Bold,
		Manrope_800ExtraBold,
	});

	if (!fontsLoaded) {
		return <View style={styles.loading} />;
	}

	return <>{children}</>;
}

const styles = StyleSheet.create({
	loading: {
		flex: 1,
		backgroundColor: "#FFFCF8",
	},
}); 