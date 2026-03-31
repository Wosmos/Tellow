import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "../constants";

const CallsScreen = () => {
	const { theme } = useTheme();

	return (
		<View style={[styles.container, { backgroundColor: theme.colors.background }]}>
			<Text style={[styles.text, { color: theme.colors.textSecondary }]}>No recent calls</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	text: {
		fontFamily: "regular",
		fontSize: 16,
	},
});

export default CallsScreen;
