import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { FlashList } from "@shopify/flash-list";
import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import React, { useMemo } from "react";
import { Pressable, Text, View } from "react-native";
import { StyleSheet, withUnistyles } from "react-native-unistyles";
import type { Destination, RootStackParamList } from "../navigation/types";
import { useDestinationsStore } from "../store/destinationsStore";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Create a themed BlurView component
const ThemedBlurView = withUnistyles(BlurView, (theme, rt) => ({
	tint: (rt.themeName === "dark" ? "dark" : "light") as "dark" | "light",
}));

function DestinationCard({ item, index }: { item: Destination; index: number }) {
	const navigation = useNavigation<NavigationProp>();

	const handlePress = () => {
		navigation.navigate("Detail", { destination: item });
	};

	return (
		<Pressable style={styles.card} onPress={handlePress}>
			<View style={styles.imageContainer}>
				<Image 
					source={{ uri: item.image }} 
					style={styles.cardImage}
				/>
				<ThemedBlurView 
					intensity={25}
					style={styles.textOverlay}
				>
					<Text style={styles.cardTitle}>{item.name}</Text>
				</ThemedBlurView>
			</View>
		</Pressable>
	);
}

export default function HomeScreen() {
	const destinationsRecord = useDestinationsStore(state => state.destinations);
	const destinations = useMemo(() => Object.values(destinationsRecord), [destinationsRecord]);

	return (
		<FlashList
			data={destinations}
			renderItem={({ item, index }) => <DestinationCard item={item} index={index} />}
			keyExtractor={(item) => item.name}
			numColumns={2}
			contentInsetAdjustmentBehavior="automatic"
			contentContainerStyle={styles.listContainer}
			ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
		/>
	);
}

const styles = StyleSheet.create((theme, rt) => ({
	listContainer: {
		paddingHorizontal: 8,
		paddingTop: 16,
		paddingBottom: 16,
	},
	card: {
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
		width: (rt.screen.width - 48) / 2,
		height: 200,
		backgroundColor: theme.colors.primaryAccent,
	},
	cardImage: {
		width: (rt.screen.width - 48) / 2,
		height: 200,
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
