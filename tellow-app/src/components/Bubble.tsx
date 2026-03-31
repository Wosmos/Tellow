import React from "react";
import { StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";
import { useTheme } from "../constants";

type Props = {
	type: "system" | "error" | "message";
	text: string;
	subText?: string;
};

const Bubble = (props: Props) => {
	const { type, text, subText } = props;
	const { theme } = useTheme();

	const bubbleStyle: ViewStyle = { ...styles.container };
	const textStyle: TextStyle = { ...styles.text };
	const wrapperStyle: ViewStyle = { ...styles.wrapperStyle };

	switch (type) {
		case "system":
			textStyle.color = theme.colors.infoBubbleText;
			bubbleStyle.backgroundColor = theme.colors.infoBubble;
			bubbleStyle.alignItems = "center";
			bubbleStyle.marginTop = 10;
			bubbleStyle.borderWidth = 0;
			break;
		case "error":
			bubbleStyle.backgroundColor = theme.colors.red;
			textStyle.color = "#fff";
			bubbleStyle.marginTop = 10;
			bubbleStyle.borderWidth = 0;
			break;
		case "message":
			textStyle.color = theme.colors.sentBubbleText;
			bubbleStyle.backgroundColor = theme.colors.sentBubble;
			bubbleStyle.alignItems = "center";
			bubbleStyle.maxWidth = "90%";
			bubbleStyle.padding = 8;
			bubbleStyle.borderWidth = 0;
			break;
		default:
			break;
	}

	return (
		<View style={wrapperStyle}>
			<View style={bubbleStyle}>
				<Text style={textStyle}>{text}</Text>
				{subText && <Text style={[styles.subText, { color: theme.colors.textSecondary }]}>{subText}</Text>}
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	wrapperStyle: {
		flexDirection: "column",
		justifyContent: "center",
	},
	container: {
		borderRadius: 16,
		padding: 10,
		marginBottom: 10,
		borderWidth: 0,
	},
	text: {
		fontFamily: "regular",
		letterSpacing: 0.3,
		fontSize: 15,
	},
	subText: {
		fontFamily: "regular",
		letterSpacing: 0.1,
		fontSize: 12,
		justifyContent: "flex-end",
		marginTop: 5,
		width: "100%",
		textAlign: "right",
	},
});

export default Bubble;
