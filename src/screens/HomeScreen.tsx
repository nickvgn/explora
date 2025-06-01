import { FlashList } from "@shopify/flash-list";
import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import React from "react";
import { Text, View, Pressable } from "react-native";
import { StyleSheet, UnistylesRuntime } from "react-native-unistyles";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Animated from "react-native-reanimated";
import data from "../../data.json";

type Destination = (typeof data.destinations)[0];

type RootStackParamList = {
	Home: undefined;
	Detail: {
		destination: Destination;
	};
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

function DestinationCard({ item }: { item: Destination }) {
	const navigation = useNavigation<NavigationProp>();

	const handlePress = () => {
		navigation.navigate("Detail", { destination: item });
	};

	return (
		<Pressable style={styles.card} onPress={handlePress}>
			<View style={styles.imageContainer}>
				<Animated.Image
					source={{ uri: item.image }}
					style={styles.cardImage}
					sharedTransitionTag={item.name}
				/>
				<BlurView intensity={25} style={styles.textOverlay}>
					<Text style={styles.cardTitle}>{item.name}</Text>
				</BlurView>
			</View>
		</Pressable>
	);
}

export default function HomeScreen() {
	return (
		<FlashList
			data={data.destinations}
			renderItem={({ item }) => <DestinationCard item={item} />}
			numColumns={2}
			estimatedItemSize={240}
			contentInsetAdjustmentBehavior="automatic"
			contentContainerStyle={styles.listContainer}
			ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
		/>
	);
}

const styles = StyleSheet.create((theme, rt) => ({
	listContainer: {
		backgroundColor: theme.colors.background,
		padding: 16,
		paddingTop: 16,
	},
	card: {
		backgroundColor: "white",
		borderRadius: 24,
		marginHorizontal: 8,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 4,
		},
		width: (rt.screen.width - 48) / 2,
		shadowOpacity: 0.15,
		shadowRadius: 12,
		elevation: 8,
		overflow: "hidden",
	},
	imageContainer: {
		position: "relative",
		aspectRatio: 0.75,
	},
	cardImage: {
		width: "100%",
		height: "100%",
		borderRadius: 24,
	},
	textOverlay: {
		position: "absolute",
		left: 12,
		right: 12,
		bottom: 12,
		borderRadius: 20,
		paddingHorizontal: 16,
		paddingVertical: 12,
		overflow: "hidden",
	},
	cardTitle: {
		fontSize: rt.fontScale * 16,
		fontWeight: "700",
		color: "white",
		textShadowColor: "rgba(0, 0, 0, 0.3)",
		textShadowOffset: { width: 0, height: 1 },
		textShadowRadius: 2,
	},
}));

