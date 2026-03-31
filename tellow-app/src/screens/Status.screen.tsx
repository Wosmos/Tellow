import React from "react";
import { StyleSheet, Text, Dimensions, FlatList } from "react-native";
import MyStatus from "../components/MyStatus";
import PageContainer from "../components/PageContainer";
import PageTitle from "../components/PageTitle";
import { useAppSelector } from "../utils/store";
import UserItem from "../components/UserItem";
import { useTheme } from "../constants";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { LoggedInStackParamList } from "../navigation/types";

const { width, height } = Dimensions.get("window");

type Props = {};

const StatusScreen = (_props: Props) => {
	const { theme } = useTheme();
	const navigation = useNavigation<StackNavigationProp<LoggedInStackParamList>>();
	const storedUsers = useAppSelector((state) => state.storedUsers.storedUsers);
	const { contactsStatuses } = useAppSelector((state) => state.statuses);

	return (
		<PageContainer>
			<PageTitle text="Status" />
			<MyStatus />

			<Text style={styles.heading}>STATUSES</Text>
			<FlatList
				data={Object.keys(contactsStatuses)}
				renderItem={(itemData) => {
					const contactuserId = itemData.item;
					const contactUser = storedUsers[contactuserId];
					const contactStatuses = contactsStatuses[contactuserId];

					if (contactStatuses.length == 0) return null;

					let title = `${contactUser.firstName} ${contactUser.lastName}`;
					const subTitle = `Has uploaded ${contactStatuses.length} ${contactStatuses.length === 1 ? "story" : "stories"}`;
					let image = contactsStatuses[contactuserId][0]?.imageUrl;

					return (
						<UserItem
							title={title}
							subTitle={subTitle}
							image={image}
							onPress={() =>
								navigation.navigate("UserStatuses", { statuses: contactStatuses, userId: contactuserId, username: title })
							}
							type="user"
						/>
					);
				}}
			/>
		</PageContainer>
	);
};

const styles = StyleSheet.create({
	container: {
		width,
		paddingTop: height * 0.025,
		justifyContent: "center",
		alignItems: "center",
	},
	inputContainer: {
		paddingHorizontal: width * 0.09,
		alignSelf: "flex-start",
	},
	buttonContainer: {
		marginTop: 5,
		width: width * 0.8,
	},
	input: {
		marginBottom: 5,
		marginTop: 5,
		borderWidth: 1,
		width: width * 0.8,
	},
	loading: {
		width,
		height,
		position: "absolute",
		top: 0,
		left: 0,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0,0,0,0.3)",
	},
	button: {
		marginTop: 20,
		width: "100%",
	},
	heading: {
		color: "#1c1e21",
		fontFamily: "bold",
		letterSpacing: 0.3,
		marginTop: 30,
		marginBottom: 10,
	},
});

export default StatusScreen;
