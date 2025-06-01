import { createStaticNavigation } from "@react-navigation/native";
import type { StaticParamList } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { FlashList } from "@shopify/flash-list";
import React from "react";
import { Text, View } from "react-native";

const data = Array.from({ length: 50 }, (_, i) => ({
	id: i,
	title: `Item ${i + 1}`,
}));

function HomeScreen() {
	return (
		<View style={{ flex: 1 }}>
			<FlashList
				data={data}
				renderItem={({ item }) => (
					<View
						style={{
							padding: 16,
							borderBottomWidth: 1,
							borderBottomColor: "#eee",
						}}
					>
						<Text>{item.title}</Text>
					</View>
				)}
				estimatedItemSize={50}
				contentInsetAdjustmentBehavior="automatic"
			/>
		</View>
	);
}

const RootStack = createNativeStackNavigator({
	screens: {
		Home: {
			screen: HomeScreen,
			options: {
				title: "Explore",
				headerLargeTitle: true,
				headerTransparent: true,
				headerBlurEffect: "regular",
				headerSearchBarOptions: {
					placeholder: "Search",
					hideWhenScrolling: true,
				},
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
