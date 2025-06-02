import { MMKV } from "react-native-mmkv";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const storage = new MMKV({ id: "explora-travel-store" });

const mmkvStorage = {
	getItem: (name: string) => {
		const value = storage.getString(name);
		return value ?? null;
	},
	setItem: (name: string, value: string) => {
		storage.set(name, value);
	},
	removeItem: (name: string) => {
		storage.delete(name);
	},
};

type TravelStore = {
	calendarEvents: Record<string, string>; // destinationName -> eventId
	addEvent: (eventId: string, destinationName: string) => void;
	removeEvent: (eventId: string) => void;
	removeEventByDestination: (destinationName: string) => void;
};

export const useTravelStore = create<TravelStore>()(
	persist(
		(set, get) => ({
			calendarEvents: {},

			addEvent: (eventId, destinationName) =>
				set((state) => ({
					calendarEvents: {
						...state.calendarEvents,
						[destinationName]: eventId,
					},
				})),

			removeEvent: (eventId) =>
				set((state) => {
					const destinationName = Object.keys(state.calendarEvents).find(
						(name) => state.calendarEvents[name] === eventId,
					);
					if (destinationName) {
						const { [destinationName]: removed, ...rest } =
							state.calendarEvents;
						return { calendarEvents: rest };
					}
					return state;
				}),

			removeEventByDestination: (destinationName) =>
				set((state) => {
					const { [destinationName]: removed, ...rest } = state.calendarEvents;
					return { calendarEvents: rest };
				}),
		}),
		{
			name: "travel-store",
			storage: createJSONStorage(() => mmkvStorage),
			version: 1,
		},
	),
);
