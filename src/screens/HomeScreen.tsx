import { FlashList, type ListRenderItem } from "@shopify/flash-list";
import React from "react";
import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import data from "../../data.json";
import { DestinationCard } from "../components/DestinationCard";
import type { Destination } from "../navigation/types";

const renderDestinationCard: ListRenderItem<Destination> = ({ item }) => (
	<DestinationCard item={item} />
);

export default function HomeScreen() {
	return (
		<FlashList
			data={data.destinations}
			renderItem={renderDestinationCard}
			keyExtractor={(item) => item.name}
			numColumns={2}
			contentInsetAdjustmentBehavior="automatic"
			showsVerticalScrollIndicator={false}
			contentContainerStyle={styles.container}
		/>
	);
}

const styles = StyleSheet.create({
	container: {
		paddingHorizontal: 8,
		paddingTop: 32,
		paddingBottom: 16,
	},
});
