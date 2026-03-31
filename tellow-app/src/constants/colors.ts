export const palette = {
	// Primary accent
	primary: "#5B6BF5",
	primaryLight: "#8B95F7",
	primaryDark: "#4450C8",

	// Pastel lavender (sent bubbles, settings header)
	lavender: "#C5CAFE",
	lavenderDark: "#4A4E7A",

	// Neutrals
	white: "#FFFFFF",
	black: "#000000",

	// Grays
	gray50: "#F7F7F8",
	gray100: "#F0F0F2",
	gray200: "#E5E5EA",
	gray300: "#D1D1D6",
	gray400: "#AEAEB2",
	gray500: "#8E8E93",
	gray600: "#636366",
	gray700: "#48484A",
	gray800: "#2C2C2E",
	gray900: "#1C1C1E",

	// Semantic
	red: "#FF3B30",
	green: "#34C759",
	blue: "#007AFF",
	orange: "#FF9500",

	// Dark theme surfaces
	darkBg: "#0D0D12",
	darkSurface: "#1C1C23",
	darkElevated: "#2C2C35",
};

// Keep legacy export for any remaining references during migration
export const colors = {
	blue: palette.primary,
	lightGray: palette.gray300,
	extraLightGrey: palette.gray100,
	almostWhite: palette.gray50,
	gray: palette.gray500,
	textColor: palette.gray900,
	primary: palette.primary,
	red: palette.red,
	beige: "#FEF5C3",
};
