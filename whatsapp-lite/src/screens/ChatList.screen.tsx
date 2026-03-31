import React, { useLayoutEffect } from "react";
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import type { CompositeScreenProps } from "@react-navigation/native";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { StackScreenProps } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
import { LoggedInStackParamList, LoggedInTabParamList } from "../navigation/types";
import { useAppSelector } from "../utils/store";
import UserImage from "../components/UserImage";
import { useTheme } from "../constants";

type Props = CompositeScreenProps<BottomTabScreenProps<LoggedInTabParamList, "ChatList">, StackScreenProps<LoggedInStackParamList>>;

const ChatListScreen = (props: Props) => {
	const { theme } = useTheme();
	const userData = useAppSelector((state) => state.auth.userData)!;
	const storedUsers = useAppSelector((state) => state.storedUsers.storedUsers);

	const userChats = useAppSelector((state) => {
		const chatsData = state.chats.chatsData;
		return Object.values(chatsData).sort((a, b) => {
			return new Date(b.updatedAt).valueOf() - new Date(a.updatedAt).valueOf();
		});
	});

	useLayoutEffect(() => {
		props.navigation.setOptions({
			headerLeft: () => (
				<TouchableOpacity style={{ marginLeft: 16 }}>
					<Text style={[styles.editText, { color: theme.colors.primary }]}>Edit</Text>
				</TouchableOpacity>
			),
			headerRight: () => (
				<TouchableOpacity
					style={[styles.newButton, { backgroundColor: theme.colors.primary }]}
					onPress={() => props.navigation.navigate("NewChat", { isGroupChat: false })}
				>
					<Ionicons name="add" size={18} color="#fff" />
					<Text style={styles.newButtonText}>New</Text>
				</TouchableOpacity>
			),
			headerStyle: { backgroundColor: theme.colors.background, elevation: 0, shadowOpacity: 0 },
		});
	}, [theme]);

	const formatTime = (dateStr: string) => {
		if (!dateStr) return "";
		const date = new Date(dateStr);
		const now = new Date();
		const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

		if (diffDays === 0) {
			return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
		} else if (diffDays === 1) {
			return "Yesterday";
		} else if (diffDays < 7) {
			return date.toLocaleDateString([], { weekday: "long" });
		}
		return date.toLocaleDateString([], { weekday: "long" });
	};

	return (
		<View style={[styles.container, { backgroundColor: theme.colors.background }]}>
			{/* Search Bar */}
			<View style={[styles.searchContainer, { backgroundColor: theme.colors.searchBg }]}>
				<Ionicons name="search" size={18} color={theme.colors.textSecondary} />
				<TextInput
					style={[styles.searchInput, { color: theme.colors.text }]}
					placeholder="Search"
					placeholderTextColor={theme.colors.textSecondary}
				/>
				<Ionicons name="mic-outline" size={18} color={theme.colors.textSecondary} />
			</View>

			{/* Chat List */}
			<FlatList
				data={userChats}
				keyExtractor={(item) => item.chatId}
				contentContainerStyle={{ paddingBottom: 80 }}
				renderItem={({ item: chatData }) => {
					const chatId = chatData.chatId;
					const isGroupChat = chatData.isGroupChat;

					let title = "";
					let subTitle = chatData.latestMessageText || "New chat";
					let image: string | undefined = "";

					if (isGroupChat) {
						title = chatData.chatName!;
						image = chatData.chatImage;
					} else {
						const otherUserId = chatData.users.find((uid) => uid !== userData.userId);
						if (otherUserId) {
							const otherUser = storedUsers[otherUserId];
							if (otherUser) {
								title = `${otherUser.firstName} ${otherUser.lastName}`;
								image = otherUser.profilePicture;
							}
						}
					}

					const timeText = formatTime(chatData.updatedAt);

					return (
						<TouchableOpacity
							style={styles.chatItem}
							onPress={() => props.navigation.navigate("Chat", { chatId })}
							activeOpacity={0.6}
						>
							<UserImage uri={image} size={50} />

							<View style={styles.chatContent}>
								<View style={styles.chatTopRow}>
									<Text style={[styles.chatName, { color: theme.colors.text }]} numberOfLines={1}>
										{title}
									</Text>
									<Text style={[styles.chatTime, { color: theme.colors.textSecondary }]}>
										{timeText}
									</Text>
								</View>
								<View style={styles.chatBottomRow}>
									<Text style={[styles.chatMessage, { color: theme.colors.textSecondary }]} numberOfLines={1}>
										{subTitle}
									</Text>
								</View>
							</View>
						</TouchableOpacity>
					);
				}}
				ListEmptyComponent={
					<View style={styles.emptyContainer}>
						<Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
							No conversations yet. Tap + New to start chatting!
						</Text>
					</View>
				}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	editText: {
		fontSize: 17,
		fontFamily: "regular",
	},
	newButton: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: 14,
		paddingVertical: 7,
		borderRadius: 20,
		marginRight: 16,
		gap: 4,
	},
	newButtonText: {
		color: "#fff",
		fontSize: 15,
		fontFamily: "medium",
	},
	searchContainer: {
		flexDirection: "row",
		alignItems: "center",
		marginHorizontal: 16,
		marginBottom: 8,
		paddingHorizontal: 12,
		paddingVertical: 10,
		borderRadius: 12,
		gap: 8,
	},
	searchInput: {
		flex: 1,
		fontSize: 16,
		fontFamily: "regular",
		padding: 0,
	},
	chatItem: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: 16,
		paddingVertical: 10,
	},
	chatContent: {
		flex: 1,
		marginLeft: 12,
	},
	chatTopRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 3,
	},
	chatName: {
		fontSize: 16,
		fontFamily: "medium",
		flex: 1,
		marginRight: 8,
	},
	chatTime: {
		fontSize: 13,
		fontFamily: "regular",
	},
	chatBottomRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	chatMessage: {
		fontSize: 14,
		fontFamily: "regular",
		flex: 1,
	},
	emptyContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		paddingTop: 100,
		paddingHorizontal: 40,
	},
	emptyText: {
		fontSize: 15,
		fontFamily: "regular",
		textAlign: "center",
	},
});

export default ChatListScreen;
