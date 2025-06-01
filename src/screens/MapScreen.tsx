import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";
import { StyleSheet, UnistylesRuntime } from "react-native-unistyles";
import type { RootStackParamList } from "../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "Map">;

export default function MapScreen({ route }: Props) {
	const { destination } = route.params;

	const region = {
		latitude: destination.location.latitude,
		longitude: destination.location.longitude,
		latitudeDelta: 0.01,
		longitudeDelta: 0.01,
	};

	return (
		<MapView
			style={styles.map}
			provider={PROVIDER_DEFAULT}
			region={region}
			showsUserLocation={true}
			showsMyLocationButton={true}
			mapType="terrain"
		>
			<Marker
				coordinate={{
					latitude: destination.location.latitude,
					longitude: destination.location.longitude,
				}}
				title={destination.name}
				description="Travel destination"
			/>
		</MapView>
	);
}

const styles = StyleSheet.create((theme, rt) => ({
	map: {
		flex: 1,
		width: rt.screen.width,
		height: rt.screen.height,
	},
})); 
