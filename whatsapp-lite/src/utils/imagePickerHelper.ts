import * as ImagePicker from "expo-image-picker";
import { Platform } from "react-native";
import uuid from "react-native-uuid";
import { supabase } from "./supabase";

export const launchImagePicker = async () => {
	await checkMediaPermissions();

	const result = await ImagePicker.launchImageLibraryAsync({
		mediaTypes: ImagePicker.MediaTypeOptions.Images,
		allowsEditing: true,
		aspect: [1, 1],
		quality: 1,
	});

	if (!result.canceled) {
		return result.assets[0].uri;
	}
};

export const openCamera = async () => {
	const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

	if (permissionResult.granted === false) {
		console.log("No permission to access the camera");
		return;
	}

	const result = await ImagePicker.launchCameraAsync({
		mediaTypes: ImagePicker.MediaTypeOptions.Images,
		allowsEditing: true,
		aspect: [1, 1],
		quality: 1,
	});

	if (!result.canceled) {
		return result.assets[0].uri;
	}
};

export const uploadImageAsync = async (uri: string, isChatImage = false, isStatusImage = false) => {
	const blob: any = await new Promise((resolve, reject) => {
		const xhr = new XMLHttpRequest();
		xhr.onload = function () {
			resolve(xhr.response);
		};

		xhr.onerror = function (e) {
			console.log(e);
			reject(new TypeError("Network request failed"));
		};

		xhr.responseType = "blob";
		xhr.open("GET", uri, true);
		xhr.send();
	});

	const pathFolder = isChatImage ? "chatImages" : isStatusImage ? "statusImages" : "profileImages";
	const fileName = `${pathFolder}/${uuid.v4()}`;

	// Convert blob to arraybuffer for Supabase
	const arrayBuffer = await new Response(blob).arrayBuffer();

	const { error } = await supabase.storage
		.from("images")
		.upload(fileName, arrayBuffer, {
			contentType: "image/jpeg",
			upsert: false,
		});

	blob.close();

	if (error) throw error;

	const { data } = supabase.storage.from("images").getPublicUrl(fileName);

	return data.publicUrl;
};

const checkMediaPermissions = async () => {
	if (Platform.OS !== "web") {
		const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
		if (permissionResult.granted === false) {
			return Promise.reject("We need permission to access your photos");
		}
	}

	return Promise.resolve();
};
