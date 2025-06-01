import { createStaticNavigation } from "@react-navigation/native";
import type { StaticParamList } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { UnistylesRuntime } from "react-native-unistyles";
import HomeScreen from "../screens/HomeScreen";
import DetailScreen from "../screens/DetailScreen";
import MapScreen from "../screens/MapScreen";

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
				headerShown: true,
				headerTransparent: true,
				headerTitle: "",
				headerShadowVisible: false,
				headerTintColor: UnistylesRuntime.getTheme().colors.primary,
			},
		},
		Map: {
			screen: MapScreen,
			options: {
				headerShown: false,
				presentation: "formSheet",
				sheetAllowedDetents: [0.5, 1.0],
				sheetLargestUndimmedDetentIndex: 0,
				sheetGrabberVisible: true,
				sheetCornerRadius: 20,
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

export const Navigation = createStaticNavigation(RootStack); 