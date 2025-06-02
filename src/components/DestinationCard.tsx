import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { StyleSheet, withUnistyles } from "react-native-unistyles";
import type { Destination, RootStackParamList } from "../navigation/types";
import { useTravelStore } from "../store/travelStore";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const ThemedBlurView = withUnistyles(BlurView, (_, rt) => ({
	tint: (rt.themeName === "dark" ? "dark" : "light") as "dark" | "light",
}));

const ThemedCalendarIcon = withUnistyles(AntDesign, (theme) => ({
	color: theme.colors.primaryText,
}));

type DestinationCardProps = {
	item: Destination;
};

export function DestinationCard({ item }: DestinationCardProps) {
	const navigation = useNavigation<NavigationProp>();
	const eventId = useTravelStore((state) => state.calendarEvents[item.name]);

	function handlePress() {
		navigation.navigate("Detail", { destination: item });
	}

	return (
		<Pressable style={styles.card} onPress={handlePress}>
			<View style={styles.imageContainer}>
				<Image
					source={{ uri: item.image }}
					style={styles.cardImage}
					key={item.name}
					cachePolicy="memory-disk"
					contentFit="cover"
				/>
				{eventId && (
					<View style={styles.calendarIconContainer}>
						<ThemedCalendarIcon name="calendar" size={16} />
					</View>
				)}
				<ThemedBlurView intensity={25} style={styles.textOverlay}>
					<Text style={styles.cardTitle}>{item.name}</Text>
				</ThemedBlurView>
			</View>
		</Pressable>
	);
}

const styles = StyleSheet.create((theme, rt) => ({
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
		marginBottom: 16,
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
	calendarIconContainer: {
		position: "absolute",
		top: 12,
		right: 12,
		backgroundColor: theme.colors.background,
		borderRadius: 12,
		padding: 6,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 4,
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
		fontFamily: theme.fonts.bold,
		color: "white",
		textShadowColor: "rgba(0, 0, 0, 0.3)",
		textShadowOffset: { width: 0, height: 1 },
		textShadowRadius: 2,
	},
}));
