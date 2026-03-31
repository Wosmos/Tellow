import React from "react";
import { GestureResponderEvent, Image, StyleSheet, TouchableWithoutFeedback, View, ViewStyle } from "react-native";
import userImage from "../../assets/images/userImage.jpeg";
import { useTheme } from "../constants";
import { FontAwesome } from "@expo/vector-icons";

type Props = {
	uri: string | undefined;
	size: number;
	showRemoveIcon?: boolean;
	onPress?: ((event: GestureResponderEvent) => void) | undefined;
	styles?: ViewStyle;
};

const UserImage = (props: Props) => {
	const { theme } = useTheme();
	const source = props.uri ? { uri: props.uri } : userImage;

	return (
		<TouchableWithoutFeedback onPress={props.onPress}>
			<View style={props.styles}>
				<Image
					style={[styles.image, { width: props.size, height: props.size, borderColor: theme.colors.border }]}
					source={source}
				/>
				{props.showRemoveIcon && (
					<View style={[styles.removeIconContainer, { backgroundColor: theme.colors.border }]}>
						<FontAwesome name="close" size={10} color={theme.colors.text} />
					</View>
				)}
			</View>
		</TouchableWithoutFeedback>
	);
};

const styles = StyleSheet.create({
	image: {
		borderRadius: 50,
		borderWidth: 1,
	},
	removeIconContainer: {
		position: "absolute",
		bottom: -3,
		right: -3,
		borderRadius: 20,
		padding: 3,
	},
});

export default UserImage;
