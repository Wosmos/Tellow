import React, { useCallback, useReducer, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";
import { Ionicons, Feather, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { useAppDispatch, useAppSelector } from "../utils/store";
import { updateSignedInUserData, userLogout } from "../utils/actions/authActions";
import { useTheme } from "../constants";
import Input from "../components/Input";
import { validateInput } from "../utils/actions/formActions";
import { reducer } from "../utils/reducers/formReducer";
import { updateLoggedInUserData } from "../utils/store/authSlice";
import ProfileImage from "../components/ProfileImage";
import SubmitButton from "../components/SubmitButton";

const SettingsScreen = () => {
	const { theme, isDark, toggleTheme } = useTheme();
	const [loading, setLoading] = useState(false);
	const [showSuccessMessage, setShowSuccessMessage] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const userData = useAppSelector((state) => state.auth.userData)!;
	const dispatch = useAppDispatch();

	const firstName = userData?.firstName || "";
	const lastName = userData?.lastName || "";
	const email = userData?.email || "";
	const about = userData?.about || "";

	const initialState = {
		inputValues: { firstName, lastName, email, about },
		inputValidities: { firstName: undefined, lastName: undefined, email: undefined, about: undefined },
		formIsValid: false,
	};

	const [formState, dispatchFormState] = useReducer(reducer, initialState);

	const inputChangedHandler = useCallback(
		(inputId: string, inputValue: string) => {
			const result = validateInput(inputId, inputValue);
			dispatchFormState({ inputId, validationResult: result, inputValue });
		},
		[dispatchFormState]
	);

	const saveHandler = useCallback(async () => {
		const updatedValues = formState.inputValues;
		try {
			if (userData) {
				setLoading(true);
				await updateSignedInUserData(userData.userId, updatedValues);
				dispatch(updateLoggedInUserData({ newData: updatedValues }));
				setShowSuccessMessage(true);
				setIsEditing(false);
				setTimeout(() => setShowSuccessMessage(false), 3000);
			}
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	}, [formState, dispatch]);

	const hasChanges = () => {
		const v = formState.inputValues;
		return v.firstName !== firstName || v.lastName !== lastName || v.email !== email || v.about !== about;
	};

	const cardBg = theme.dark ? "rgba(255,255,255,0.06)" : theme.colors.background;
	const cardBorder = theme.dark ? "rgba(255,255,255,0.08)" : theme.colors.border;

	return (
		<ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
			{/* Header */}
			<View style={[styles.header, { backgroundColor: theme.colors.settingsHeader }]}>
				<View style={styles.avatarWrapper}>
					{userData && <ProfileImage size={72} userId={userData.userId} uri={userData.profilePicture} />}
				</View>
			</View>

			{/* Name row */}
			<View style={[styles.nameRow, { backgroundColor: theme.colors.background }]}>
				<View style={{ flex: 1 }}>
					<Text style={[styles.name, { color: theme.colors.text }]}>
						{firstName} {lastName}
					</Text>
					<Text style={[styles.online, { color: theme.colors.online }]}>online</Text>
				</View>
				<TouchableOpacity
					style={[styles.editFab, { backgroundColor: theme.dark ? "rgba(91,107,245,0.3)" : theme.colors.settingsHeader }]}
					onPress={() => setIsEditing(!isEditing)}
				>
					<Feather name="edit-2" size={16} color={theme.dark ? "#8B95F7" : theme.colors.primary} />
				</TouchableOpacity>
			</View>

			{/* Info card */}
			<View style={[styles.card, { backgroundColor: cardBg, borderColor: cardBorder }]}>
				<InfoRow
					icon={<Ionicons name="at" size={20} color={theme.colors.textSecondary} />}
					value={email}
					label="Username"
					theme={theme}
				/>
				<View style={[styles.divider, { backgroundColor: theme.dark ? "rgba(255,255,255,0.06)" : theme.colors.border }]} />
				<InfoRow
					icon={<Ionicons name="call-outline" size={20} color={theme.colors.textSecondary} />}
					value="Not set"
					label="Phone"
					theme={theme}
				/>
				<View style={[styles.divider, { backgroundColor: theme.dark ? "rgba(255,255,255,0.06)" : theme.colors.border }]} />
				<InfoRow
					icon={<Ionicons name="information-circle-outline" size={20} color={theme.colors.textSecondary} />}
					value={about || "None"}
					label="Bio"
					theme={theme}
				/>
			</View>

			{/* Edit form */}
			{isEditing && (
				<View style={[styles.card, styles.editCard, { backgroundColor: cardBg, borderColor: cardBorder }]}>
					<Input
						id="firstName" label="First name" icon="user-o" iconPack={FontAwesome}
						onInputChanged={inputChangedHandler} autoCapitalize="none"
						errorText={formState.inputValidities["firstName"]} initialValue={firstName}
					/>
					<Input
						id="lastName" label="Last name" icon="user-o" iconPack={FontAwesome}
						onInputChanged={inputChangedHandler} autoCapitalize="none"
						errorText={formState.inputValidities["lastName"]} initialValue={lastName}
					/>
					<Input
						id="about" label="About" icon="user-o" iconPack={FontAwesome}
						onInputChanged={inputChangedHandler} autoCapitalize="none"
						errorText={formState.inputValidities["about"]} initialValue={about}
					/>
					{showSuccessMessage && <Text style={[styles.savedText, { color: theme.colors.online }]}>Saved!</Text>}
					{loading ? (
						<ActivityIndicator size="small" color={theme.colors.primary} style={{ marginTop: 10 }} />
					) : (
						hasChanges() && (
							<SubmitButton title="Save" onPress={saveHandler} style={{ marginTop: 12, width: "100%" }} disabled={!formState.formIsValid} />
						)
					)}
				</View>
			)}

			{/* Menu items */}
			<View style={[styles.card, styles.menuCard, { backgroundColor: cardBg, borderColor: cardBorder }]}>
				<MenuRow icon={<Ionicons name="notifications-outline" size={20} color={theme.colors.text} />} label="Notifications" theme={theme} />
				<View style={[styles.divider, { backgroundColor: theme.dark ? "rgba(255,255,255,0.06)" : theme.colors.border }]} />
				<MenuRow icon={<MaterialIcons name="data-usage" size={20} color={theme.colors.text} />} label="Data and Storage" theme={theme} />
				<View style={[styles.divider, { backgroundColor: theme.dark ? "rgba(255,255,255,0.06)" : theme.colors.border }]} />
				<MenuRow icon={<Ionicons name="lock-closed-outline" size={20} color={theme.colors.text} />} label="Privacy and Security" theme={theme} />
				<View style={[styles.divider, { backgroundColor: theme.dark ? "rgba(255,255,255,0.06)" : theme.colors.border }]} />
				<MenuRow
					icon={<Ionicons name={isDark ? "sunny-outline" : "moon-outline"} size={20} color={theme.colors.text} />}
					label={isDark ? "Light Mode" : "Dark Mode"}
					theme={theme}
					onPress={toggleTheme}
					right={
						<Switch
							value={isDark}
							onValueChange={toggleTheme}
							trackColor={{ false: "#ddd", true: theme.colors.primary }}
							thumbColor="#fff"
						/>
					}
				/>
				<View style={[styles.divider, { backgroundColor: theme.dark ? "rgba(255,255,255,0.06)" : theme.colors.border }]} />
				<MenuRow icon={<MaterialIcons name="dashboard-customize" size={20} color={theme.colors.text} />} label="Interface" theme={theme} />
			</View>

			{/* Logout */}
			<View style={styles.logoutSection}>
				<SubmitButton
					title="Logout"
					onPress={() => dispatch(userLogout(userData.userId))}
					style={{ width: "100%" }}
					color={theme.colors.red}
				/>
			</View>
		</ScrollView>
	);
};

const InfoRow = ({ icon, value, label, theme }: any) => (
	<View style={styles.infoRow}>
		{icon}
		<View style={{ flex: 1, marginLeft: 14 }}>
			<Text style={{ fontSize: 15, fontFamily: "regular", color: theme.colors.text }}>{value}</Text>
			<Text style={{ fontSize: 12, fontFamily: "regular", color: theme.colors.textSecondary, marginTop: 1 }}>{label}</Text>
		</View>
	</View>
);

const MenuRow = ({ icon, label, theme, onPress, right }: any) => (
	<TouchableOpacity style={styles.menuRow} activeOpacity={0.6} onPress={onPress}>
		{icon}
		<Text style={{ flex: 1, fontSize: 15, fontFamily: "regular", color: theme.colors.text, marginLeft: 14 }}>{label}</Text>
		{right || <Ionicons name="chevron-forward" size={18} color={theme.colors.textSecondary} />}
	</TouchableOpacity>
);

const styles = StyleSheet.create({
	container: { flex: 1 },
	header: {
		height: 130,
		justifyContent: "center",
		alignItems: "center",
	},
	avatarWrapper: { marginTop: 16 },
	nameRow: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: 20,
		paddingTop: 14,
		paddingBottom: 16,
	},
	name: { fontSize: 24, fontFamily: "bold" },
	online: { fontSize: 13, fontFamily: "regular", marginTop: 2 },
	editFab: {
		width: 40, height: 40, borderRadius: 20,
		alignItems: "center", justifyContent: "center",
	},
	// Card styles
	card: {
		marginHorizontal: 16,
		borderRadius: 16,
		borderWidth: 1,
		paddingHorizontal: 16,
		marginBottom: 12,
	},
	editCard: {
		paddingVertical: 8,
	},
	menuCard: {
		marginTop: 4,
	},
	divider: {
		height: StyleSheet.hairlineWidth,
		marginLeft: 34,
	},
	infoRow: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 13,
	},
	menuRow: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 14,
	},
	savedText: {
		fontFamily: "medium",
		marginTop: 8,
		textAlign: "center",
	},
	logoutSection: {
		paddingHorizontal: 16,
		paddingTop: 8,
		paddingBottom: 100,
	},
});

export default SettingsScreen;
