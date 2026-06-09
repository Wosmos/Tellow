import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserData } from "./types";

type ContactsState = {
	contacts: { [userId: string]: UserData };
};

const initialState: ContactsState = {
	contacts: {},
};

const contactsSlice = createSlice({
	name: "contacts",
	initialState,
	reducers: {
		setContacts(state, action: PayloadAction<{ contacts: { [userId: string]: UserData } }>) {
			state.contacts = action.payload.contacts;
		},
		addContactToStore(state, action: PayloadAction<{ user: UserData }>) {
			state.contacts[action.payload.user.userId] = action.payload.user;
		},
		removeContactFromStore(state, action: PayloadAction<{ userId: string }>) {
			delete state.contacts[action.payload.userId];
		},
	},
});

export const { setContacts, addContactToStore, removeContactFromStore } = contactsSlice.actions;
export default contactsSlice.reducer;
