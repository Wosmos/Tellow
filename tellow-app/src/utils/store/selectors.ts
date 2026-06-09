import { createSelector } from "@reduxjs/toolkit";
import { ApplicationState } from "./index";
import { Message } from "./types";

export const selectSortedChats = createSelector(
	(state: ApplicationState) => state.chats.chatsData,
	(chatsData) =>
		Object.values(chatsData).sort(
			(a, b) => new Date(b.updatedAt).valueOf() - new Date(a.updatedAt).valueOf()
		)
);

export const selectChatsArray = createSelector(
	(state: ApplicationState) => state.chats.chatsData,
	(chatsData) => Object.values(chatsData)
);

export const selectChatMessages = createSelector(
	(state: ApplicationState, chatId: string | null) =>
		chatId ? state.messages.messagesData[chatId] : null,
	(chatMessagesData): Message[] => {
		if (!chatMessagesData) return [];
		return Object.entries(chatMessagesData).map(([messageId, data]) => ({
			messageId,
			...data,
		}));
	}
);
