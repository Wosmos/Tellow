import React, { useEffect, useRef } from "react";
import { Image, StyleSheet, Text, TextStyle, TouchableWithoutFeedback, View, ViewStyle } from "react-native";
import { Feather, Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { Menu, MenuTrigger, MenuOptions, MenuOption } from "react-native-popup-menu";
import * as Clipboard from "expo-clipboard";
import { useTheme } from "../constants";
import { Message, Seen } from "../utils/store/types";
import { deleteMessage, markMessageAsSeen } from "../utils/actions/chatActions";
import { formatAmPm } from "../utils/helperFns";
import { useNavigation } from "@react-navigation/native";
import { StackScreenProps } from "@react-navigation/stack";
import { LoggedInStackParamList } from "../navigation/types";

type MenuItemProps = {
	text: string;
	icon: string;
	iconPack?: any;
	onSelect: () => void;
};

const MenuItem = (props: MenuItemProps) => {
	const { theme } = useTheme();
	const Icon = props.iconPack ?? Feather;

	return (
		<MenuOption onSelect={props.onSelect}>
			<View style={menuStyles.itemContainer}>
				<Icon name={props.icon} size={18} color={theme.colors.textSecondary} />
				<Text style={[menuStyles.text, { color: theme.colors.text }]}>{props.text}</Text>
			</View>
		</MenuOption>
	);
};

const menuStyles = StyleSheet.create({
	itemContainer: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 10,
		paddingHorizontal: 16,
		gap: 14,
	},
	text: {
		fontFamily: "regular",
		fontSize: 16,
		letterSpacing: 0.3,
	},
});

type Props = {
	text: string;
	type: "myMessage" | "theirMessage" | "reply" | "info";
	deleted?: boolean;
	edited?: boolean;
	messageId: string;
	chatId: string;
	userId: string;
	sentBy: string;
	senderId?: string;
	date: string;
	setReplyingTo: () => void;
	setEditMessage?: () => void;
	replyTo?: Message;
	replyToUser?: string;
	name?: string;
	imageUrl?: string;
	scrollToRepliedMessage: () => void;
	totalSeens?: Array<Seen>;
	isGroupChat: boolean;
};

type NavigationProps = StackScreenProps<LoggedInStackParamList, "MessageInfo">["navigation"];

const ChatMessage = (props: Props) => {
	const { theme } = useTheme();
	const navigation = useNavigation<NavigationProps>();
	const {
		text,
		type,
		messageId,
		date,
		setReplyingTo,
		replyTo,
		name,
		imageUrl,
		replyToUser,
		scrollToRepliedMessage,
		deleted,
		chatId,
		userId,
		sentBy,
		setEditMessage,
		edited,
		totalSeens,
		isGroupChat,
	} = props;

	const wrapperStyle: ViewStyle = {};
	const messageStyle: ViewStyle = {
		borderRadius: 18,
		padding: 10,
		paddingHorizontal: 14,
		marginBottom: 4,
		maxWidth: "80%",
	};
	const textStyle: TextStyle = {
		fontFamily: "regular",
		letterSpacing: 0.3,
		fontSize: 15,
	};

	const dateString = formatAmPm(date);
	const menuRef = useRef<any>(null);

	const copyToClipboard = async (text: string) => {
		try {
			await Clipboard.setStringAsync(text);
		} catch (error) {
			console.log(error);
		}
	};

	const showMessageMenu = () => {
		if (type === "reply") return;
		menuRef.current?.props.ctx.menuActions.openMenu(messageId);
	};

	const deleteChatMessage = () => {
		deleteMessage({ messageId, chatId, userId });
	};

	switch (type) {
		case "myMessage":
			wrapperStyle.flexDirection = "row";
			wrapperStyle.justifyContent = "flex-end";
			messageStyle.backgroundColor = theme.colors.sentBubble;
			textStyle.color = theme.colors.sentBubbleText;
			messageStyle.borderBottomRightRadius = 4;
			break;
		case "theirMessage":
			wrapperStyle.flexDirection = "row";
			wrapperStyle.justifyContent = "flex-start";
			messageStyle.backgroundColor = theme.colors.receivedBubble;
			textStyle.color = theme.colors.receivedBubbleText;
			messageStyle.borderBottomLeftRadius = 4;
			break;
		case "reply":
			messageStyle.backgroundColor = theme.dark ? theme.colors.surfaceElevated : "#F2F2F2";
			messageStyle.borderLeftColor = theme.colors.primary;
			messageStyle.borderLeftWidth = 3;
			messageStyle.borderRadius = 8;
			messageStyle.maxWidth = "100%";
			textStyle.color = theme.colors.text;
			break;
		case "info":
			wrapperStyle.alignItems = "center";
			messageStyle.alignItems = "center";
			messageStyle.backgroundColor = theme.colors.infoBubble;
			messageStyle.maxWidth = "80%";
			textStyle.color = theme.colors.infoBubbleText;
			textStyle.fontSize = 13;
			break;
		default:
			break;
	}

	useEffect(() => {
		if (type === "myMessage") return;
		const isAlreadySeen = totalSeens && totalSeens.find((seen) => seen.seenBy === userId);
		if (isAlreadySeen) return;

		markMessageAsSeen({ chatId, messageId, seenBy: userId });
	}, [chatId]);

	const isSeen = !!(totalSeens && totalSeens.length > 0);

	const timeColor = theme.colors.textSecondary;

	return (
		<View style={wrapperStyle}>
			<TouchableWithoutFeedback style={{ width: "100%" }} onLongPress={showMessageMenu} onPress={scrollToRepliedMessage}>
				<View style={messageStyle}>
					{type !== "info" && name && (
						<Text style={[styles.name, { color: theme.colors.primary }]}>{name}</Text>
					)}

					{replyTo && replyToUser && (
						<ChatMessage
							type="reply"
							text={replyTo.text}
							name={replyToUser}
							date={replyTo.sentAt}
							messageId={replyTo.messageId}
							setReplyingTo={() => {}}
							scrollToRepliedMessage={scrollToRepliedMessage}
							chatId={chatId}
							userId={userId}
							sentBy={replyTo.sentBy}
							isGroupChat={isGroupChat}
						/>
					)}

					{deleted ? (
						<View style={styles.deletedMessageContainer}>
							<MaterialIcons name="not-interested" size={16} color={timeColor} />
							<Text style={{ ...textStyle, fontFamily: "italic", fontSize: 14 }}>Message deleted</Text>
						</View>
					) : imageUrl ? (
						<Image source={{ uri: imageUrl }} style={styles.image} />
					) : (
						<Text style={textStyle}>{text}</Text>
					)}

					{type !== "reply" && (
						<View style={styles.timeContainer}>
							<Text style={[styles.time, { color: timeColor }]}>
								{edited ? "Edited " : ""}{dateString}
							</Text>
							{!deleted && type === "myMessage" && (
								<Ionicons
									name="md-checkmark-done-sharp"
									size={13}
									color={isSeen ? theme.colors.primary : theme.colors.textSecondary}
								/>
							)}
						</View>
					)}
				</View>
			</TouchableWithoutFeedback>

			{type !== "reply" && !deleted && (
				<Menu ref={menuRef} name={messageId}>
					<MenuTrigger />
					<MenuOptions
						customStyles={{
							optionsContainer: {
								backgroundColor: theme.colors.menuBg,
								borderRadius: 14,
								paddingVertical: 4,
								width: 200,
								shadowColor: "#000",
								shadowOffset: { width: 0, height: 4 },
								shadowOpacity: 0.15,
								shadowRadius: 12,
								elevation: 8,
							},
						}}
					>
						<MenuItem text="Reply" icon="corner-up-left" onSelect={setReplyingTo} />
						<MenuItem text="Copy" icon="copy" onSelect={() => copyToClipboard(text)} />
						{type === "myMessage" && (
							<>
								<MenuItem
									text="Info"
									icon="md-information-circle"
									onSelect={() => {
										navigation.navigate("MessageInfo", {
											totalSeens: totalSeens || [],
											messageDetails: {
												messageText: text,
												messageDate: date,
												isGroupChat,
												imageUrl,
												isSeen,
												edited: !!edited,
											},
										});
									}}
									iconPack={Ionicons}
								/>
								{!imageUrl && (
									<MenuItem
										text="Edit"
										icon="pencil"
										onSelect={() => setEditMessage?.()}
										iconPack={MaterialCommunityIcons}
									/>
								)}
								<MenuItem text="Delete" icon="delete" onSelect={deleteChatMessage} iconPack={MaterialIcons} />
							</>
						)}
					</MenuOptions>
				</Menu>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	timeContainer: {
		flexDirection: "row",
		justifyContent: "flex-end",
		alignItems: "center",
		gap: 3,
		marginTop: 4,
	},
	time: {
		fontFamily: "regular",
		fontSize: 11,
	},
	name: {
		fontFamily: "medium",
		letterSpacing: 0.3,
		marginBottom: 4,
		fontSize: 13,
	},
	image: {
		width: 250,
		height: 250,
		borderRadius: 12,
		marginBottom: 4,
	},
	deletedMessageContainer: {
		flexDirection: "row",
		alignItems: "center",
		gap: 6,
	},
});

export default ChatMessage;
