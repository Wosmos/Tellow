import React, { useState } from "react";
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	ScrollView,
	KeyboardAvoidingView,
	Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import SignUpForm from "../components/SignUpForm";
import SignInForm from "../components/SignInForm";
import { useTheme } from "../constants";

const AuthScreen = () => {
	const { theme, isDark } = useTheme();
	const [isSignUp, setIsSignUp] = useState(false);

	return (
		<SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]}>
			<StatusBar style={isDark ? "light" : "dark"} />
			<KeyboardAvoidingView
				style={{ flex: 1 }}
				behavior={Platform.OS === "ios" ? "padding" : undefined}
			>
				<ScrollView
					contentContainerStyle={styles.scroll}
					keyboardShouldPersistTaps="handled"
					showsVerticalScrollIndicator={false}
				>
					{/* Heading */}
					<View style={styles.headingBlock}>
						<Text style={[styles.heading, { color: theme.colors.text }]}>
							{isSignUp ? "Get Started Now" : "Welcome Back"}
						</Text>
						<Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
							{isSignUp
								? "Create an account to explore our app"
								: "Login to access your account"}
						</Text>
					</View>

					{/* Tab Switcher */}
					<View style={[styles.tabRow, { backgroundColor: theme.colors.inputBg }]}>
						<TouchableOpacity
							style={[styles.tab, !isSignUp && [styles.tabActive, { backgroundColor: theme.colors.primary }]]}
							onPress={() => setIsSignUp(false)}
							activeOpacity={0.8}
						>
							<Text style={[styles.tabText, !isSignUp && styles.tabTextActive]}>
								Log In
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={[styles.tab, isSignUp && [styles.tabActive, { backgroundColor: theme.colors.primary }]]}
							onPress={() => setIsSignUp(true)}
							activeOpacity={0.8}
						>
							<Text style={[styles.tabText, isSignUp && styles.tabTextActive]}>
								Sign Up
							</Text>
						</TouchableOpacity>
					</View>

					{/* Form */}
					<View style={styles.form}>
						{isSignUp ? <SignUpForm /> : <SignInForm />}
					</View>

					{/* Footer */}
					<View style={styles.footer}>
						<Text style={[styles.footerText, { color: theme.colors.textSecondary }]}>
							{isSignUp ? "Already have an account? " : "Don't have an account? "}
						</Text>
						<TouchableOpacity onPress={() => setIsSignUp((p) => !p)}>
							<Text style={[styles.footerLink, { color: theme.colors.primary }]}>
								{isSignUp ? "Log In" : "Sign Up"}
							</Text>
						</TouchableOpacity>
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	safe: { flex: 1 },
	scroll: {
		flexGrow: 1,
		paddingHorizontal: 24,
		paddingTop: 40,
		paddingBottom: 30,
	},
	headingBlock: {
		marginBottom: 28,
	},
	heading: {
		fontSize: 30,
		fontFamily: "bold",
		marginBottom: 8,
	},
	subtitle: {
		fontSize: 15,
		fontFamily: "regular",
		lineHeight: 22,
	},
	// Tab switcher
	tabRow: {
		flexDirection: "row",
		borderRadius: 30,
		padding: 4,
		marginBottom: 24,
	},
	tab: {
		flex: 1,
		paddingVertical: 12,
		alignItems: "center",
		borderRadius: 26,
	},
	tabActive: {},
	tabText: {
		fontFamily: "medium",
		fontSize: 14,
		color: "#8E8E93",
	},
	tabTextActive: {
		color: "#FFFFFF",
	},
	form: {
		flex: 1,
	},
	footer: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		marginTop: 24,
		paddingBottom: 10,
	},
	footerText: {
		fontFamily: "regular",
		fontSize: 14,
	},
	footerLink: {
		fontFamily: "medium",
		fontSize: 14,
	},
});

export default AuthScreen;
