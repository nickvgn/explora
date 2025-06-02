import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { Suspense } from "react";
import { Text, View } from "react-native";
import Animated, {
	useAnimatedScrollHandler,
	useSharedValue,
	FadeInUp,
} from "react-native-reanimated";
import { StyleSheet } from "react-native-unistyles";
import { DestinationHeader } from "../components/DestinationHeader";
import { SuggestedDates } from "../components/SuggestedDates";
import type { RootStackParamList } from "../navigation/types";

const LazyMapPreview = React.lazy(() => import("../components/MapPreview"));

type Props = NativeStackScreenProps<RootStackParamList, "Detail">;

export default function DetailScreen({ route, navigation }: Props) {
	const { destination } = route.params;

	const translationY = useSharedValue(0);
	const scrollHandler = useAnimatedScrollHandler((event) => {
		translationY.value = event.contentOffset.y;
	});

	function handleMapPress() {
		const location = destination.location;

		navigation.navigate("Map", {
			latitude: location.latitude,
			longitude: location.longitude,
		});
	}

	return (
		<Animated.ScrollView
			style={styles.container}
			showsVerticalScrollIndicator={false}
			onScroll={scrollHandler}
			scrollEventThrottle={1}
		>
			<DestinationHeader
				sv={translationY}
				title={destination.name}
				image={destination.image}
			/>

			<View style={styles.content}>
				<Animated.View entering={FadeInUp.delay(100).duration(300)}>
					<Text style={styles.description}>{destination.description}</Text>
				</Animated.View>

				<Animated.View entering={FadeInUp.delay(200).duration(300)}>
					<Text style={styles.sectionTitle}>Travel Planning</Text>
					<SuggestedDates
						destinationName={destination.name}
						destinationDescription={destination.description}
						suggestedDates={destination.suggestedTravelDates}
					/>
				</Animated.View>

				<Animated.View
					entering={FadeInUp.delay(300).duration(300)}
					style={styles.mapSection}
				>
					<Text style={styles.sectionTitle}>Location</Text>
					<Suspense fallback={<View style={styles.mapFallback} />}>
						<LazyMapPreview
							latitude={destination.location.latitude}
							longitude={destination.location.longitude}
							title={destination.name}
							onPress={handleMapPress}
						/>
					</Suspense>
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
		fontFamily: theme.fonts.regular,
		color: theme.colors.primaryText,
		marginBottom: 24,
	},
	mapSection: {
		marginBottom: 24,
	},
	sectionTitle: {
		fontSize: rt.fontScale * 24,
		fontFamily: theme.fonts.extraBold,
		color: theme.colors.primaryText,
		marginBottom: 12,
	},
	mapFallback: {
		height: 150,
		borderRadius: 20,
		overflow: "hidden",
		backgroundColor: theme.colors.primaryAccent,
	},
}));
