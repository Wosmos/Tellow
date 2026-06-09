import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { supabase } from "../supabase";
import { authenticate, logout } from "../store/authSlice";
import { ApplicationDispatch } from "../store";

type SignUpParams = {
	email: string;
	password: string;
	firstName: string;
	lastName: string;
	phoneNumber?: string;
};

type SignInParams = {
	email: string;
	password: string;
};

let timer: NodeJS.Timeout;

export const signUp = (credentials: SignUpParams) => {
	return async (dispatch: ApplicationDispatch) => {
		try {
			const { email, password, firstName, lastName, phoneNumber } = credentials;

			const { data: authData, error: authError } = await supabase.auth.signUp({
				email,
				password,
			});

			if (authError) throw new Error(authError.message);

			if (!authData.session) {
				throw new Error("Please check your email to confirm your account before signing in.");
			}

			const userId = authData.user!.id;
			const token = authData.session.access_token;
			const expiryDate = new Date(authData.session.expires_at! * 1000);

			const userData = await createUser({ firstName, lastName, email, userId, phoneNumber });

			saveDataToStorage({ token, userId, expiryDate });

			await storePushToken(userData);

			const millisecondsUntilExpiry = expiryDate.valueOf() - new Date().valueOf();
			timer = setTimeout(() => {
				dispatch(userLogout(userId));
			}, millisecondsUntilExpiry);

			dispatch(authenticate({ token, userData }));
		} catch (error: any) {
			console.log("Sign up error:", error);
			const msg = error.message || "";
			if (msg.includes("already registered")) {
				throw new Error("Email already in use!");
			}
			if (msg.includes("confirm your account")) {
				throw new Error(msg);
			}
			throw new Error(msg || "Something went wrong.");
		}
	};
};

export const signIn = (credentials: SignInParams) => {
	return async (dispatch: ApplicationDispatch) => {
		try {
			const { email, password } = credentials;

			const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
				email,
				password,
			});

			if (authError) throw new Error(authError.message);

			const userId = authData.user.id;
			const token = authData.session.access_token;
			const expiryDate = new Date(authData.session.expires_at! * 1000);

			const userData = await getUserData(userId);

			saveDataToStorage({ token, userId, expiryDate });

			await storePushToken(userData);

			const millisecondsUntilExpiry = expiryDate.valueOf() - new Date().valueOf();
			timer = setTimeout(() => {
				dispatch(userLogout(userId));
			}, millisecondsUntilExpiry);

			dispatch(authenticate({ token, userData }));
		} catch (error: any) {
			console.log("Sign in error:", error);
			let message = error.message || "Something went wrong.";
			if (message.includes("Invalid login")) {
				message = "The username or password was incorrect";
			}
			throw new Error(message);
		}
	};
};

type UpdateSignedInUserDataParams = {
	firstName?: string;
	lastName?: string;
	email?: string;
	about?: string;
	firstLast?: string;
	profilePicture?: string;
	phoneNumber?: string;
};

export const updateSignedInUserData = async (userId: string, newData: UpdateSignedInUserDataParams) => {
	const updateData: any = {};
	if (newData.firstName !== undefined) updateData.first_name = newData.firstName;
	if (newData.lastName !== undefined) updateData.last_name = newData.lastName;
	if (newData.email !== undefined) updateData.email = newData.email;
	if (newData.about !== undefined) updateData.about = newData.about;
	if (newData.profilePicture !== undefined) updateData.profile_picture = newData.profilePicture;
	if (newData.phoneNumber !== undefined) updateData.phone_number = newData.phoneNumber;

	if (newData.firstName && newData.lastName) {
		updateData.first_last = `${newData.firstName} ${newData.lastName}`.toLowerCase();
	}

	await supabase.from("users").update(updateData).eq("user_id", userId);
};

type CreateUserParams = {
	firstName: string;
	lastName: string;
	email: string;
	userId: string;
	phoneNumber?: string;
};

const createUser = async (data: CreateUserParams) => {
	const { firstName, lastName, email, userId, phoneNumber } = data;
	const firstLast = `${firstName} ${lastName}`.toLowerCase();

	const { error } = await supabase.from("users").upsert({
		user_id: userId,
		first_name: firstName,
		last_name: lastName,
		first_last: firstLast,
		email,
		...(phoneNumber ? { phone_number: phoneNumber } : {}),
	}, { onConflict: "user_id" });
	if (error) throw error;

	return {
		firstName,
		lastName,
		firstLast,
		email,
		userId,
		phoneNumber: phoneNumber || "",
		signUpDate: new Date().toISOString(),
	};
};

export const userLogout = (userId: string) => {
	return async (dispatch: ApplicationDispatch) => {
		try {
			await removePushToken(userId);
		} catch (error) {
			console.log(error);
		}

		await supabase.auth.signOut();
		AsyncStorage.clear();
		if (timer) clearTimeout(timer);
		dispatch(logout());
	};
};

type SaveDataToStorageParams = {
	token: string;
	userId: string;
	expiryDate: Date;
};

const saveDataToStorage = (data: SaveDataToStorageParams) => {
	const { token, userId, expiryDate } = data;
	AsyncStorage.setItem(
		"userData",
		JSON.stringify({
			token,
			userId,
			expiryDate: expiryDate.toISOString(),
		})
	);
};

export const getUserData = async (userId: string) => {
	try {
		const { data, error } = await supabase
			.from("users")
			.select("*")
			.eq("user_id", userId)
			.single();

		if (error) throw error;

		return {
			userId: data.user_id,
			firstName: data.first_name,
			lastName: data.last_name,
			firstLast: data.first_last,
			email: data.email,
			about: data.about || "",
			profilePicture: data.profile_picture || "",
			phoneNumber: data.phone_number || "",
			signUpDate: data.sign_up_date,
		};
	} catch (error) {
		console.log(error);
	}
};

// PUSH NOTIFICATIONS and TOKENS

const storePushToken = async (userData: any) => {
	if (!Device.isDevice) return;

	const projectId = Constants.expoConfig?.extra?.eas?.projectId;
	const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;

	const { data: existing } = await supabase
		.from("push_tokens")
		.select("id")
		.eq("user_id", userData.userId)
		.eq("token", token);

	if (existing && existing.length > 0) return;

	await supabase.from("push_tokens").insert({
		user_id: userData.userId,
		token,
	});
};

export const getUserPushTokens = async (userId: string) => {
	try {
		const { data, error } = await supabase
			.from("push_tokens")
			.select("token")
			.eq("user_id", userId);

		if (error) throw error;

		const tokens: Record<string, string> = {};
		data?.forEach((row, i) => {
			tokens[i.toString()] = row.token;
		});
		return tokens;
	} catch (error) {
		console.log(error);
		return {};
	}
};

const removePushToken = async (userId: string) => {
	if (!Device.isDevice) return;

	const projectId = Constants.expoConfig?.extra?.eas?.projectId;
	const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;

	await supabase
		.from("push_tokens")
		.delete()
		.eq("user_id", userId)
		.eq("token", token);
};
