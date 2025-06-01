import data from "../../data.json";

export type Destination = (typeof data.destinations)[0];

export type RootStackParamList = {
	Home: undefined;
	Detail: {
		destination: Destination;
	};
}; 