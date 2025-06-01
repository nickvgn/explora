import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import { View } from "react-native";
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";
import { StyleSheet } from "react-native-unistyles";
import type { RootStackParamList } from "../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "Map">;

export default function MapScreen({ route }: Props) {
	const { destination } = route.params;

	const mapRegion = {
		latitude: destination.location.latitude,
		longitude: destination.location.longitude,
		latitudeDelta: 0.1,
		longitudeDelta: 0.1,
	};

	return (
		<View style={styles.container}>
			<MapView
				style={styles.map}
				provider={PROVIDER_DEFAULT}
				region={mapRegion}
				showsUserLocation
				showsMyLocationButton
			>
				<Marker
					coordinate={{
						latitude: destination.location.latitude,
						longitude: destination.location.longitude,
					}}
					title={destination.name}
					description={destination.description}
				/>
			</MapView>
		</View>
	);
}

const styles = StyleSheet.create((theme, rt) => ({
	map: {
		flex: 1,
		width: rt.screen.width,
		height: rt.screen.height,
	},
	container: {
		flex: 1,
	},
})); 
