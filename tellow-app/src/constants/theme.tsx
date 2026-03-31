import React, { createContext, useContext, useState, useCallback, useMemo } from "react";
import { palette } from "./colors";

export type Theme = {
	dark: boolean;
	colors: {
		primary: string;
		primaryLight: string;
		background: string;
		surface: string;
		surfaceElevated: string;
		text: string;
		textSecondary: string;
		textInverse: string;
		border: string;
		inputBg: string;
		sentBubble: string;
		sentBubbleText: string;
		receivedBubble: string;
		receivedBubbleText: string;
		datePill: string;
		datePillText: string;
		tabBar: string;
		tabActive: string;
		tabInactive: string;
		headerBg: string;
		headerText: string;
		searchBg: string;
		badge: string;
		badgeText: string;
		online: string;
		red: string;
		overlay: string;
		menuBg: string;
		settingsHeader: string;
		infoBubble: string;
		infoBubbleText: string;
	};
};

export const lightTheme: Theme = {
	dark: false,
	colors: {
		primary: palette.primary,
		primaryLight: palette.primaryLight,
		background: palette.white,
		surface: palette.gray50,
		surfaceElevated: palette.white,
		text: palette.gray900,
		textSecondary: palette.gray500,
		textInverse: palette.white,
		border: palette.gray200,
		inputBg: palette.gray100,
		sentBubble: palette.lavender,
		sentBubbleText: palette.gray900,
		receivedBubble: palette.gray100,
		receivedBubbleText: palette.gray900,
		datePill: palette.lavender,
		datePillText: palette.gray700,
		tabBar: palette.white,
		tabActive: palette.primary,
		tabInactive: palette.gray500,
		headerBg: palette.white,
		headerText: palette.gray900,
		searchBg: palette.gray100,
		badge: palette.primary,
		badgeText: palette.white,
		online: palette.green,
		red: palette.red,
		overlay: "rgba(0,0,0,0.5)",
		menuBg: palette.white,
		settingsHeader: palette.lavender,
		infoBubble: "#FEF5C3",
		infoBubbleText: palette.gray700,
	},
};

export const darkTheme: Theme = {
	dark: false, // we'll set this properly
	colors: {
		primary: palette.primary,
		primaryLight: palette.primaryLight,
		background: palette.darkBg,
		surface: palette.darkSurface,
		surfaceElevated: palette.darkElevated,
		text: palette.white,
		textSecondary: palette.gray400,
		textInverse: palette.white,
		border: palette.darkElevated,
		inputBg: palette.darkSurface,
		sentBubble: palette.lavenderDark,
		sentBubbleText: palette.white,
		receivedBubble: palette.darkElevated,
		receivedBubbleText: palette.white,
		datePill: palette.lavenderDark,
		datePillText: palette.gray300,
		tabBar: palette.darkSurface,
		tabActive: palette.primary,
		tabInactive: palette.gray500,
		headerBg: palette.darkSurface,
		headerText: palette.white,
		searchBg: palette.darkElevated,
		badge: palette.primary,
		badgeText: palette.white,
		online: palette.green,
		red: palette.red,
		overlay: "rgba(0,0,0,0.7)",
		menuBg: palette.darkElevated,
		settingsHeader: "#2A2B4A",
		infoBubble: palette.darkElevated,
		infoBubbleText: palette.gray300,
	},
};

// Fix the dark flag
darkTheme.dark = true;

type ThemeContextType = {
	theme: Theme;
	isDark: boolean;
	toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType>({
	theme: lightTheme,
	isDark: false,
	toggleTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [isDark, setIsDark] = useState(false);

	const toggleTheme = useCallback(() => {
		setIsDark((prev) => !prev);
	}, []);

	const value = useMemo(
		() => ({
			theme: isDark ? darkTheme : lightTheme,
			isDark,
			toggleTheme,
		}),
		[isDark, toggleTheme]
	);

	return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);
