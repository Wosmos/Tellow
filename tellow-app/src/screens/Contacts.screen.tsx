import React, { useCallback, useRef, useState } from "react";
import {
	ActivityIndicator,
	Alert,
	FlatList,
	SectionList,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../constants";
import { useAppDispatch, useAppSelector } from "../utils/store";
import { searchUsers } from "../utils/actions/userActions";
import { addContact, removeContact } from "../utils/actions/contactActions";
import { UserData } from "../utils/store/types";
import UserImage from "../components/UserImage";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { LoggedInStackParamList } from "../navigation/types";

type NavProp = StackNavigationProp<LoggedInStackParamList>;

const ContactsScreen = () => {
	const { theme } = useTheme();
	const dispatch = useAppDispatch();
	const navigation = useNavigation<NavProp>();

	const userData = useAppSelector((state) => state.auth.userData)!;
	const contacts = useAppSelector((state) => state.contacts.contacts);
	const storedChats = useAppSelector((state) => state.chats.chatsData);
	const storedUsers = useAppSelector((state) => state.storedUsers.storedUsers);

	const [query, setQuery] = useState("");
	const [searchResults, setSearchResults] = useState<UserData[]>([]);
	const [isSearching, setIsSearching] = useState(false);
	const [loadingId, setLoadingId] = useState<string | null>(null);

	const debounceRef = useRef<NodeJS.Timeout>();

	// People in your chats who are not already in contacts
	const fromChats = Object.values(storedUsers).filter((u) => {
		if (u.userId === userData.userId) return false;
		if (contacts[u.userId]) return false;
		return Object.values(storedChats).some(
			(c) => !c.isGroupChat && c.users.includes(u.userId) && c.users.includes(userData.userId)
		);
	});

	const handleSearch = useCallback((text: string) => {
		setQuery(text);
		clearTimeout(debounceRef.current);
		if (!text.trim()) {
			setSearchResults([]);
			setIsSearching(false);
			return;
		}
		setIsSearching(true);
		debounceRef.current = setTimeout(async () => {
			try {
				const results = await searchUsers(text.trim());
				setSearchResults(
					Object.values(results).filter((u) => u.userId !== userData.userId)
				);
			} catch (e) {
				console.log(e);
			} finally {
				setIsSearching(false);
			}
		}, 500);
	}, [userData.userId]);

	const handleAddContact = useCallback(async (user: UserData) => {
		setLoadingId(user.userId);
		try {
			await dispatch(addContact(userData.userId, user));
		} catch (e: any) {
			Alert.alert("Error", e.message || "Could not add contact");
		} finally {
			setLoadingId(null);
		}
	}, [dispatch, userData.userId]);

	const handleRemoveContact = useCallback((user: UserData) => {
		Alert.alert(
			"Remove Contact",
			`Remove ${user.firstName} ${user.lastName} from contacts?`,
			[
				{ text: "Cancel", style: "cancel" },
				{
					text: "Remove",
					style: "destructive",
					onPress: async () => {
						setLoadingId(user.userId);
						try {
							await dispatch(removeContact(userData.userId, user.userId));
						} catch (e: any) {
							Alert.alert("Error", e.message || "Could not remove contact");
						} finally {
							setLoadingId(null);
						}
					},
				},
			]
		);
	}, [dispatch, userData.userId]);

	const navigateToChat = useCallback((user: UserData) => {
		const existingChat = Object.keys(storedChats).find((cid) => {
			const c = storedChats[cid];
			return !c.isGroupChat && c.users.includes(user.userId) && c.users.includes(userData.userId);
		});
		if (existingChat) {
			navigation.navigate("Chat", { chatId: existingChat });
		} else {
			navigation.navigate("Chat", { selectedUserId: user.userId });
		}
	}, [storedChats, userData.userId, navigation]);

	const renderContactRow = useCallback(({ item: user, isContact }: { item: UserData; isContact: boolean }) => (
		<View style={[styles.row, { borderBottomColor: theme.colors.border }]}>
			<TouchableOpacity
				style={styles.rowLeft}
				onPress={() => navigation.navigate("Contact", { userId: user.userId })}
				activeOpacity={0.7}
			>
				<UserImage uri={user.profilePicture} size={46} />
				<View style={styles.rowText}>
					<Text style={[styles.name, { color: theme.colors.text }]}>
						{user.firstName} {user.lastName}
					</Text>
					{user.phoneNumber ? (
						<Text style={[styles.sub, { color: theme.colors.textSecondary }]}>{user.phoneNumber}</Text>
					) : (
						<Text style={[styles.sub, { color: theme.colors.textSecondary }]}>{user.email}</Text>
					)}
				</View>
			</TouchableOpacity>
			<View style={styles.rowActions}>
				<TouchableOpacity onPress={() => navigateToChat(user)} style={styles.actionBtn}>
					<Ionicons name="chatbubble-outline" size={20} color={theme.colors.primary} />
				</TouchableOpacity>
				{isContact ? (
					loadingId === user.userId ? (
						<ActivityIndicator size="small" color={theme.colors.primary} style={styles.actionBtn} />
					) : (
						<TouchableOpacity onPress={() => handleRemoveContact(user)} style={styles.actionBtn}>
							<Ionicons name="person-remove-outline" size={20} color={theme.colors.red} />
						</TouchableOpacity>
					)
				) : (
					loadingId === user.userId ? (
						<ActivityIndicator size="small" color={theme.colors.primary} style={styles.actionBtn} />
					) : (
						<TouchableOpacity onPress={() => handleAddContact(user)} style={styles.actionBtn}>
							<Ionicons name="person-add-outline" size={20} color={theme.colors.primary} />
						</TouchableOpacity>
					)
				)}
			</View>
		</View>
	), [theme, loadingId, navigateToChat, handleAddContact, handleRemoveContact, navigation]);

	const renderSearchRow = useCallback(({ item: user }: { item: UserData }) => {
		const isAlreadyContact = !!contacts[user.userId];
		return (
			<View style={[styles.row, { borderBottomColor: theme.colors.border }]}>
				<TouchableOpacity
					style={styles.rowLeft}
					onPress={() => navigation.navigate("Contact", { userId: user.userId })}
					activeOpacity={0.7}
				>
					<UserImage uri={user.profilePicture} size={46} />
					<View style={styles.rowText}>
						<Text style={[styles.name, { color: theme.colors.text }]}>
							{user.firstName} {user.lastName}
						</Text>
						{user.phoneNumber ? (
							<Text style={[styles.sub, { color: theme.colors.textSecondary }]}>{user.phoneNumber}</Text>
						) : (
							<Text style={[styles.sub, { color: theme.colors.textSecondary }]}>{user.email}</Text>
						)}
					</View>
				</TouchableOpacity>
				<View style={styles.rowActions}>
					<TouchableOpacity onPress={() => navigateToChat(user)} style={styles.actionBtn}>
						<Ionicons name="chatbubble-outline" size={20} color={theme.colors.primary} />
					</TouchableOpacity>
					{loadingId === user.userId ? (
						<ActivityIndicator size="small" color={theme.colors.primary} style={styles.actionBtn} />
					) : isAlreadyContact ? (
						<TouchableOpacity onPress={() => handleRemoveContact(user)} style={styles.actionBtn}>
							<Ionicons name="person-remove-outline" size={20} color={theme.colors.red} />
						</TouchableOpacity>
					) : (
						<TouchableOpacity onPress={() => handleAddContact(user)} style={styles.actionBtn}>
							<Ionicons name="person-add-outline" size={20} color={theme.colors.primary} />
						</TouchableOpacity>
					)}
				</View>
			</View>
		);
	}, [theme, contacts, loadingId, navigateToChat, handleAddContact, handleRemoveContact, navigation]);

	const contactList = Object.values(contacts);

	const sections = [
		...(contactList.length > 0 ? [{ title: "MY CONTACTS", data: contactList, isContact: true }] : []),
		...(fromChats.length > 0 ? [{ title: "FROM CHATS", data: fromChats, isContact: false }] : []),
	];

	return (
		<View style={[styles.container, { backgroundColor: theme.colors.background }]}>
			{/* Search bar */}
			<View style={[styles.searchBar, { backgroundColor: theme.colors.inputBg, borderColor: theme.colors.border }]}>
				<Ionicons name="search" size={18} color={theme.colors.textSecondary} />
				<TextInput
					style={[styles.searchInput, { color: theme.colors.text }]}
					placeholder="Search by name or phone..."
					placeholderTextColor={theme.colors.textSecondary}
					value={query}
					onChangeText={handleSearch}
					autoCapitalize="none"
					clearButtonMode="while-editing"
				/>
				{isSearching && <ActivityIndicator size="small" color={theme.colors.primary} />}
			</View>

			{/* Search results */}
			{query.trim().length > 0 ? (
				<FlatList
					data={searchResults}
					keyExtractor={(u) => u.userId}
					renderItem={renderSearchRow}
					contentContainerStyle={styles.list}
					ListEmptyComponent={
						!isSearching ? (
							<Text style={[styles.empty, { color: theme.colors.textSecondary }]}>No users found</Text>
						) : null
					}
				/>
			) : (
				<SectionList
					sections={sections}
					keyExtractor={(u) => u.userId}
					renderItem={({ item, section }) =>
						renderContactRow({ item, isContact: (section as any).isContact })
					}
					renderSectionHeader={({ section }) => (
						<Text style={[styles.sectionHeader, { color: theme.colors.textSecondary, backgroundColor: theme.colors.background }]}>
							{section.title}
						</Text>
					)}
					contentContainerStyle={styles.list}
					ListEmptyComponent={
						<View style={styles.emptyState}>
							<Ionicons name="people-outline" size={48} color={theme.colors.textSecondary} />
							<Text style={[styles.emptyTitle, { color: theme.colors.text }]}>No contacts yet</Text>
							<Text style={[styles.emptySub, { color: theme.colors.textSecondary }]}>
								Search by name or phone number to find people
							</Text>
						</View>
					}
				/>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: { flex: 1 },
	searchBar: {
		flexDirection: "row",
		alignItems: "center",
		margin: 12,
		paddingHorizontal: 12,
		paddingVertical: 9,
		borderRadius: 12,
		borderWidth: 1,
		gap: 8,
	},
	searchInput: {
		flex: 1,
		fontSize: 15,
		fontFamily: "regular",
		paddingVertical: 0,
	},
	list: { paddingBottom: 100 },
	sectionHeader: {
		fontSize: 12,
		fontFamily: "bold",
		letterSpacing: 0.5,
		paddingHorizontal: 16,
		paddingTop: 16,
		paddingBottom: 6,
	},
	row: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: 16,
		paddingVertical: 10,
		borderBottomWidth: StyleSheet.hairlineWidth,
	},
	rowLeft: { flex: 1, flexDirection: "row", alignItems: "center" },
	rowText: { marginLeft: 12, flex: 1 },
	name: { fontSize: 15, fontFamily: "medium" },
	sub: { fontSize: 13, fontFamily: "regular", marginTop: 2 },
	rowActions: { flexDirection: "row", alignItems: "center", gap: 4 },
	actionBtn: { padding: 8 },
	empty: { textAlign: "center", marginTop: 40, fontFamily: "regular", fontSize: 15 },
	emptyState: { alignItems: "center", marginTop: 80, paddingHorizontal: 32 },
	emptyTitle: { fontSize: 18, fontFamily: "bold", marginTop: 16 },
	emptySub: { fontSize: 14, fontFamily: "regular", marginTop: 8, textAlign: "center", lineHeight: 20 },
});

export default ContactsScreen;
