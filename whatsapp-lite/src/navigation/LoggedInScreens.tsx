import React from "react";
import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { StackScreenProps, createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator, BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import ChatListScreen from "../screens/ChatList.screen";
import CallsScreen from "../screens/Calls.screen";
import SavedScreen from "../screens/Saved.screen";
import ContactsScreen from "../screens/Contacts.screen";
import SettingsScreen from "../screens/Settings.screen";
import { LoggedInStackParamList, LoggedInTabParamList } from "./types";
import ChatSettingsScreen from "../screens/ChatSettings.screen";
import ChatScreen from "../screens/Chat.Screen";
import NewChatScreen from "../screens/NewChat.Screen";
import ContactScreen from "../screens/Contact.screen";
import ParticipantsScreen from "../screens/Participants.screen";
import UserStatusesScreen from "../screens/UserStatuses.screen";
import ViewsScreen from "../screens/Views.screen";
import MessageInfoScreen from "../screens/MessageInfo.Screen";
import { useTheme } from "../constants";

const Stack = createStackNavigator<LoggedInStackParamList>();
const Tab = createBottomTabNavigator<LoggedInTabParamList>();

const tabConfig: Record<string, { icon: React.ComponentProps<typeof Ionicons>["name"]; label: string }> = {
	ChatList: { icon: "chatbubble-ellipses-outline", label: "Chats" },
	Calls: { icon: "call-outline", label: "Calls" },
	Saved: { icon: "bookmark-outline", label: "Saved" },
	Contacts: { icon: "people-outline", label: "Contacts" },
	Settings: { icon: "settings-outline", label: "Settings" },
};

const TabBarContent = ({ state, navigation, theme }: BottomTabBarProps & { theme: any }) => {
	const borderColor = theme.dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)";

	return (
		<View style={[tabBarStyles.inner, { borderTopColor: borderColor }]}>
			{state.routes.map((route, index) => {
				const focused = state.index === index;
				const config = tabConfig[route.name] || { icon: "ellipse-outline" as any, label: route.name };
				const color = focused ? theme.colors.tabActive : theme.colors.tabInactive;

				return (
					<TouchableOpacity
						key={route.key}
						accessibilityRole="button"
						accessibilityState={focused ? { selected: true } : {}}
						onPress={() => {
							const event = navigation.emit({ type: "tabPress", target: route.key, canPreventDefault: true });
							if (!focused && !event.defaultPrevented) {
								navigation.navigate(route.name);
							}
						}}
						style={tabBarStyles.tab}
						activeOpacity={0.7}
					>
						<Ionicons name={config.icon} size={22} color={color} />
						<Text style={[tabBarStyles.label, { color }]}>{config.label}</Text>
						{focused && (
							<View style={[tabBarStyles.indicator, { backgroundColor: theme.colors.tabActive }]} />
						)}
					</TouchableOpacity>
				);
			})}
		</View>
	);
};

const CustomTabBar = (props: BottomTabBarProps) => {
	const { theme } = useTheme();
	const isIOS = Platform.OS === "ios";

	// iOS: real blur. Android: solid bg with slight transparency.
	if (isIOS) {
		return (
			<View style={tabBarStyles.wrapper}>
				<BlurView intensity={theme.dark ? 50 : 80} tint={theme.dark ? "dark" : "light"} style={tabBarStyles.blur}>
					<View style={[tabBarStyles.blurOverlay, { backgroundColor: theme.dark ? "rgba(28,28,35,0.55)" : "rgba(255,255,255,0.65)" }]}>
						<TabBarContent {...props} theme={theme} />
					</View>
				</BlurView>
			</View>
		);
	}

	// Android: solid background
	return (
		<View style={tabBarStyles.wrapper}>
			<View style={[tabBarStyles.solidBg, { backgroundColor: theme.colors.tabBar }]}>
				<TabBarContent {...props} theme={theme} />
			</View>
		</View>
	);
};

const tabBarStyles = StyleSheet.create({
	wrapper: {
		position: "absolute",
		bottom: 0, left: 0, right: 0,
	},
	blur: { overflow: "hidden" },
	blurOverlay: {},
	solidBg: {
		elevation: 8,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: -2 },
		shadowOpacity: 0.08,
		shadowRadius: 8,
	},
	inner: {
		flexDirection: "row",
		paddingTop: 8,
		paddingBottom: Platform.OS === "ios" ? 26 : 10,
		borderTopWidth: StyleSheet.hairlineWidth,
	},
	tab: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		position: "relative",
		paddingVertical: 2,
	},
	indicator: {
		position: "absolute",
		bottom: -4,
		width: 32, height: 3, borderRadius: 1.5,
	},
	label: {
		fontFamily: "medium",
		fontSize: 10,
		marginTop: 3,
	},
});

type TabNavigatorProps = StackScreenProps<LoggedInStackParamList, "Home">;

const TabNavigator = (_props: TabNavigatorProps) => {
	const { theme } = useTheme();

	return (
		<Tab.Navigator
			tabBar={(props) => <CustomTabBar {...props} />}
			sceneContainerStyle={{ paddingBottom: 0 }}
			screenOptions={{
				headerTitle: "",
				headerShadowVisible: false,
				headerStyle: { backgroundColor: theme.colors.headerBg },
				headerTintColor: theme.colors.headerText,
			}}
			initialRouteName="ChatList"
		>
			<Tab.Screen name="ChatList" component={ChatListScreen} />
			<Tab.Screen name="Calls" component={CallsScreen} />
			<Tab.Screen name="Saved" component={SavedScreen} />
			<Tab.Screen name="Contacts" component={ContactsScreen} />
			<Tab.Screen name="Settings" component={SettingsScreen} />
		</Tab.Navigator>
	);
};

export const StackNavigator = () => {
	const { theme } = useTheme();

	return (
		<Stack.Navigator
			initialRouteName="Home"
			screenOptions={{
				headerStyle: { backgroundColor: theme.colors.headerBg },
				headerTintColor: theme.colors.headerText,
				headerTitleStyle: { fontFamily: "medium" },
				cardStyle: { backgroundColor: theme.colors.background },
			}}
		>
			<Stack.Group>
				<Stack.Screen name="Home" component={TabNavigator} options={{ headerShown: false }} />
				<Stack.Screen
					name="ChatSettings"
					component={ChatSettingsScreen}
					options={{ headerTitle: "Chat Settings", headerBackTitle: "Back" }}
				/>
				<Stack.Screen
					name="Chat"
					component={ChatScreen}
					options={{ headerTitle: "Chat", headerBackTitle: "Back" }}
				/>
				<Stack.Screen
					name="Contact"
					component={ContactScreen}
					options={{ headerTitle: "Contact Info", headerBackTitle: "Back" }}
				/>
				<Stack.Screen
					name="Participants"
					component={ParticipantsScreen}
					options={{ headerTitle: "Participants", headerBackTitle: "Back" }}
				/>
			</Stack.Group>

			<Stack.Group screenOptions={{ presentation: "modal" }}>
				<Stack.Screen name="NewChat" component={NewChatScreen} />
				<Stack.Screen name="UserStatuses" component={UserStatusesScreen} />
				<Stack.Screen
					name="MessageInfo"
					component={MessageInfoScreen}
					options={{ headerTitle: "Message Info", headerBackTitle: "Back" }}
				/>
			</Stack.Group>

			<Stack.Group screenOptions={{ presentation: "transparentModal", headerShown: false }}>
				<Stack.Screen name="Views" component={ViewsScreen} />
			</Stack.Group>
		</Stack.Navigator>
	);
};
