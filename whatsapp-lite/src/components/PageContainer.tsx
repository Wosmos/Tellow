import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { useTheme } from "../constants";

type Props = {
	children: React.ReactNode;
	styles?: ViewStyle;
};

const PageContainer = (props: Props) => {
	const { theme } = useTheme();

	return (
		<View style={{ ...styles.container, backgroundColor: theme.colors.background, ...props.styles }}>
			{props.children}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingHorizontal: 20,
	},
});

export default PageContainer;
