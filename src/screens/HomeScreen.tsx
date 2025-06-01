import { FlashList, type ListRenderItem } from "@shopify/flash-list";
import React from "react";
import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import data from "../../data.json";
import DestinationCard from "../components/DestinationCard";
import type { Destination } from "../navigation/types";

export default function HomeScreen() {
	const renderDestinationCard: ListRenderItem<Destination> = ({
		item,
		index,
	}) => <DestinationCard item={item} index={index} />;

	return (
		<FlashList
			data={data.destinations}
			renderItem={renderDestinationCard}
			keyExtractor={(item) => item.name}
			numColumns={2}
			contentInsetAdjustmentBehavior="automatic"
			showsVerticalScrollIndicator={false}
			ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
			contentContainerStyle={styles.container}
		/>
	);
}

const styles = StyleSheet.create({
	container: {
		paddingHorizontal: 8,
		paddingTop: 16,
		paddingBottom: 16,
	},
});
