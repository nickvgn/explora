import { AntDesign } from "@expo/vector-icons";
import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	withSpring,
} from "react-native-reanimated";
import { StyleSheet } from "react-native-unistyles";

type CalendarButtonProps = {
	hasEvent: boolean;
	isLoading: boolean;
	onPress: () => void;
};

export default function CalendarButton({
	hasEvent,
	isLoading,
	onPress,
}: CalendarButtonProps) {
	const [confirmationType, setConfirmationType] = useState<
		"none" | "add" | "remove"
	>("none");

	const confirmationScale = useSharedValue(0);
	const confirmationOpacity = useSharedValue(0);

	function showConfirmationAnimation(isRemove = false) {
		setConfirmationType(isRemove ? "remove" : "add");

		confirmationScale.value = 0;
		confirmationOpacity.value = 0;

		confirmationScale.value = withSpring(1, { damping: 12, stiffness: 350 });
		confirmationOpacity.value = withSpring(1, { damping: 12, stiffness: 350 });

		setTimeout(() => {
			confirmationScale.value = withSpring(0, { damping: 15, stiffness: 300 });
			confirmationOpacity.value = withSpring(0, {
				damping: 15,
				stiffness: 300,
			});
			setTimeout(() => {
				setConfirmationType("none");
			}, 200);
		}, 800);
	}

	const handlePress = () => {
		onPress();
		showConfirmationAnimation(hasEvent);
	};

	const confirmationAnimatedStyle = useAnimatedStyle(() => {
		return {
			transform: [{ scale: confirmationScale.value }],
			opacity: confirmationOpacity.value,
		};
	});

	if (confirmationType !== "none") {
		return (
			<View style={styles.calendarButton(confirmationType)}>
				<Animated.View style={confirmationAnimatedStyle}>
					{confirmationType === "add" ? (
						<AntDesign name="checkcircle" size={24} color="white" />
					) : (
						<AntDesign name="closecircle" size={24} color="white" />
					)}
				</Animated.View>
			</View>
		);
	}

	return (
		<Pressable
			style={[
				styles.calendarButton(),
				hasEvent && styles.calendarButtonRemove,
				isLoading && styles.calendarButtonDisabled,
			]}
			onPress={handlePress}
			disabled={isLoading}
		>
			<Text
				style={[
					styles.calendarButtonText,
					hasEvent && styles.calendarButtonTextRemove,
				]}
			>
				{isLoading ? "Loading..." : hasEvent ? "Remove" : "Add to Calendar"}
			</Text>
		</Pressable>
	);
}

const styles = StyleSheet.create((theme, rt) => ({
	calendarButton: (confirmationType?: string) => ({
		backgroundColor: (() => {
			if (confirmationType === "remove") return theme.colors.destructive;
			if (confirmationType === "add") return theme.colors.success;
			return theme.colors.primary;
		})(),
		paddingHorizontal: 20,
		paddingVertical: 12,
		borderRadius: 16,
		minWidth: 140,
		height: 48,
		alignItems: "center",
		justifyContent: "center",
	}),
	calendarButtonRemove: {
		backgroundColor: theme.colors.destructive,
	},
	calendarButtonDisabled: {
		backgroundColor: "rgba(156, 163, 175, 0.5)",
	},
	calendarButtonText: {
		fontSize: rt.fontScale * 14,
		fontFamily: theme.fonts.bold,
		color: "white",
		textAlign: "center",
	},
	calendarButtonTextRemove: {
		color: "white",
	},
}));
