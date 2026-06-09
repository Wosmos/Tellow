import React, { useCallback, useEffect, useState, useRef } from "react";
import {
	ActivityIndicator,
	FlatList,
	Image,
	Keyboard,
	KeyboardAvoidingView,
	Platform,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import { Ionicons, Feather, AntDesign } from "@expo/vector-icons";
import type { StackScreenProps } from "@react-navigation/stack";
import { LoggedInStackParamList } from "../navigation/types";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../constants";
import { useAppSelector } from "../utils/store";
import { selectChatMessages } from "../utils/store/selectors";
import { createChat, editChatMessage, sendImage, sendTextMessage } from "../utils/actions/chatActions";
import { Message } from "../utils/store/types";
import ChatMessage from "../components/ChatMessage";
import Bubble from "../components/Bubble";
import ReplyingTo from "../components/ReplyingTo";
import { launchImagePicker, openCamera, uploadImageAsync } from "../utils/imagePickerHelper";
import AwesomeAlert from "../components/alerts";
import { formatAmPm } from "../utils/helperFns";
import UserImage from "../components/UserImage";

type Props = StackScreenProps<LoggedInStackParamList, "Chat">;

const ChatScreen = (props: Props) => {
	const { theme } = useTheme();
	const { selectedUserId, chatId, selectedUserIds, chatName, isGroupChat } = props.route.params;
	const [messageText, setMessageText] = useState("");
	const [currentChatId, setCurrentChatId] = useState(chatId || null);
	const [replyingTo, setReplyingTo] = useState<Message | null>(null);
	const [tempImageUri, setTempImageUri] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [editMessage, setEditMessage] = useState<Message | null>(null);

	const flatListRef = useRef<FlatList<Message>>();
	const messageInputRef = useRef<TextInput>(null);

	const userData = useAppSelector((state) => state.auth.userData)!;
	const storedUsers = useAppSelector((state) => state.storedUsers.storedUsers);
	const storedChats = useAppSelector((state) => state.chats.chatsData);

	const chatMessages = useAppSelector((state) => selectChatMessages(state, currentChatId));

	const chatData = (currentChatId && storedChats[currentChatId]) || props.route?.params || {};

	const getChatTitle = () => {
		if (currentChatId) {
			const cd = storedChats[currentChatId];
			if (cd.isGroupChat) return cd.chatName;
			const otherUserId = cd.users.find((uid) => uid !== userData.userId)!;
			const otherUser = storedUsers[otherUserId];
			return otherUser && `${otherUser.firstName} ${otherUser.lastName}`;
		}
		if (selectedUserId) {
			const otherUser = storedUsers[selectedUserId];
			return otherUser && `${otherUser.firstName} ${otherUser.lastName}`;
		}
		return chatName;
	};

	const getOtherUserImage = () => {
		if (currentChatId) {
			const cd = storedChats[currentChatId];
			if (cd.isGroupChat) return cd.chatImage;
			const otherUserId = cd.users.find((uid) => uid !== userData.userId)!;
			return storedUsers[otherUserId]?.profilePicture;
		}
		if (selectedUserId) return storedUsers[selectedUserId]?.profilePicture;
		return undefined;
	};

	useEffect(() => {
		const title = getChatTitle();
		const image = getOtherUserImage();

		props.navigation.setOptions({
			headerTitle: () => (
				<View style={styles.headerTitleContainer}>
					<UserImage uri={image} size={34} />
					<View>
						<Text style={[styles.headerName, { color: theme.colors.headerText }]}>{title}</Text>
						<Text style={[styles.headerStatus, { color: theme.colors.online }]}>online</Text>
					</View>
				</View>
			),
			headerStyle: {
				backgroundColor: theme.colors.headerBg,
				elevation: 0,
				shadowOpacity: 0,
			},
			headerRight: () =>
				currentChatId ? (
					<TouchableOpacity
						style={{ marginRight: 16 }}
						onPress={() => {
							const cd = storedChats[currentChatId];
							if (cd.isGroupChat) {
								props.navigation.navigate("ChatSettings", { chatId: currentChatId });
							} else {
								const otherUid = cd.users.find((uid) => uid !== userData.userId)!;
								props.navigation.navigate("Contact", { userId: otherUid });
							}
						}}
					>
						<Ionicons name="ellipsis-vertical" size={22} color={theme.colors.headerText} />
					</TouchableOpacity>
				) : null,
		});
	}, [currentChatId, theme]);

	const sendMessage = useCallback(async () => {
		try {
			let id = currentChatId;
			let usersInChat: string[] = [];

			if (!id) {
				const newChatData: any = { isGroupChat };
				if (selectedUserId) {
					newChatData.users = [userData.userId, selectedUserId];
					usersInChat = [userData.userId, selectedUserId];
				}
				if (selectedUserIds) {
					newChatData.users = [userData.userId, ...selectedUserIds];
					newChatData.chatName = chatName;
					usersInChat = [userData.userId, ...selectedUserIds];
				}
				const newChatId = await createChat(userData.userId, newChatData);
				id = newChatId;
				setCurrentChatId(newChatId);
			} else {
				usersInChat = storedChats[id].users;
			}

			await sendTextMessage({
				chatId: id!,
				messageText,
				replyTo: replyingTo?.messageId,
				senderUserData: userData,
				usersInChat,
			});

			setMessageText("");
			setReplyingTo(null);
		} catch (err) {
			console.log(err);
		}
	}, [chatId, messageText, selectedUserId, userData.userId, selectedUserIds, chatName, isGroupChat]);

	const scrollToMessage = (message: Message) => {
		const index = chatMessages.findIndex((msg) => msg.messageId === message.messageId);
		flatListRef.current?.scrollToIndex({ index, animated: true });
	};

	const pickImage = useCallback(async () => {
		try {
			const tempUri = await launchImagePicker();
			if (!tempUri) return;
			setTempImageUri(tempUri);
		} catch (error) {
			console.log(error);
		}
	}, [tempImageUri]);

	const takePhoto = useCallback(async () => {
		try {
			const tempUri = await openCamera();
			if (!tempUri) return;
			setTempImageUri(tempUri);
		} catch (error) {
			console.log(error);
		}
	}, [tempImageUri]);

	const uploadImage = useCallback(async () => {
		setIsLoading(true);
		try {
			let id = currentChatId;
			let usersInChat: string[] = [];
			if (!id) {
				const newChatData: any = { isGroupChat };
				if (selectedUserId) {
					newChatData.users = [userData.userId, selectedUserId];
					usersInChat = [userData.userId, selectedUserId];
				}
				if (selectedUserIds) {
					newChatData.users = [userData.userId, ...selectedUserIds];
					newChatData.chatName = chatName;
					usersInChat = [userData.userId, ...selectedUserIds];
				}
				const newChatId = await createChat(userData.userId, newChatData);
				id = newChatId;
				setCurrentChatId(newChatId);
			} else {
				usersInChat = storedChats[id].users;
			}

			if (tempImageUri) {
				const uploadUrl = await uploadImageAsync(tempImageUri, true);
				setIsLoading(false);
				await sendImage({
					chatId: id!,
					senderUserData: userData,
					replyTo: replyingTo?.messageId,
					imageUrl: uploadUrl,
					usersInChat,
				});
				setReplyingTo(null);
				setTimeout(() => setTempImageUri(null), 500);
			}
		} catch (error) {
			console.log(error);
		}
	}, [isLoading, tempImageUri, chatId]);

	const handleSetEditMessage = (message: Message) => {
		setEditMessage(message);
		setMessageText(message.text);
		messageInputRef.current?.focus();
	};

	const editChatMessageHandler = async () => {
		if (editMessage) {
			await editChatMessage({
				userId: userData.userId,
				chatId: currentChatId!,
				messageId: editMessage.messageId,
				text: messageText,
			});
			setEditMessage(null);
			setMessageText("");
		}
	};

	return (
		<SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={["bottom", "left", "right"]}>
			<KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.screen} keyboardVerticalOffset={100}>
				<View style={[styles.messagesArea, { backgroundColor: theme.colors.background }]}>
					{chatId ? (
						<FlatList
							ref={(ref) => { flatListRef.current = ref!; }}
							onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
							onLayout={() => flatListRef.current?.scrollToEnd({ animated: false })}
							data={chatMessages}
							contentContainerStyle={styles.messagesList}
							renderItem={({ item: message }) => {
								const isOwnMessage = message.sentBy === userData.userId;
								let messageType: "info" | "myMessage" | "theirMessage" = "info";
								if (message.type === "info") messageType = "info";
								else if (isOwnMessage) messageType = "myMessage";
								else messageType = "theirMessage";

								const sender = message.sentBy && storedUsers[message.sentBy];
								const senderName = sender && `${sender.firstName} ${sender.lastName}`;
								const replyToMessage = message.replyTo
									? chatMessages.find((msg) => msg.messageId === message.replyTo)
									: undefined;
								const replyingToUser = replyToMessage && storedUsers[replyToMessage.sentBy];
								const replyToUserName = replyingToUser &&
									(replyingToUser.userId === userData.userId
										? "You"
										: `${replyingToUser.firstName} ${replyingToUser.lastName}`);

								const totalSeens = Object.values(message.seen || {});

								return (
									<ChatMessage
										type={messageType}
										text={message.text}
										messageId={message.messageId}
										userId={userData.userId}
										chatId={chatId}
										senderId={message.sentBy}
										sentBy={message.sentBy}
										date={message.sentAt}
										name={!chatData.isGroupChat || isOwnMessage ? undefined : senderName}
										imageUrl={message.imageUrl}
										deleted={message.type === "deleted"}
										edited={message.type === "edited"}
										setReplyingTo={() => setReplyingTo(message)}
										setEditMessage={() => handleSetEditMessage(message)}
										replyTo={replyToMessage}
										replyToUser={replyToUserName}
										scrollToRepliedMessage={() => {
											if (replyToMessage) scrollToMessage(replyToMessage);
										}}
										totalSeens={totalSeens}
										isGroupChat={!!chatData.isGroupChat}
									/>
								);
							}}
						/>
					) : (
						<View style={styles.messagesList}>
							<Bubble text="This is a new chat. Say hi!" type="system" />
						</View>
					)}

					{replyingTo && (
						<ReplyingTo
							text={replyingTo.text}
							user={storedUsers[replyingTo.sentBy]}
							onCancel={() => setReplyingTo(null)}
							loggedInUser={userData}
						/>
					)}
				</View>

				{/* Input bar */}
				<View style={[styles.inputContainer, { backgroundColor: theme.colors.background, borderTopColor: theme.colors.border }]}>
					{editMessage ? (
						<TouchableOpacity
							style={styles.inputIcon}
							onPress={() => { setEditMessage(null); setMessageText(""); }}
						>
							<AntDesign name="closecircleo" size={22} color={theme.colors.primary} />
						</TouchableOpacity>
					) : (
						<TouchableOpacity style={styles.inputIcon} onPress={pickImage}>
							<Ionicons name="happy-outline" size={24} color={theme.colors.textSecondary} />
						</TouchableOpacity>
					)}

					<TextInput
						placeholder="Message..."
						placeholderTextColor={theme.colors.textSecondary}
						style={[styles.input, { backgroundColor: theme.colors.inputBg, color: theme.colors.text }]}
						onChangeText={setMessageText}
						value={messageText}
						onSubmitEditing={editMessage ? editChatMessageHandler : sendMessage}
						ref={messageInputRef}
					/>

					{editMessage ? (
						<TouchableOpacity style={styles.sendButton} onPress={editChatMessageHandler}>
							<View style={[styles.sendCircle, { backgroundColor: theme.colors.primary }]}>
								<Ionicons name="checkmark" size={20} color="#fff" />
							</View>
						</TouchableOpacity>
					) : messageText.length > 0 ? (
						<TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
							<View style={[styles.sendCircle, { backgroundColor: theme.colors.primary }]}>
								<Ionicons name="send" size={18} color="#fff" style={{ marginLeft: 2 }} />
							</View>
						</TouchableOpacity>
					) : (
						<TouchableOpacity style={styles.inputIcon} onPress={takePhoto}>
							<Ionicons name="camera-outline" size={24} color={theme.colors.textSecondary} />
						</TouchableOpacity>
					)}
				</View>
			</KeyboardAvoidingView>

			<AwesomeAlert
				show={!!tempImageUri}
				title="Send image?"
				closeOnTouchOutside={true}
				closeOnHardwareBackPress={true}
				showCancelButton={true}
				showConfirmButton={true}
				cancelText="Cancel"
				confirmText="Send"
				confirmButtonColor={theme.colors.primary}
				cancelButtonColor={theme.colors.red}
				titleStyle={[styles.popupTitle, { color: theme.colors.text }]}
				onCancelPressed={() => setTempImageUri(null)}
				onConfirmPressed={uploadImage}
				onDismiss={() => setTempImageUri(null)}
				customView={
					<View>
						{isLoading && <ActivityIndicator size="small" color={theme.colors.primary} />}
						{!isLoading && tempImageUri && <Image source={{ uri: tempImageUri }} style={{ width: 200, height: 200, borderRadius: 12 }} />}
					</View>
				}
			/>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	screen: { flex: 1 },
	container: { flex: 1, flexDirection: "column" },
	messagesArea: { flex: 1 },
	messagesList: { paddingHorizontal: 16, paddingTop: 8 },
	headerTitleContainer: {
		flexDirection: "row",
		alignItems: "center",
		gap: 10,
	},
	headerName: {
		fontFamily: "medium",
		fontSize: 16,
	},
	headerStatus: {
		fontFamily: "regular",
		fontSize: 12,
	},
	inputContainer: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: 12,
		paddingVertical: 8,
		borderTopWidth: 1,
	},
	inputIcon: {
		padding: 6,
	},
	input: {
		flex: 1,
		marginHorizontal: 8,
		paddingHorizontal: 16,
		paddingVertical: 10,
		borderRadius: 24,
		fontSize: 16,
		fontFamily: "regular",
	},
	sendButton: {
		padding: 4,
	},
	sendCircle: {
		width: 36,
		height: 36,
		borderRadius: 18,
		alignItems: "center",
		justifyContent: "center",
	},
	popupTitle: {
		fontFamily: "medium",
		letterSpacing: 0.3,
	},
});

export default ChatScreen;
