import type { DestinationWithEvent } from "../store/destinationsStore";

export type Destination = DestinationWithEvent;

export type RootStackParamList = {
	Home: undefined;
	Detail: {
		destination: Destination;
	};
	Map: {
		destination: Destination;
	};
}; 