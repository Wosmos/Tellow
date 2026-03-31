import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useTheme } from "../constants";
import { UserData } from "../utils/store/types";

type Props = {
	text: string;
	user: UserData;
	loggedInUser: UserData;
	onCancel: () => void;
};

const ReplyingTo = (props: Props) => {
	const { theme } = useTheme();
	const { text, user, onCancel, loggedInUser } = props;
	const name = user.userId === loggedInUser.userId ? "You" : `${user.firstName} ${user.lastName}`;

	return (
		<View style={[styles.container, { backgroundColor: theme.colors.inputBg, borderLeftColor: theme.colors.primary }]}>
			<View style={styles.textContainer}>
				<Text numberOfLines={1} style={[styles.name, { color: theme.colors.primary }]}>
					{name}
				</Text>
				<Text numberOfLines={1} style={{ color: theme.colors.text }}>{text}</Text>
			</View>

			<TouchableOpacity onPress={onCancel}>
				<AntDesign name="closecircleo" size={22} color={theme.colors.textSecondary} />
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: 10,
		flexDirection: "row",
		alignItems: "center",
		borderLeftWidth: 3,
		marginHorizontal: 12,
		marginBottom: 4,
		borderRadius: 8,
	},
	textContainer: {
		flex: 1,
		marginRight: 8,
	},
	name: {
		fontFamily: "medium",
		letterSpacing: 0.3,
		marginBottom: 2,
	},
});

export default ReplyingTo;
