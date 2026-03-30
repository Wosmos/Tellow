import { supabase } from "../supabase";
import { Message, UserData } from "../store/types";
import { ChatData as ChatDataType } from "../store/types";
import { getUserPushTokens } from "./authActions";

type ChatData = {
	users: string[];
	isGroupChat: boolean;
	chatName?: string;
	chatImage?: string;
};

export const createChat = async (loggedInUserId: string, chatData: ChatData) => {
	try {
		const { data: newChat, error: chatError } = await supabase
			.from("chats")
			.insert({
				is_group_chat: chatData.isGroupChat,
				chat_name: chatData.chatName || "",
				chat_image: chatData.chatImage || "",
				created_by: loggedInUserId,
				updated_by: loggedInUserId,
			})
			.select("chat_id")
			.single();

		if (chatError) throw chatError;

		const chatId = newChat.chat_id;

		// Add all users to chat_users
		const chatUsers = chatData.users.map((userId) => ({
			chat_id: chatId,
			user_id: userId,
		}));

		await supabase.from("chat_users").insert(chatUsers);

		return chatId;
	} catch (err) {
		throw new Error("Something went wrong while creating a new chat. Please try again later.");
	}
};

type UpdateChatParams = {
	chatId: string;
	userId: string;
	chatData: Partial<ChatData>;
};

export const updateChatData = async (data: UpdateChatParams) => {
	const { chatId, userId, chatData } = data;

	const updateData: any = {
		updated_at: new Date().toISOString(),
		updated_by: userId,
	};

	if (chatData.chatName !== undefined) updateData.chat_name = chatData.chatName;
	if (chatData.chatImage !== undefined) updateData.chat_image = chatData.chatImage;
	if (chatData.users !== undefined) {
		// Update chat_users table: remove all and re-insert
		await supabase.from("chat_users").delete().eq("chat_id", chatId);
		const chatUsers = chatData.users.map((uid) => ({
			chat_id: chatId,
			user_id: uid,
		}));
		await supabase.from("chat_users").insert(chatUsers);
	}

	await supabase.from("chats").update(updateData).eq("chat_id", chatId);
};

type SendMessageParams = {
	chatId: string;
	senderId: string;
	messageText: string;
	imageUrl?: string;
	replyTo?: string;
	type?: string;
};

const sendMessage = async (data: SendMessageParams) => {
	const { chatId, senderId, messageText, imageUrl, replyTo, type } = data;

	const messageData: any = {
		chat_id: chatId,
		sent_by: senderId,
		text: messageText,
	};

	if (replyTo) messageData.reply_to = replyTo;
	if (imageUrl) messageData.image_url = imageUrl;
	if (type) messageData.type = type;

	await supabase.from("messages").insert(messageData);

	await supabase
		.from("chats")
		.update({
			updated_by: senderId,
			updated_at: new Date().toISOString(),
			latest_message_text: messageText,
		})
		.eq("chat_id", chatId);
};

type sendTextMessageParams = Omit<SendMessageParams, "imageUrl" | "senderId"> & {
	senderUserData: UserData;
	usersInChat: string[];
};

export const sendTextMessage = async (data: sendTextMessageParams) => {
	await sendMessage({
		...data,
		senderId: data.senderUserData.userId,
	});

	const otherUsers = data.usersInChat.filter((uid) => uid !== data.senderUserData.userId);
	await sendPushNotificationToUsers({
		chatUsers: otherUsers,
		title: `${data.senderUserData.firstName} ${data.senderUserData.lastName}`,
		body: data.messageText,
		chatId: data.chatId,
	});
};

type SendImageParams = Omit<SendMessageParams, "messageText" | "senderId"> & {
	senderUserData: UserData;
	usersInChat: string[];
};

export const sendImage = async (data: SendImageParams) => {
	await sendMessage({
		...data,
		messageText: "Image",
		senderId: data.senderUserData.userId,
	});

	const otherUsers = data.usersInChat.filter((uid) => uid !== data.senderUserData.userId);
	await sendPushNotificationToUsers({
		chatUsers: otherUsers,
		title: `${data.senderUserData.firstName} ${data.senderUserData.lastName}`,
		body: `${data.senderUserData.firstName} sent an image`,
		chatId: data.chatId,
	});
};

export const sendInfoMessage = async (data: Omit<SendMessageParams, "type" | "imageUrl" | "replyTo">) => {
	await sendMessage({
		...data,
		type: "info",
	});
};

export const deleteMessage = async (data: { chatId: string; messageId: string; userId: string }) => {
	const { chatId, messageId, userId } = data;

	await supabase
		.from("messages")
		.update({
			updated_at: new Date().toISOString(),
			type: "deleted",
			text: "Message deleted",
		})
		.eq("message_id", messageId);

	await supabase
		.from("chats")
		.update({
			updated_by: userId,
			updated_at: new Date().toISOString(),
		})
		.eq("chat_id", chatId);
};

export const editChatMessage = async (data: { chatId: string; messageId: string; text: string; userId: string }) => {
	const { chatId, messageId, text, userId } = data;

	await supabase
		.from("messages")
		.update({
			updated_at: new Date().toISOString(),
			type: "edited",
			text,
		})
		.eq("message_id", messageId);

	await supabase
		.from("chats")
		.update({
			updated_by: userId,
			updated_at: new Date().toISOString(),
		})
		.eq("chat_id", chatId);
};

export const addUserChat = async (data: { userId: string; chatId: string }) => {
	const { userId, chatId } = data;
	try {
		await supabase.from("chat_users").insert({
			chat_id: chatId,
			user_id: userId,
		});
	} catch (error) {
		console.log(error);
		throw error;
	}
};

type addUsersToChatParams = {
	userLoggedInData: UserData;
	usersToAddData: UserData[];
	chatData: ChatDataType;
};

export const addUsersToChat = async (data: addUsersToChatParams) => {
	const { userLoggedInData, usersToAddData, chatData } = data;

	const existingUsers = Object.values(chatData.users);
	const newUsers: string[] = [];
	let userAddedName = "";

	usersToAddData.forEach(async (userToAdd) => {
		const userIdToAdd = userToAdd.userId;
		if (existingUsers.includes(userIdToAdd)) return;

		newUsers.push(userIdToAdd);
		await addUserChat({ userId: userIdToAdd, chatId: chatData.key });
		userAddedName = `${userToAdd.firstName} ${userToAdd.lastName}`;
	});

	if (newUsers.length === 0) return;

	await updateChatData({
		chatId: chatData.key,
		userId: userLoggedInData.userId,
		chatData: {
			users: existingUsers.concat(newUsers),
		},
	});

	const moreUsersMessage = newUsers.length > 1 ? `and ${newUsers.length - 1} others ` : "";
	const messageText = `${userLoggedInData.firstName} ${userLoggedInData.lastName} added ${userAddedName} ${moreUsersMessage}to the chat`;
	await sendInfoMessage({
		chatId: chatData.key,
		senderId: userLoggedInData.userId,
		messageText,
	});
};

export const getUserChats = async (userId: string) => {
	try {
		const { data, error } = await supabase
			.from("chat_users")
			.select("chat_id")
			.eq("user_id", userId);

		if (error) throw error;

		const result: Record<string, string> = {};
		data?.forEach((row, i) => {
			result[i.toString()] = row.chat_id;
		});
		return result;
	} catch (error) {
		console.log(error);
	}
};

export const deleteUserChat = async (data: { userId: string; key: string }) => {
	const { userId, key } = data;
	try {
		await supabase
			.from("chat_users")
			.delete()
			.eq("user_id", userId)
			.eq("chat_id", key);
	} catch (error) {
		console.log(error);
		throw error;
	}
};

type RemoveUserFromChatParams = {
	userLoggedInData: UserData;
	userToRemoveData: UserData;
	chatData: ChatDataType;
};

export const removeUserFromChat = async (data: RemoveUserFromChatParams) => {
	const { userLoggedInData, userToRemoveData, chatData } = data;

	const userToRemoveId = userToRemoveData.userId;
	const newUsers = chatData.users.filter((uid) => uid !== userToRemoveId);

	await updateChatData({
		chatId: chatData.key,
		userId: userLoggedInData.userId,
		chatData: { users: newUsers },
	});

	await supabase
		.from("chat_users")
		.delete()
		.eq("user_id", userToRemoveId)
		.eq("chat_id", chatData.key);

	const messageText =
		userLoggedInData.userId === userToRemoveData.userId
			? `${userLoggedInData.firstName} left the chat`
			: `${userLoggedInData.firstName} removed ${userToRemoveData.firstName} from the chat`;

	await sendInfoMessage({
		chatId: chatData.key,
		senderId: userLoggedInData.userId,
		messageText,
	});
};

type MarkMessageAsSeenParams = {
	chatId: string;
	messageId: string;
	seenBy: string;
};

export const markMessageAsSeen = async (data: MarkMessageAsSeenParams) => {
	try {
		const { messageId, seenBy } = data;

		await supabase.from("message_seen").insert({
			message_id: messageId,
			seen_by: seenBy,
		});
	} catch (err) {
		console.log(err);
	}
};

type SendPushNotificationToUsersParams = {
	chatUsers: string[];
	title: string;
	body: string;
	chatId: string;
};

const sendPushNotificationToUsers = (data: SendPushNotificationToUsersParams) => {
	const { chatUsers, title, body, chatId } = data;
	chatUsers.forEach(async (uid) => {
		const tokens = await getUserPushTokens(uid);

		for (const key in tokens) {
			const token = tokens[key];

			await fetch("https://exp.host/--/api/v2/push/send", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					to: token,
					title,
					body,
					data: { chatId },
				}),
			});
		}
	});
};
