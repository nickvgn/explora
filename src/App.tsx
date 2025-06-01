import { createStaticNavigation } from "@react-navigation/native";
import type { StaticParamList } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { FlashList } from "@shopify/flash-list";
import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import React from "react";
import { Text, View } from "react-native";
import { StyleSheet, UnistylesRuntime } from "react-native-unistyles";
import "./styles/unistyles";
import data from "../data.json";

type Destination = (typeof data.destinations)[0];

function DestinationCard({ item }: { item: Destination }) {
	return (
		<View style={styles.card}>
			<View style={styles.imageContainer}>
				<Image source={{ uri: item.image }} style={styles.cardImage} />
				<BlurView intensity={20} style={styles.textOverlay}>
					<Text style={styles.cardTitle}>{item.name}</Text>
				</BlurView>
			</View>
		</View>
	);
}

function HomeScreen() {
	return (
		<View style={{ flex: 1 }}>
			<FlashList
				data={data.destinations}
				renderItem={({ item }) => <DestinationCard item={item} />}
				numColumns={2}
				estimatedItemSize={200}
				contentInsetAdjustmentBehavior="automatic"
				contentContainerStyle={styles.listContainer}
				ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
			/>
		</View>
	);
}

const styles = StyleSheet.create((theme, rt) => ({
	listContainer: {
		padding: 16,
		paddingTop: rt.insets.top + 16,
	},
	card: {
		backgroundColor: "white",
		borderRadius: 16,
		marginHorizontal: 8,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		width: (rt.screen.width - 48) / 2,
		shadowOpacity: 0.1,
		shadowRadius: 8,
		elevation: 5,
		overflow: "hidden",
	},
	imageContainer: {
		position: "relative",
	},
	cardImage: {
		width: "100%",
		height: 160,
		borderRadius: 16,
	},
	textOverlay: {
		position: "absolute",
		left: 0,
		right: 0,
		bottom: 0,
		padding: 12,
		borderBottomLeftRadius: 16,
		borderBottomRightRadius: 16,
	},
	cardTitle: {
		fontSize: rt.fontScale * 16,
		fontWeight: "600",
		color: "white",
		textShadowColor: "rgba(0, 0, 0, 0.5)",
		textShadowOffset: { width: 0, height: 1 },
		textShadowRadius: 2,
	},
}));

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
