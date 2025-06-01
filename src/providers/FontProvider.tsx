import {
	Manrope_400Regular,
	Manrope_500Medium,
	Manrope_600SemiBold,
	Manrope_700Bold,
	Manrope_800ExtraBold,
	useFonts,
} from "@expo-google-fonts/manrope";
import React, { type ReactNode } from "react";
import { StyleSheet, View } from "react-native";

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

