import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { StyleSheet, UnistylesRuntime } from "react-native-unistyles";
import type data from "../../data.json";

type Destination = (typeof data.destinations)[0];

type RootStackParamList = {
	Home: undefined;
	Detail: {
		destination: Destination;
	};
};

type Props = NativeStackScreenProps<RootStackParamList, "Detail">;

function InfoPill({ icon, text }: { icon: string; text: string }) {
	return (
		<View style={styles.pill}>
			<Text style={styles.pillIcon}>{icon}</Text>
			<Text style={styles.pillText}>{text}</Text>
		</View>
	);
}

export default function DetailScreen({ route, navigation }: Props) {
	const { destination } = route.params;

	const formatCoordinate = (lat: number, lng: number) => {
		return `${Math.abs(lat).toFixed(4)}°${lat >= 0 ? "N" : "S"}, ${Math.abs(lng).toFixed(4)}°${lng >= 0 ? "E" : "W"}`;
	};

	const getNextTravelDate = () => {
		const nextDate = new Date(destination.suggestedTravelDates[0]);
		return nextDate.toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
		});
	};

	return (
		<ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
			<View style={styles.imageContainer}>
				<Image
					source={{ uri: destination.image }}
					placeholder="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop&crop=center"
					style={styles.heroImage}
				/>

				<BlurView intensity={30} style={styles.titleOverlay}>
					<Text style={styles.destinationTitle}>{destination.name}</Text>
				</BlurView>
			</View>

			<View style={styles.content}>
				<Text style={styles.description}>{destination.description}</Text>

				<View style={styles.pillsContainer}>
					<InfoPill
						icon="📍"
						text={formatCoordinate(
							destination.location.latitude,
							destination.location.longitude,
						)}
					/>
					<InfoPill icon="📅" text={`Best: ${getNextTravelDate()}`} />
					<InfoPill icon="🌟" text="4.8" />
					<InfoPill icon="❤" text="2.4k" />
				</View>
			</View>
		</ScrollView>
	);
}

const styles = StyleSheet.create((theme, rt) => ({
	container: {
		flex: 1,
		backgroundColor: theme.colors.background,
	},
	imageContainer: {
		position: "relative",
		height: rt.screen.height * 0.6,
	},
	heroImage: {
		width: "100%",
		height: "100%",
		borderBottomLeftRadius: 24,
		borderBottomRightRadius: 24,
	},
	titleOverlay: {
		position: "absolute",
		bottom: 24,
		left: 20,
		right: 20,
		borderRadius: 20,
		padding: 20,
	},
	destinationTitle: {
		fontSize: rt.fontScale * 32,
		fontWeight: "800",
		color: "white",
		marginBottom: 4,
		textShadowColor: "rgba(0, 0, 0, 0.3)",
		textShadowOffset: { width: 0, height: 1 },
		textShadowRadius: 2,
	},
	destinationSubtitle: {
		fontSize: rt.fontScale * 16,
		fontWeight: "500",
		color: "rgba(255, 255, 255, 0.9)",
		textShadowColor: "rgba(0, 0, 0, 0.3)",
		textShadowOffset: { width: 0, height: 1 },
		textShadowRadius: 2,
	},
	content: {
		padding: 20,
	},
	description: {
		fontSize: rt.fontScale * 16,
		lineHeight: rt.fontScale * 24,
		color: theme.colors.text,
		marginBottom: 24,
	},
	pillsContainer: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 12,
	},
	pill: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: theme.colors.secondary,
		paddingHorizontal: 16,
		paddingVertical: 10,
		borderRadius: 20,
	},
	pillIcon: {
		fontSize: 16,
		marginRight: 8,
	},
	pillText: {
		fontSize: rt.fontScale * 14,
		fontWeight: "600",
		color: theme.colors.primary,
	},
}));
