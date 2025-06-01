import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { useUnistyles } from "react-native-unistyles";
import ThemeButton from "../components/ThemeButton";
import DetailScreen from "../screens/DetailScreen";
import HomeScreen from "../screens/HomeScreen";
import MapScreen from "../screens/MapScreen";
import type { RootStackParamList } from "./types";

const Stack = createNativeStackNavigator<RootStackParamList>();

export function Navigation() {
	const { theme, rt } = useUnistyles();

	return (
		<NavigationContainer>
			<Stack.Navigator>
				<Stack.Screen
					name="Home"
					component={HomeScreen}
					options={{
						title: "Explore",
						headerLargeTitle: true,
						headerLargeTitleStyle: {
							color: theme.colors.primaryText,
							fontFamily: theme.fonts.extraBold,
						},
						headerTitleStyle: {
							color: theme.colors.primaryText,
							fontFamily: theme.fonts.bold,
						},
						headerTransparent: true,
						headerBlurEffect: rt.themeName === "dark" ? "dark" : "light",
						headerShadowVisible: false,
						contentStyle: {
							backgroundColor: theme.colors.background,
						},
						headerRight: () => <ThemeButton />,
						headerBackTitle: "Explore",
					}}
				/>
				<Stack.Screen
					name="Detail"
					component={DetailScreen}
					options={{
						headerShown: true,
						headerTransparent: true,
						headerTitle: "",
						headerShadowVisible: false,
						headerTintColor: theme.colors.primaryText,
						headerBackTitle: "Explore",
						headerBackTitleStyle: {
							fontFamily: theme.fonts.medium,
						},
					}}
				/>
				<Stack.Screen
					name="Map"
					component={MapScreen}
					options={{
						headerShown: false,
						presentation: "formSheet",
						sheetGrabberVisible: true,
						sheetCornerRadius: 20,
					}}
				/>
			</Stack.Navigator>
		</NavigationContainer>
	);
}
