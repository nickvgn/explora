import { useNavigation } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import React from "react";
import { Pressable, Text, View } from "react-native";
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
import type { Destination, RootStackParamList } from "../navigation/types";

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
	const { destination } = route.params;

	const translationY = useSharedValue(0);
	const scrollHandler = useAnimatedScrollHandler((event) => {
		translationY.value = event.contentOffset.y;
	});

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
}));
