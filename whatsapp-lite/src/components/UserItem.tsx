import React from "react";
import { GestureResponderEvent, StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { useTheme } from "../constants";
import UserImage from "./UserImage";

const IMAGE_SIZE = 40;

type Props = {
	title: string;
	subTitle?: string;
	image?: string;
	onPress?: ((event: GestureResponderEvent) => void) | undefined;
	isChecked?: boolean;
	type: "user" | "group" | "link" | "button";
	icon?: any;
	hideImage?: boolean;
};

const UserItem = (props: Props) => {
	const { theme } = useTheme();
	const { title, subTitle, image, onPress, isChecked, type, icon, hideImage } = props;

	return (
		<TouchableWithoutFeedback onPress={onPress}>
			<View style={[styles.container, { borderBottomColor: theme.colors.border }]}>
				{icon ? (
					<View style={[styles.leftIconContainer, { backgroundColor: theme.colors.inputBg }]}>
						<AntDesign name={icon} size={20} color={theme.colors.primary} />
					</View>
				) : hideImage ? null : (
					<UserImage uri={image} size={40} />
				)}

				<View style={styles.textContainer}>
					<Text numberOfLines={1} style={[styles.title, { color: theme.colors.text }]}>
						{title}
					</Text>
					{subTitle && (
						<Text numberOfLines={1} style={[styles.subTitle, { color: theme.colors.textSecondary }]}>
							{subTitle}
						</Text>
					)}
				</View>

				{type === "group" && (
					<View style={[
						styles.iconContainer,
						{ borderColor: theme.colors.border },
						isChecked && { backgroundColor: theme.colors.primary, borderColor: "transparent" },
					]}>
						<Ionicons name="checkmark" size={18} color="white" />
					</View>
				)}

				{type === "link" && (
					<Ionicons name="chevron-forward-outline" size={18} color={theme.colors.textSecondary} />
				)}
			</View>
		</TouchableWithoutFeedback>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		paddingVertical: 8,
		borderBottomWidth: 1,
		alignItems: "center",
		minHeight: 50,
	},
	textContainer: {
		marginLeft: 14,
		flex: 1,
	},
	title: {
		fontFamily: "medium",
		fontSize: 16,
		letterSpacing: 0.3,
	},
	subTitle: {
		fontFamily: "regular",
		letterSpacing: 0.3,
		marginTop: 2,
	},
	iconContainer: {
		borderWidth: 1,
		borderRadius: 50,
		backgroundColor: "white",
	},
	leftIconContainer: {
		borderRadius: 50,
		alignItems: "center",
		justifyContent: "center",
		width: IMAGE_SIZE,
		height: IMAGE_SIZE,
	},
});

export default UserItem;
