import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";
import { StyleSheet, UnistylesRuntime } from "react-native-unistyles";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import data from "../../data.json";
import type { Destination, RootStackParamList } from "../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "Detail">;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

function InfoPill({ icon, text }: { icon: string; text: string }) {
	return (
		<View style={styles.pill}>
			<Text style={styles.pillIcon}>{icon}</Text>
			<Text style={styles.pillText}>{text}</Text>
		</View>
	);
}

export default function DetailScreen({ route }: Props) {
	const navigation = useNavigation<NavigationProp>();
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

	const mapRegion = {
		latitude: destination.location.latitude,
		longitude: destination.location.longitude,
		latitudeDelta: 0.05,
		longitudeDelta: 0.05,
	};

	const handleMapPress = () => {
		navigation.navigate("Map", { destination });
	};

	return (
		<ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
			<View style={styles.imageContainer}>
				<Image source={{ uri: destination.image }} style={styles.heroImage} />

				<BlurView intensity={30} style={styles.titleOverlay}>
					<Text style={styles.destinationTitle}>{destination.name}</Text>
				</BlurView>
			</View>

			<View style={styles.content}>
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

				<Text style={styles.description}>{destination.description}</Text>

				<View style={styles.mapSection}>
					<Text style={styles.sectionTitle}>Location</Text>
					<Pressable style={styles.mapPreview} onPress={handleMapPress}>
						<MapView
							style={styles.mapView}
							provider={PROVIDER_DEFAULT}
							region={mapRegion}
							scrollEnabled={false}
							zoomEnabled={false}
							rotateEnabled={false}
							pitchEnabled={false}
						>
							<Marker
								coordinate={{
									latitude: destination.location.latitude,
									longitude: destination.location.longitude,
								}}
								title={destination.name}
							/>
						</MapView>
						<View style={styles.mapOverlay}>
							<Text style={styles.mapOverlayText}>Tap to view full map</Text>
						</View>
					</Pressable>
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
		width: rt.screen.width,
		height: 400,
	},
	heroImage: {
		width: rt.screen.width,
		height: 400,
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
		overflow: "hidden",
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
		marginBottom: 24,
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
	mapSection: {
		marginBottom: 24,
	},
	sectionTitle: {
		fontSize: rt.fontScale * 24,
		fontWeight: "800",
		color: theme.colors.text,
		marginBottom: 12,
	},
	mapPreview: {
		position: "relative",
		height: 150,
		borderRadius: 20,
		overflow: "hidden",
		backgroundColor: theme.colors.secondary,
	},
	mapView: {
		width: "100%",
		height: 150,
	},
	mapOverlay: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: "rgba(0, 0, 0, 0.3)",
		justifyContent: "center",
		alignItems: "center",
	},
	mapOverlayText: {
		fontSize: rt.fontScale * 16,
		fontWeight: "600",
		color: "white",
	},
}));
