import { useNavigation } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";
import { Pressable, Text, View } from "react-native";
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";
import Animated, {
	useAnimatedScrollHandler,
	useSharedValue,
	type SharedValue,
} from "react-native-reanimated";
import { StyleSheet, UnistylesRuntime } from "react-native-unistyles";
import DestinationHeader from "../components/DestinationHeader";
import TravelPlanningSection from "../components/TravelPlanningSection";
import type { Destination, RootStackParamList } from "../navigation/types";
import { useDestinationsStore } from "../store/destinationsStore";

const IMAGE_HEIGHT = UnistylesRuntime.screen.height * 0.45;

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
	const { destination: routeDestination } = route.params;

	// Get the current destination from store (with potential eventId)
	const currentDestination = useDestinationsStore((state) =>
		state.getDestination(routeDestination.name),
	);
	const setEventId = useDestinationsStore((state) => state.setEventId);
	const removeEventId = useDestinationsStore((state) => state.removeEventId);

	const translationY = useSharedValue(0);
	const scrollHandler = useAnimatedScrollHandler((event) => {
		translationY.value = event.contentOffset.y;
	});

	// Fallback to route destination if not found in store
	const destination = currentDestination || routeDestination;

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
		<Animated.ScrollView
			style={styles.container}
			showsVerticalScrollIndicator={false}
			onScroll={scrollHandler}
			scrollEventThrottle={1}
		>
			<DestinationHeader sv={translationY} destination={destination} />

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

				<TravelPlanningSection
					destinationName={destination.name}
					eventId={destination.eventId}
					suggestedDates={destination.suggestedTravelDates}
				/>

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
		</Animated.ScrollView>
	);
}

const styles = StyleSheet.create((theme, rt) => ({
	container: {
		flex: 1,
		backgroundColor: theme.colors.background,
	},
	content: {
		padding: 20,
		marginTop: -20,
		backgroundColor: theme.colors.background,
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
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
