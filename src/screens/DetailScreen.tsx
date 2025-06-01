import { useNavigation } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import React, { useState } from "react";
import { Pressable, Text, View, Alert } from "react-native";
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";
import Animated, {
	useAnimatedScrollHandler,
	useSharedValue,
	useAnimatedStyle,
	interpolate,
	Extrapolation,
	type SharedValue,
} from "react-native-reanimated";
import { StyleSheet, UnistylesRuntime } from "react-native-unistyles";
import { check, request, openSettings, PERMISSIONS, RESULTS } from "react-native-permissions";
import type { Destination, RootStackParamList } from "../navigation/types";
import { useDestinationsStore } from "../store/destinationsStore";
import NativeEventKit from "../../specs/NativeEventKit";

const IMAGE_HEIGHT = UnistylesRuntime.screen.height * 0.45;

type Props = NativeStackScreenProps<RootStackParamList, "Detail">;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type DestinationHeaderProps = {
	sv: SharedValue<number>;
	destination: Destination;
};

function DestinationHeader({ sv, destination }: DestinationHeaderProps) {
	const animatedImageStyle = useAnimatedStyle(() => {
		return {
			transform: [
				{
					scale: interpolate(sv.value, [-50, 0], [1.3, 1], {
						extrapolateLeft: "extend",
						extrapolateRight: "clamp",
					}),
				},
				{
					translateY: interpolate(
						sv.value,
						[0, 50],
						[0, 50],
						Extrapolation.CLAMP,
					),
				},
			],
		};
	});

	const animatedTextStyle = useAnimatedStyle(() => {
		return {
			opacity: interpolate(
				sv.value,
				[0, IMAGE_HEIGHT * 0.25],
				[1, 0],
				Extrapolation.CLAMP,
			),
			transform: [
				{
					translateY: interpolate(
						sv.value,
						[0, IMAGE_HEIGHT * 0.25],
						[0, 20],
						Extrapolation.CLAMP,
					),
				},
			],
		};
	});

	return (
		<View style={styles.heroSection}>
			<Animated.View style={[styles.imageContainer, animatedImageStyle]}>
				<Image source={{ uri: destination.image }} style={styles.heroImage} />
			</Animated.View>

			<Animated.View style={[styles.titleOverlay, animatedTextStyle]}>
				<BlurView intensity={30} style={styles.blurContainer}>
					<Text style={styles.destinationTitle}>{destination.name}</Text>
				</BlurView>
			</Animated.View>
		</View>
	);
}

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
	const currentDestination = useDestinationsStore(state => state.getDestination(routeDestination.name));
	const setEventId = useDestinationsStore(state => state.setEventId);
	const removeEventId = useDestinationsStore(state => state.removeEventId);
	
	const [isCalendarLoading, setIsCalendarLoading] = useState(false);

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

	const getTravelDateRange = () => {
		const startDate = new Date(destination.suggestedTravelDates[0]);
		const endDate = new Date(destination.suggestedTravelDates[1]);
		return `${startDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${endDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
	};

	const handleCalendarAction = async () => {
		setIsCalendarLoading(true);
		
		try {
			if (destination.eventId) {
				// Delete existing event (no permission needed to delete)
				const success = await NativeEventKit.deleteEvent(destination.eventId);
				if (success) {
					removeEventId(destination.name);
					Alert.alert("Success", "Travel event removed from calendar");
				} else {
					Alert.alert("Error", "Failed to remove event from calendar");
				}
			} else {
				// Check calendar permission first
				const permissionStatus = await check(PERMISSIONS.IOS.CALENDARS);
				
				let hasPermission = false;
				
				switch (permissionStatus) {
					case RESULTS.GRANTED:
						hasPermission = true;
						break;
					case RESULTS.DENIED:
						// Request permission
						const requestResult = await request(PERMISSIONS.IOS.CALENDARS);
						hasPermission = requestResult === RESULTS.GRANTED;
						break;
					case RESULTS.BLOCKED:
						Alert.alert(
							"Calendar Access Denied",
							"Please enable calendar access in Settings to create travel reminders.",
							[
								{ text: "Cancel", style: "cancel" },
								{ text: "Open Settings", onPress: () => {
									openSettings();
								}}
							]
						);
						return;
					case RESULTS.UNAVAILABLE:
						Alert.alert("Error", "Calendar is not available on this device");
						return;
					case RESULTS.LIMITED:
						hasPermission = true;
						break;
				}
				
				if (!hasPermission) {
					Alert.alert("Permission Required", "Calendar access is required to create travel reminders");
					return;
				}
				
				// Create new event
				const startDate = destination.suggestedTravelDates[0];
				const endDate = destination.suggestedTravelDates[1];
				const location = `${destination.name} (${formatCoordinate(destination.location.latitude, destination.location.longitude)})`;
				
				const eventId = await NativeEventKit.createEvent(
					`Travel to ${destination.name}`,
					startDate,
					endDate,
					location,
					destination.description,
					1440 // 24 hours before
				);
				
				if (eventId) {
					setEventId(destination.name, eventId);
					Alert.alert("Success", "Travel event added to calendar");
				} else {
					Alert.alert("Error", "Failed to create calendar event");
				}
			}
		} catch (error) {
			Alert.alert("Error", "Calendar operation failed");
			console.error("Calendar error:", error);
		} finally {
			setIsCalendarLoading(false);
		}
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

				{/* Calendar Section */}
				<View style={styles.calendarSection}>
					<Text style={styles.sectionTitle}>Travel Planning</Text>
					<View style={styles.calendarCard}>
						<View style={styles.calendarInfo}>
							<Text style={styles.calendarTitle}>Suggested Travel Dates</Text>
							<Text style={styles.calendarDates}>{getTravelDateRange()}</Text>
							{destination.eventId && (
								<Text style={styles.calendarStatus}>✅ Added to calendar</Text>
							)}
						</View>
						<Pressable 
							style={[
								styles.calendarButton,
								destination.eventId && styles.calendarButtonRemove,
								isCalendarLoading && styles.calendarButtonDisabled
							]}
							onPress={handleCalendarAction}
							disabled={isCalendarLoading}
						>
							<Text style={[
								styles.calendarButtonText,
								destination.eventId && styles.calendarButtonTextRemove
							]}>
								{isCalendarLoading 
									? "Loading..." 
									: destination.eventId 
										? "Remove from Calendar" 
										: "Add to Calendar"
								}
							</Text>
						</Pressable>
					</View>
				</View>

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
	heroSection: {
		position: "relative",
		width: rt.screen.width,
		height: IMAGE_HEIGHT,
	},
	imageContainer: {
		width: rt.screen.width,
		height: IMAGE_HEIGHT,
	},
	heroImage: {
		width: rt.screen.width,
		height: IMAGE_HEIGHT,
	},
	titleOverlay: {
		position: "absolute",
		bottom: 24,
		left: 20,
		right: 20,
	},
	blurContainer: {
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
	calendarSection: {
		marginBottom: 24,
	},
	calendarCard: {
		backgroundColor: theme.colors.secondary,
		borderRadius: 20,
		padding: 20,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	calendarInfo: {
		flex: 1,
		marginRight: 16,
	},
	calendarTitle: {
		fontSize: rt.fontScale * 18,
		fontWeight: "700",
		color: theme.colors.text,
		marginBottom: 4,
	},
	calendarDates: {
		fontSize: rt.fontScale * 16,
		color: theme.colors.text,
		fontWeight: "600",
	},
	calendarStatus: {
		fontSize: rt.fontScale * 14,
		fontWeight: "600",
		color: theme.colors.primary,
		marginTop: 4,
	},
	calendarButton: {
		backgroundColor: theme.colors.primary,
		paddingHorizontal: 20,
		paddingVertical: 12,
		borderRadius: 16,
		minWidth: 140,
		alignItems: "center",
	},
	calendarButtonRemove: {
		backgroundColor: "#EF4444",
	},
	calendarButtonDisabled: {
		backgroundColor: "rgba(156, 163, 175, 0.5)",
	},
	calendarButtonText: {
		fontSize: rt.fontScale * 14,
		fontWeight: "600",
		color: "white",
		textAlign: "center",
	},
	calendarButtonTextRemove: {
		color: "white",
	},
}));
