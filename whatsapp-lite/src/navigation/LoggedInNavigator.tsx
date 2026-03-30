import React, { useEffect, useRef, useState } from "react";
import * as Notifications from "expo-notifications";
import { useNavigation } from "@react-navigation/native";
import { StackNavigator } from "./LoggedInScreens";
import { useAppDispatch, useAppSelector } from "../utils/store";
import { supabase } from "../utils/supabase";
import { ChatData, Status, UserData } from "../utils/store/types";
import { setStoredUsers } from "../utils/store/usersSlice";
import { setChatsData } from "../utils/store/chatsSlice";
import { setChatMessages } from "../utils/store/chatMessagesSlice";
import { ActivityIndicator, View } from "react-native";
import { colors, commonStyles } from "../constants";
import { registerForPushNotificationsAsync } from "../utils/notifications";
import { setContactStatuses, setMyStatuses } from "../utils/store/statusSlice";
import { StackScreenProps } from "@react-navigation/stack";
import { LoggedInStackParamList } from "./types";
import { RealtimeChannel } from "@supabase/supabase-js";

type NavigationProps = StackScreenProps<LoggedInStackParamList, "Chat">["navigation"];

const LoggedInNavigator = () => {
	const [isLoading, setIsLoading] = useState(true);
	const userData = useAppSelector((state) => state.auth.userData)!;
	const storedUsers = useAppSelector((state) => state.storedUsers.storedUsers);

	const dispatch = useAppDispatch();

	const notificationListener = useRef<Notifications.Subscription>();
	const responseListener = useRef<Notifications.Subscription>();

	const navigation = useNavigation<NavigationProps>();

	useEffect(() => {
		registerForPushNotificationsAsync().then(() => {});

		notificationListener.current = Notifications.addNotificationReceivedListener(() => {});

		responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
			const { data } = response.notification.request.content;
			const chatId = data["chatId"];

			if (chatId) {
				navigation.navigate("Chat", { chatId });
			} else {
				console.log("No chat id sent with notification");
			}
		});

		return () => {
			if (notificationListener.current) {
				Notifications.removeNotificationSubscription(notificationListener.current);
			}
			if (responseListener.current) {
				Notifications.removeNotificationSubscription(responseListener.current);
			}
		};
	}, []);

	useEffect(() => {
		console.log("Subscribing to Supabase listeners");

		const channels: RealtimeChannel[] = [];

		const loadInitialData = async () => {
			try {
				// Get all chat IDs for this user
				const { data: chatUserRows } = await supabase
					.from("chat_users")
					.select("chat_id")
					.eq("user_id", userData.userId);

				const chatIds = chatUserRows?.map((r) => r.chat_id) || [];

				if (chatIds.length === 0) {
					setIsLoading(false);
					return;
				}

				// Fetch all chats
				const { data: chatsRows } = await supabase
					.from("chats")
					.select("*")
					.in("chat_id", chatIds);

				const chatsData: Record<string, ChatData> = {};

				for (const chat of chatsRows || []) {
					// Get users for this chat
					const { data: chatMembers } = await supabase
						.from("chat_users")
						.select("user_id")
						.eq("chat_id", chat.chat_id);

					const userIds = chatMembers?.map((m) => m.user_id) || [];

					// Fetch user data for unknown users
					for (const uid of userIds) {
						if (!storedUsers[uid]) {
							const { data: userRow } = await supabase
								.from("users")
								.select("*")
								.eq("user_id", uid)
								.single();

							if (userRow) {
								dispatch(
									setStoredUsers({
										newUsers: {
											[userRow.user_id]: {
												userId: userRow.user_id,
												firstName: userRow.first_name,
												lastName: userRow.last_name,
												firstLast: userRow.first_last,
												email: userRow.email,
												about: userRow.about || "",
												profilePicture: userRow.profile_picture || "",
												signUpDate: userRow.sign_up_date,
											},
										},
									})
								);
							}
						}
					}

					const chatData: any = {
						key: chat.chat_id,
						chatId: chat.chat_id,
						users: userIds,
						isGroupChat: chat.is_group_chat,
						chatName: chat.chat_name || "",
						chatImage: chat.chat_image || "",
						createdBy: chat.created_by,
						updatedBy: chat.updated_by,
						createdAt: chat.created_at,
						updatedAt: chat.updated_at,
						latestMessageText: chat.latest_message_text || "",
					};

					chatsData[chat.chat_id] = chatData;

					// Load statuses for direct chat contacts
					if (!chat.is_group_chat) {
						const otherUserId = userIds.find((uid: string) => uid !== userData.userId);
						if (otherUserId) {
							await loadContactStatuses(otherUserId);
						}
					}
				}

				dispatch(setChatsData({ chatsData }));

				// Load messages for all chats
				for (const chatId of chatIds) {
					await loadMessages(chatId);
				}

				// Load own statuses
				await loadMyStatuses();

				setIsLoading(false);
			} catch (error) {
				console.log("Error loading initial data:", error);
				setIsLoading(false);
			}
		};

		const loadMessages = async (chatId: string) => {
			const { data: messagesRows } = await supabase
				.from("messages")
				.select("*, message_seen(*)")
				.eq("chat_id", chatId)
				.order("sent_at", { ascending: true });

			const messagesData: Record<string, any> = {};
			messagesRows?.forEach((msg) => {
				const seen: Record<string, any> = {};
				msg.message_seen?.forEach((s: any, i: number) => {
					seen[i.toString()] = {
						seenBy: s.seen_by,
						seenAt: s.seen_at,
					};
				});

				messagesData[msg.message_id] = {
					sentBy: msg.sent_by,
					sentAt: msg.sent_at,
					text: msg.text,
					imageUrl: msg.image_url || "",
					replyTo: msg.reply_to || "",
					type: msg.type || "text",
					updatedAt: msg.updated_at || "",
					seen,
				};
			});

			dispatch(setChatMessages({ chatId, messagesData }));
		};

		const loadContactStatuses = async (userId: string) => {
			const { data: statusRows } = await supabase
				.from("user_statuses")
				.select("*, status_views(*)")
				.eq("user_id", userId)
				.order("created_at", { ascending: true });

			const userStatuses: Status[] = [];
			statusRows?.forEach((row) => {
				const views: Record<string, any> = {};
				row.status_views?.forEach((view: any, i: number) => {
					views[i.toString()] = {
						viewerId: view.viewer_id,
						viewedAt: view.viewed_at,
					};
				});

				userStatuses.push({
					statusId: row.status_id,
					imageUrl: row.image_url,
					createdAt: row.created_at,
					views,
				} as Status);
			});

			dispatch(setContactStatuses({ statuses: userStatuses, userId }));
		};

		const loadMyStatuses = async () => {
			const { data: statusRows } = await supabase
				.from("user_statuses")
				.select("*, status_views(*)")
				.eq("user_id", userData.userId)
				.order("created_at", { ascending: true });

			const myStatuses: Status[] = [];
			statusRows?.forEach((row) => {
				const views: Record<string, any> = {};
				row.status_views?.forEach((view: any, i: number) => {
					views[i.toString()] = {
						viewerId: view.viewer_id,
						viewedAt: view.viewed_at,
					};
				});

				myStatuses.push({
					statusId: row.status_id,
					imageUrl: row.image_url,
					createdAt: row.created_at,
					views,
				} as Status);
			});

			dispatch(setMyStatuses({ statuses: myStatuses }));
		};

		// Set up realtime subscriptions
		const messagesChannel = supabase
			.channel("messages-changes")
			.on("postgres_changes", { event: "*", schema: "public", table: "messages" }, (payload) => {
				const chatId = (payload.new as any)?.chat_id;
				if (chatId) loadMessages(chatId);
			})
			.subscribe();
		channels.push(messagesChannel);

		const chatsChannel = supabase
			.channel("chats-changes")
			.on("postgres_changes", { event: "*", schema: "public", table: "chats" }, () => {
				loadInitialData();
			})
			.subscribe();
		channels.push(chatsChannel);

		const chatUsersChannel = supabase
			.channel("chat-users-changes")
			.on("postgres_changes", { event: "*", schema: "public", table: "chat_users" }, () => {
				loadInitialData();
			})
			.subscribe();
		channels.push(chatUsersChannel);

		const statusesChannel = supabase
			.channel("statuses-changes")
			.on("postgres_changes", { event: "*", schema: "public", table: "user_statuses" }, () => {
				loadMyStatuses();
			})
			.subscribe();
		channels.push(statusesChannel);

		loadInitialData();

		return () => {
			console.log("Unsubscribing Supabase listeners");
			channels.forEach((ch) => supabase.removeChannel(ch));
		};
	}, []);

	return (
		<>
			{isLoading ? (
				<View style={commonStyles.center}>
					<ActivityIndicator size={"large"} color={colors.primary} />
				</View>
			) : (
				<StackNavigator />
			)}
		</>
	);
};

export default LoggedInNavigator;
