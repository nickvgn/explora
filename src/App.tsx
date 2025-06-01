import React from "react";
import "./theme/unistyles";
import { Navigation } from "./navigation/root-navigator";
import FontProvider from "./providers/FontProvider";

export default function App() {
	return (
		<FontProvider>
			<Navigation />
		</FontProvider>
	);
}
