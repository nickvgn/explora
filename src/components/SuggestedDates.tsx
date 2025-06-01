import React, { useState } from "react";
import { Alert, Text, View } from "react-native";
import {
	PERMISSIONS,
	RESULTS,
	check,
	openSettings,
	request,
} from "react-native-permissions";
import { StyleSheet } from "react-native-unistyles";
import NativeEventKit from "../../specs/NativeEventKit";
import { useTravelStore } from "../store/travelStore";
import CalendarButton from "./CalendarButton";

type TravelPlanningSectionProps = {
	destinationName: string;
	destinationDescription: string;
	suggestedDates: string[];
};

export function SuggestedDates({
	destinationName,
	destinationDescription,
	suggestedDates,
}: TravelPlanningSectionProps) {
	const [isCalendarLoading, setIsCalendarLoading] = useState(false);

	const eventId = useTravelStore((state) =>
		state.getEventByDestination(destinationName),
	);
	const addEvent = useTravelStore((state) => state.addEvent);
	const removeEventByDestination = useTravelStore(
		(state) => state.removeEventByDestination,
	);

	function getTravelDateRange() {
		const startDate = new Date(suggestedDates[0]);
		const endDate = new Date(suggestedDates[1]);
		return `${startDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${endDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
	}

	async function checkCalendarPermission(): Promise<boolean> {
		const permissionStatus = await check(PERMISSIONS.IOS.CALENDARS);

		switch (permissionStatus) {
			case RESULTS.GRANTED:
			case RESULTS.LIMITED:
				return true;

			case RESULTS.DENIED: {
				const requestResult = await request(PERMISSIONS.IOS.CALENDARS);
				return requestResult === RESULTS.GRANTED;
			}

			case RESULTS.BLOCKED:
				Alert.alert(
					"Calendar Access Denied",
					"Please enable calendar access in Settings to create travel reminders.",
					[
						{ text: "Cancel", style: "cancel" },
						{ text: "Open Settings", onPress: () => openSettings() },
					],
				);
				return false;

			case RESULTS.UNAVAILABLE:
				Alert.alert("Error", "Calendar is not available on this device");
				return false;

			default:
				return false;
		}
	}

	function createCalendarEvent() {
		const startDate = suggestedDates[0];
		const endDate = suggestedDates[1];
		const locationString = destinationName;

		const newEventId = NativeEventKit.createEvent(
			`Travel to ${destinationName}`,
			startDate,
			endDate,
			locationString,
			destinationDescription,
			1440,
		);

		if (!newEventId) {
			Alert.alert("Error", "Failed to create calendar event");
			return;
		}

		addEvent(newEventId, destinationName);
	}

	function deleteCalendarEvent() {
		if (!eventId) {
			return;
		}

		const isSuccess = NativeEventKit.deleteEvent(eventId);

		if (!isSuccess) {
			Alert.alert("Error", "Failed to remove event from calendar");
			return;
		}

		removeEventByDestination(destinationName);
	}

	async function handleCalendarAction() {
		setIsCalendarLoading(true);

		try {
			if (eventId) {
				deleteCalendarEvent();
			} else {
				const hasPermission = await checkCalendarPermission();
				if (hasPermission) {
					createCalendarEvent();
				}
			}
		} catch (error) {
			Alert.alert("Error", "Calendar operation failed");
		} finally {
			setIsCalendarLoading(false);
		}
	}

	return (
		<View style={styles.calendarSection}>
			<View style={styles.calendarCard}>
				<View style={styles.calendarInfo}>
					<Text style={styles.calendarTitle}>Suggested Dates</Text>
					<Text style={styles.calendarDates}>{getTravelDateRange()}</Text>
					<View
						style={[
							styles.calendarStatusBadge,
							!eventId && styles.calendarStatusBadgeHidden,
						]}
					>
						<Text style={styles.calendarStatusText}>✓ Added to calendar</Text>
					</View>
				</View>
				<CalendarButton
					hasEvent={!!eventId}
					isLoading={isCalendarLoading}
					onPress={handleCalendarAction}
				/>
			</View>
		</View>
	);
}

const styles = StyleSheet.create((theme, rt) => ({
	calendarSection: {
		marginBottom: 24,
		position: "relative",
	},
	sectionTitle: {
		fontSize: rt.fontScale * 24,
		fontFamily: theme.fonts.extraBold,
		color: theme.colors.primaryText,
		marginBottom: 12,
	},
	calendarCard: {
		backgroundColor: theme.colors.primaryAccent,
		borderRadius: 20,
		padding: 20,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		minHeight: 120,
	},
	calendarInfo: {
		flex: 1,
		marginRight: 16,
	},
	calendarTitle: {
		fontSize: rt.fontScale * 18,
		fontFamily: theme.fonts.bold,
		color: theme.colors.primaryText,
		marginBottom: 4,
	},
	calendarDates: {
		fontSize: rt.fontScale * 16,
		color: theme.colors.primaryText,
		fontFamily: theme.fonts.medium,
		marginBottom: 8,
	},
	calendarStatusBadge: {
		backgroundColor: theme.colors.primary,
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 8,
		alignSelf: "flex-start",
	},
	calendarStatusBadgeHidden: {
		opacity: 0,
	},
	calendarStatusText: {
		fontSize: rt.fontScale * 14,
		fontFamily: theme.fonts.semiBold,
		color: "white",
	},
}));
