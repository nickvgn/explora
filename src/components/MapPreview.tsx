import React from "react";
import { Pressable } from "react-native";
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";
import { StyleSheet, withUnistyles } from "react-native-unistyles";

const ThemedMapView = withUnistyles(MapView, (_, rt) => ({
	userInterfaceStyle: (rt.themeName === "dark" ? "dark" : "light") as "dark" | "light",
}));

interface MapPreviewProps {
	latitude: number;
	longitude: number;
	title: string;
	onPress: () => void;
}

export default function MapPreview({ latitude, longitude, title, onPress }: MapPreviewProps) {
	const mapRegion = {
		latitude,
		longitude,
		latitudeDelta: 0.01,
		longitudeDelta: 0.01,
	};

	return (
		<Pressable style={styles.mapPreview} onPress={onPress}>
			<ThemedMapView
				style={styles.mapView}
				provider={PROVIDER_DEFAULT}
				initialRegion={mapRegion}
				scrollEnabled={false}
				zoomEnabled={false}
				rotateEnabled={false}
				pitchEnabled={false}
			>
				<Marker
					coordinate={{
						latitude,
						longitude,
					}}
					title={title}
				/>
			</ThemedMapView>
		</Pressable>
	);
}

const styles = StyleSheet.create((theme) => ({
	mapPreview: {
		position: "relative",
		height: 150,
		borderRadius: 20,
		overflow: "hidden",
		backgroundColor: theme.colors.primaryAccent,
	},
	mapView: {
		width: "100%",
		height: 150,
	},
})); 