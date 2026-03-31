import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "../constants";

type Props = {
	text: string;
};

const PageTitle = (props: Props) => {
	const { theme } = useTheme();

	return (
		<View style={styles.container}>
			<Text style={[styles.text, { color: theme.colors.text }]}>{props.text}</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		marginBottom: 10,
	},
	text: {
		fontSize: 28,
		fontFamily: "bold",
		letterSpacing: 0.3,
	},
});

export default PageTitle;
