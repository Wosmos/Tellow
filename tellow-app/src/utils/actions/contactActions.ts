import { supabase } from "../supabase";
import { ApplicationDispatch } from "../store";
import { setContacts, addContactToStore, removeContactFromStore } from "../store/contactsSlice";
import { setStoredUsers } from "../store/usersSlice";
import { UserData } from "../store/types";

const mapRow = (u: any): UserData => ({
	userId: u.user_id,
	firstName: u.first_name,
	lastName: u.last_name,
	firstLast: u.first_last,
	email: u.email,
	about: u.about || "",
	profilePicture: u.profile_picture || "",
	signUpDate: u.sign_up_date,
	phoneNumber: u.phone_number || "",
});

export const fetchContacts = (userId: string) => {
	return async (dispatch: ApplicationDispatch) => {
		const { data, error } = await supabase
			.from("contacts")
			.select("contact_user_id, users!contacts_contact_user_id_fkey(*)")
			.eq("user_id", userId);

		if (error) { console.log("fetchContacts error:", error); return; }

		const contacts: Record<string, UserData> = {};
		const newUsers: Record<string, UserData> = {};

		data?.forEach((row: any) => {
			const u = row.users;
			if (!u) return;
			const mapped = mapRow(u);
			contacts[mapped.userId] = mapped;
			newUsers[mapped.userId] = mapped;
		});

		dispatch(setContacts({ contacts }));
		dispatch(setStoredUsers({ newUsers }));
	};
};

export const addContact = (myUserId: string, contactUser: UserData) => {
	return async (dispatch: ApplicationDispatch) => {
		const { error } = await supabase
			.from("contacts")
			.insert({ user_id: myUserId, contact_user_id: contactUser.userId });

		if (error) throw error;
		dispatch(addContactToStore({ user: contactUser }));
		dispatch(setStoredUsers({ newUsers: { [contactUser.userId]: contactUser } }));
	};
};

export const removeContact = (myUserId: string, contactUserId: string) => {
	return async (dispatch: ApplicationDispatch) => {
		const { error } = await supabase
			.from("contacts")
			.delete()
			.eq("user_id", myUserId)
			.eq("contact_user_id", contactUserId);

		if (error) throw error;
		dispatch(removeContactFromStore({ userId: contactUserId }));
	};
};
