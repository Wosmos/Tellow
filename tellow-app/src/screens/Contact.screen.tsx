import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../constants";
import { useAppSelector } from "../utils/store";
import { StackScreenProps } from "@react-navigation/stack";
import { LoggedInStackParamList } from "../navigation/types";
import { getUserChats, removeUserFromChat } from "../utils/actions/chatActions";
import UserItem from "../components/UserItem";
import SubmitButton from "../components/SubmitButton";

const defaultImage = require("../../assets/images/userImage.jpeg");

type Props = StackScreenProps<LoggedInStackParamList, "Contact">;

const ContactScreen = (props: Props) => {
	const { theme } = useTheme();
	const [isLoading, setIsLoading] = useState(false);
	const [commonChats, setCommonChats] = useState<string[]>([]);
	const storedUsers = useAppSelector((state) => state.storedUsers.storedUsers);
	const userData = useAppSelector((state) => state.auth.userData)!;
	const storedChats = useAppSelector((state) => state.chats.chatsData);
	const currentUser = storedUsers[props.route.params.userId];

	const chatId = props.route.params.chatId;
	const chatData = chatId && storedChats[chatId];

	const removeFromChat = useCallback(async () => {
		try {
			setIsLoading(true);
			if (chatData) {
				await removeUserFromChat({
					chatData,
					userLoggedInData: userData,
					userToRemoveData: currentUser,
				});
			}
			props.navigation.goBack();
		} catch (error) {
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	}, [props.navigation, isLoading]);

	useEffect(() => {
		const getCommonUserChats = async () => {
			const currentUserChats = await getUserChats(currentUser.userId);
			const currentUserChatsIds: string[] = Object.values(currentUserChats || {});
			const commonChatIds = currentUserChatsIds.filter((cid) => storedChats[cid] && storedChats[cid].isGroupChat);
			setCommonChats(commonChatIds);
		};
		getCommonUserChats();
	}, []);

	useEffect(() => {
		props.navigation.setOptions({
			headerTransparent: true,
			headerTitle: "",
			headerTintColor: "#fff",
			headerStyle: { backgroundColor: "transparent" },
		});
	}, []);

	const imageSource = currentUser.profilePicture ? { uri: currentUser.profilePicture } : defaultImage;

	return (
		<ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
			{/* Cover photo */}
			<View style={styles.coverContainer}>
				<Image source={imageSource} style={styles.coverImage} />
				<View style={styles.coverOverlay} />
				<View style={styles.coverTextContainer}>
					<Text style={styles.coverName}>{currentUser.firstName} {currentUser.lastName}</Text>
					<Text style={[styles.coverStatus, { color: theme.colors.online }]}>online</Text>
				</View>
			</View>

			{/* Message FAB */}
			<View style={styles.fabContainer}>
				<TouchableOpacity
					style={[styles.messageFab, { backgroundColor: theme.colors.primary }]}
					onPress={() => {
						// Find existing DM chat or start new one
						const existingChatId = Object.keys(storedChats).find((cid) => {
							const c = storedChats[cid];
							return !c.isGroupChat && c.users.includes(currentUser.userId) && c.users.includes(userData.userId);
						});
						if (existingChatId) {
							props.navigation.navigate("Chat", { chatId: existingChatId });
						} else {
							props.navigation.navigate("Chat", { selectedUserId: currentUser.userId });
						}
					}}
				>
					<Ionicons name="chatbubble" size={20} color="#fff" />
				</TouchableOpacity>
			</View>

			{/* Info rows */}
			<View style={[styles.infoSection, { backgroundColor: theme.colors.background }]}>
				<View style={[styles.infoRow, { borderBottomColor: theme.colors.border }]}>
					<Ionicons name="at" size={22} color={theme.colors.textSecondary} />
					<View style={styles.infoTextContainer}>
						<Text style={[styles.infoValue, { color: theme.colors.text }]}>
							{currentUser.email}
						</Text>
						<Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>Username</Text>
					</View>
				</View>

				{currentUser.about ? (
					<View style={[styles.infoRow, { borderBottomColor: theme.colors.border }]}>
						<Ionicons name="information-circle-outline" size={22} color={theme.colors.textSecondary} />
						<View style={styles.infoTextContainer}>
							<Text style={[styles.infoValue, { color: theme.colors.text }]}>{currentUser.about}</Text>
							<Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>Bio</Text>
						</View>
					</View>
				) : null}

				<View style={[styles.infoRow, { borderBottomColor: theme.colors.border }]}>
					<Ionicons name="notifications-outline" size={22} color={theme.colors.textSecondary} />
					<View style={styles.infoTextContainer}>
						<Text style={[styles.infoValue, { color: theme.colors.text }]}>Notifications</Text>
						<Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>Enabled</Text>
					</View>
				</View>
			</View>

			{/* Media tabs */}
			<View style={styles.mediaTabsContainer}>
				{["MEDIA", "DOCS", "LINKS", "AUDIO", "GIFS"].map((tab, i) => (
					<TouchableOpacity key={tab} style={[styles.mediaTab, i === 0 && styles.mediaTabActive]}>
						<Text style={[
							styles.mediaTabText,
							{ color: i === 0 ? theme.colors.text : theme.colors.textSecondary },
							i === 0 && { fontFamily: "bold" },
						]}>
							{tab}
						</Text>
					</TouchableOpacity>
				))}
			</View>

			{/* Empty media grid placeholder */}
			<View style={styles.mediaGrid}>
				<Text style={[styles.mediaEmpty, { color: theme.colors.textSecondary }]}>No media yet</Text>
			</View>

			{/* Common groups */}
			{commonChats.length > 0 && (
				<View style={[styles.commonSection, { backgroundColor: theme.colors.background }]}>
					<Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>
						{commonChats.length} {commonChats.length === 1 ? "Group" : "Groups"} in Common
					</Text>
					{commonChats.map((cid) => {
						const cd = storedChats[cid];
						return (
							<UserItem
								key={cid}
								title={cd.chatName!}
								subTitle={cd.latestMessageText}
								type="link"
								onPress={() => props.navigation.push("Chat", { chatId: cid })}
								image={cd.chatImage}
							/>
						);
					})}
				</View>
			)}

			{/* Remove from chat */}
			{chatData && chatData.isGroupChat && (
				<View style={styles.removeSection}>
					{isLoading ? (
						<ActivityIndicator size="small" color={theme.colors.primary} />
					) : (
						<SubmitButton title="Remove from chat" color={theme.colors.red} onPress={removeFromChat} />
					)}
				</View>
			)}
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: { flex: 1 },
	coverContainer: {
		height: 300,
		position: "relative",
	},
	coverImage: {
		width: "100%",
		height: "100%",
		resizeMode: "cover",
	},
	coverOverlay: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: "rgba(0,0,0,0.25)",
	},
	coverTextContainer: {
		position: "absolute",
		bottom: 20,
		left: 20,
	},
	coverName: {
		fontSize: 28,
		fontFamily: "bold",
		color: "#fff",
	},
	coverStatus: {
		fontSize: 14,
		fontFamily: "regular",
		marginTop: 2,
	},
	fabContainer: {
		alignItems: "flex-end",
		paddingRight: 20,
		marginTop: -22,
		zIndex: 10,
	},
	messageFab: {
		width: 44,
		height: 44,
		borderRadius: 22,
		alignItems: "center",
		justifyContent: "center",
		elevation: 4,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.2,
		shadowRadius: 4,
	},
	infoSection: {
		paddingHorizontal: 20,
		marginTop: 8,
	},
	infoRow: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 14,
		borderBottomWidth: 1,
		gap: 14,
	},
	infoTextContainer: { flex: 1 },
	infoValue: {
		fontSize: 16,
		fontFamily: "regular",
	},
	infoLabel: {
		fontSize: 13,
		fontFamily: "regular",
		marginTop: 2,
	},
	commonSection: {
		paddingHorizontal: 20,
		marginTop: 16,
	},
	sectionTitle: {
		fontSize: 14,
		fontFamily: "bold",
		letterSpacing: 0.3,
		marginBottom: 8,
		textTransform: "uppercase",
	},
	removeSection: {
		paddingHorizontal: 20,
		paddingVertical: 20,
	},
	mediaTabsContainer: {
		flexDirection: "row",
		paddingHorizontal: 20,
		marginTop: 16,
		gap: 20,
	},
	mediaTab: {
		paddingBottom: 8,
	},
	mediaTabActive: {
		borderBottomWidth: 2,
		borderBottomColor: "#000",
	},
	mediaTabText: {
		fontSize: 13,
		fontFamily: "medium",
		letterSpacing: 0.5,
	},
	mediaGrid: {
		paddingHorizontal: 20,
		paddingVertical: 30,
		alignItems: "center",
	},
	mediaEmpty: {
		fontSize: 14,
		fontFamily: "regular",
	},
});

export default ContactScreen;
