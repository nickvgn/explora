import React, { useState, useCallback } from "react";
import { Text, View, Alert } from "react-native";
import { StyleSheet, UnistylesRuntime } from "react-native-unistyles";
import { check, request, openSettings, PERMISSIONS, RESULTS } from "react-native-permissions";
import CalendarButton from "./CalendarButton";
import NativeEventKit from "../../specs/NativeEventKit";
import { useDestinationsStore } from "../store/destinationsStore";
import data from "../../data.json";

interface TravelPlanningSectionProps {
	destinationName: string;
	suggestedDates: string[];
}

function TravelPlanningSection({
	destinationName,
	suggestedDates,
}: TravelPlanningSectionProps) {
	const [isCalendarLoading, setIsCalendarLoading] = useState(false);
	
	const eventId = useDestinationsStore(state => state.getEventByDestination(destinationName));
	const addEvent = useDestinationsStore(state => state.addEvent);
	const removeEventByDestination = useDestinationsStore(state => state.removeEventByDestination);

	// Get destination data from JSON file
	const destination = data.destinations.find(dest => dest.name === destinationName);

	const getTravelDateRange = useCallback(() => {
		const startDate = new Date(suggestedDates[0]);
		const endDate = new Date(suggestedDates[1]);
		return `${startDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${endDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
	}, [suggestedDates]);

	const checkCalendarPermission = useCallback(async (): Promise<boolean> => {
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
						{ text: "Open Settings", onPress: () => openSettings() }
					]
				);
				return false;
				
			case RESULTS.UNAVAILABLE:
				Alert.alert("Error", "Calendar is not available on this device");
				return false;
				
			default:
				return false;
		}
	}, []);

	const createCalendarEvent = useCallback(() => {
		if (!destination) return;
		
		const startDate = suggestedDates[0];
		const endDate = suggestedDates[1];
		const locationString = destinationName;
		
		const newEventId = NativeEventKit.createEvent(
			`Travel to ${destinationName}`,
			startDate,
			endDate,
			locationString,
			destination.description,
			1440
		);
		
		if (!newEventId) {
			Alert.alert("Error", "Failed to create calendar event");
			return;
		}
		
		addEvent(newEventId, destinationName);
	}, [destinationName, suggestedDates, destination, addEvent]);

	const deleteCalendarEvent = useCallback(() => {
		if (!eventId) return;
		
		const success = NativeEventKit.deleteEvent(eventId);
		
		if (!success) {
			Alert.alert("Error", "Failed to remove event from calendar");
			return;
		}
		
		removeEventByDestination(destinationName);
	}, [eventId, destinationName, removeEventByDestination]);

	const handleCalendarAction = useCallback(async () => {
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
			console.error("Calendar error:", error);
		} finally {
			setIsCalendarLoading(false);
		}
	}, [eventId, deleteCalendarEvent, checkCalendarPermission, createCalendarEvent]);

	return (
		<View style={styles.calendarSection}>
			<Text style={styles.sectionTitle}>Travel Planning</Text>
			<View style={styles.calendarCard}>
				<View style={styles.calendarInfo}>
					<Text style={styles.calendarTitle}>Suggested Travel Dates</Text>
					<Text style={styles.calendarDates}>{getTravelDateRange()}</Text>
					<View style={[
						styles.calendarStatusBadge,
						!eventId && styles.calendarStatusBadgeHidden
					]}>
						<Text style={styles.calendarStatusText}>✓ Added to calendar</Text>
					</View>
				</View>
				<CalendarButton
					hasEvent={!!eventId}
					isLoading={isCalendarLoading}
					onPress={handleCalendarAction}
					onConfirmation={() => {}}
				/>
			</View>
		</View>
	);
}

export default React.memo(TravelPlanningSection);

const styles = StyleSheet.create((theme, rt) => ({
	calendarSection: {
		marginBottom: 24,
		position: "relative",
	},
	sectionTitle: {
		fontSize: rt.fontScale * 24,
		fontWeight: "800",
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
		fontWeight: "700",
		color: theme.colors.primaryText,
		marginBottom: 4,
	},
	calendarDates: {
		fontSize: rt.fontScale * 16,
		color: theme.colors.primaryText,
		fontWeight: "600",
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
		fontWeight: "600",
		color: "white",
	},
})); 
