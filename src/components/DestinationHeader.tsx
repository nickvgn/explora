import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import React from "react";
import { Text, View } from "react-native";
import Animated, {
	useAnimatedStyle,
	interpolate,
	Extrapolation,
	FadeIn,
	type SharedValue,
} from "react-native-reanimated";
import {
	StyleSheet,
	UnistylesRuntime,
	withUnistyles,
} from "react-native-unistyles";

const IMAGE_HEIGHT = UnistylesRuntime.screen.height * 0.45;

const ThemedBlurView = withUnistyles(BlurView, (_, rt) => ({
	tint: (rt.themeName === "dark" ? "dark" : "light") as "dark" | "light",
}));

type DestinationHeaderProps = {
	sv: SharedValue<number>;
	title: string;
	image: string;
};

export function DestinationHeader({
	sv,
	title,
	image,
}: DestinationHeaderProps) {
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
				<Image source={{ uri: image }} style={styles.heroImage} />
			</Animated.View>

			<Animated.View
				style={[styles.titleOverlay, animatedTextStyle]}
				entering={FadeIn.delay(150).duration(400)}
			>
				<ThemedBlurView intensity={30} style={styles.blurContainer}>
					<Text style={styles.destinationTitle}>{title}</Text>
				</ThemedBlurView>
			</Animated.View>
		</View>
	);
}

const styles = StyleSheet.create((theme, rt) => ({
	heroSection: {
		position: "relative",
		width: rt.screen.width,
		height: IMAGE_HEIGHT,
	},
	imageContainer: {
		width: rt.screen.width,
		height: IMAGE_HEIGHT,
		backgroundColor: theme.colors.primaryAccent,
	},
	heroImage: {
		width: rt.screen.width,
		height: IMAGE_HEIGHT,
	},
	titleOverlay: {
		position: "absolute",
		bottom: 24,
		left: 4,
		right: 4,
	},
	blurContainer: {
		borderRadius: 20,
		padding: 20,
		overflow: "hidden",
	},
	destinationTitle: {
		fontSize: rt.fontScale * 32,
		fontFamily: theme.fonts.extraBold,
		color: "white",
		marginBottom: 4,
		textShadowColor: "rgba(0, 0, 0, 0.3)",
		textShadowOffset: { width: 0, height: 1 },
		textShadowRadius: 2,
	},
}));
