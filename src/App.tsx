import { createStaticNavigation } from "@react-navigation/native";
import type { StaticParamList } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { UnistylesRuntime } from "react-native-unistyles";
import "./styles/unistyles";
import HomeScreen from "./screens/HomeScreen";
import DetailScreen from "./screens/DetailScreen";

const RootStack = createNativeStackNavigator({
	screens: {
		Home: {
			screen: HomeScreen,
			options: {
				title: "Explore",
				headerLargeTitle: true,
				headerTransparent: true,
				headerBlurEffect: "regular",
				headerShadowVisible: false,
				contentStyle: {
					backgroundColor: UnistylesRuntime.getTheme().colors.background,
				},
				headerSearchBarOptions: {
					placeholder: "Search",
					hideWhenScrolling: true,
				},
			},
		},
		Detail: {
			screen: DetailScreen,
			options: {
				headerShown: false,
			},
		},
	},
});

type RootStackParamList = StaticParamList<typeof RootStack>;

declare global {
	namespace ReactNavigation {
		interface RootParamList extends RootStackParamList {}
	}
}

const Navigation = createStaticNavigation(RootStack);

export default function App() {
	return <Navigation />;
}
