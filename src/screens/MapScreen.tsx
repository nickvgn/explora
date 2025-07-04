import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import { View } from "react-native";
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";
import { StyleSheet, withUnistyles } from "react-native-unistyles";
import type { RootStackParamList } from "../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "Map">;

const ThemedMapView = withUnistyles(MapView, (_, rt) => ({
	userInterfaceStyle: (rt.themeName === "dark" ? "dark" : "light") as
		| "dark"
		| "light",
}));

export default function MapScreen({ route }: Props) {
	const { latitude, longitude } = route.params;

	const mapRegion = {
		latitude,
		longitude,
		latitudeDelta: 0.01,
		longitudeDelta: 0.01,
	};

	return (
		<View style={styles.container}>
			<ThemedMapView
				style={styles.map}
				provider={PROVIDER_DEFAULT}
				region={mapRegion}
				showsUserLocation
				showsMyLocationButton
			>
				<Marker
					coordinate={{
						latitude,
						longitude,
					}}
				/>
			</ThemedMapView>
		</View>
	);
}

const styles = StyleSheet.create((_, rt) => ({
	map: {
		flex: 1,
		width: rt.screen.width,
		height: rt.screen.height,
	},
	container: {
		flex: 1,
	},
}));
