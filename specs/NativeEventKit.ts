import type { TurboModule } from "react-native";
import { TurboModuleRegistry } from "react-native";

export interface Spec extends TurboModule {
	createEvent(
		title: string,
		startDate: string,
		endDate: string,
		location: string,
		notes: string,
		reminderMinutesBefore?: number,
	): string | null;
	deleteEvent(eventId: string): boolean;
}

export default TurboModuleRegistry.getEnforcing<Spec>("NativeEventKit");
