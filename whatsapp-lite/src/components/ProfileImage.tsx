import React, { useState } from "react";
import { ActivityIndicator, Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import userImage from "../../assets/images/userImage.jpeg";
import { updateSignedInUserData } from "../utils/actions/authActions";
import { useAppDispatch } from "../utils/store";
import { launchImagePicker, uploadImageAsync } from "../utils/imagePickerHelper";
import { updateLoggedInUserData } from "../utils/store/authSlice";
import { useTheme } from "../constants";
import { updateChatData } from "../utils/actions/chatActions";

type Props = {
	uri: string | undefined;
	userId: string;
	size: number;
	chatId?: string;
};

const ProfileImage = (props: Props) => {
	const { theme } = useTheme();
	const dispatch = useAppDispatch();
	const source = props.uri ? { uri: props.uri } : userImage;
	const [image, setImage] = useState(source);
	const [isLoading, setIsLoading] = useState(false);

	const pickImage = async () => {
		try {
			const tempUri = await launchImagePicker();
			if (!tempUri) return;

			setIsLoading(true);
			const uploadUrl = await uploadImageAsync(tempUri);
			setIsLoading(false);

			if (!uploadUrl) throw new Error("Could not upload image");

			if (props.chatId) {
				await updateChatData({
					chatId: props.chatId,
					userId: props.userId,
					chatData: { chatImage: uploadUrl },
				});
			} else {
				const newData = { profilePicture: uploadUrl };
				await updateSignedInUserData(props.userId, newData);
				dispatch(updateLoggedInUserData({ newData }));
			}

			setImage({ uri: uploadUrl });
		} catch (error) {
			console.log(error);
			setIsLoading(false);
		}
	};

	return (
		<TouchableOpacity onPress={pickImage}>
			{isLoading ? (
				<View style={[styles.loadingContainer, { width: props.size, height: props.size }]}>
					<ActivityIndicator size="small" color={theme.colors.primary} />
				</View>
			) : (
				<Image
					style={[styles.image, { width: props.size, height: props.size, borderColor: theme.colors.border }]}
					source={image}
				/>
			)}

			<View style={[styles.editIconContainer, { backgroundColor: theme.colors.primary }]}>
				<FontAwesome name="camera" size={12} color="#fff" />
			</View>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	image: {
		borderRadius: 50,
		borderWidth: 1,
	},
	editIconContainer: {
		position: "absolute",
		bottom: 0,
		right: 0,
		borderRadius: 16,
		padding: 6,
	},
	loadingContainer: {
		justifyContent: "center",
		alignItems: "center",
	},
});

export default ProfileImage;
