import { useNavigation } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";
import { Pressable, Text, View } from "react-native";
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";
import Animated, {
	useAnimatedScrollHandler,
	useSharedValue,
	FadeInUp,
	type SharedValue,
} from "react-native-reanimated";
import {
	StyleSheet,
	UnistylesRuntime,
	withUnistyles,
} from "react-native-unistyles";
import DestinationHeader from "../components/DestinationHeader";
import TravelPlanningSection from "../components/TravelPlanningSection";
import type { RootStackParamList } from "../navigation/types";

const IMAGE_HEIGHT = UnistylesRuntime.screen.height * 0.45;

const ThemedMapView = withUnistyles(MapView, (_, rt) => ({
	userInterfaceStyle:
		rt.colorScheme === "dark"
			? ("dark" as const)
			: ("light" as const),
}));

type Props = NativeStackScreenProps<RootStackParamList, "Detail">;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function DetailScreen({ route }: Props) {
	const navigation = useNavigation<NavigationProp>();
	const { destination } = route.params;

	const translationY = useSharedValue(0);
	const scrollHandler = useAnimatedScrollHandler((event) => {
		translationY.value = event.contentOffset.y;
	});

	const mapRegion = {
		latitude: destination.location.latitude,
		longitude: destination.location.longitude,
		latitudeDelta: 0.01,
		longitudeDelta: 0.01,
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
				<Animated.View entering={FadeInUp.delay(100).duration(300)}>
					<Text style={styles.description}>{destination.description}</Text>
				</Animated.View>

				<Animated.View entering={FadeInUp.delay(200).duration(300)}>
					<TravelPlanningSection
						destinationName={destination.name}
						suggestedDates={destination.suggestedTravelDates}
					/>
				</Animated.View>

				<Animated.View
					entering={FadeInUp.delay(300).duration(300)}
					style={styles.mapSection}
				>
					<Text style={styles.sectionTitle}>Location</Text>
					<Pressable style={styles.mapPreview} onPress={handleMapPress}>
						<ThemedMapView
							style={styles.mapView}
							provider={PROVIDER_DEFAULT}
							initialRegion={mapRegion}
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
						</ThemedMapView>
					</Pressable>
				</Animated.View>
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
		color: theme.colors.primaryText,
		marginBottom: 24,
	},
	mapSection: {
		marginBottom: 24,
	},
	sectionTitle: {
		fontSize: rt.fontScale * 24,
		fontWeight: "800",
		color: theme.colors.primaryText,
		marginBottom: 12,
	},
	mapPreview: {
		position: "relative",
		height: 150,
		borderRadius: 20,
		overflow: "hidden",
		backgroundColor: theme.colors.primaryAccent,
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
