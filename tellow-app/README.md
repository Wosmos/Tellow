# Tellow

A modern real-time communication app built with React Native.

## Tech Stack

- **React Native** with **Expo** for cross-platform mobile development
- **Supabase** for authentication, database, and file storage
- **Redux Toolkit** for state management
- **TypeScript** for type safety
- **React Navigation** for in-app navigation

## Features

- Authentication with email and password
- Real-time messaging with other users
- Group chats and private conversations
- Image sharing in chats
- Push notifications for new messages
- User profiles with profile pictures
- Status updates with images
- Message seen indicators with timestamps
- Reply to and edit messages
- Dark and light theme support

## Getting Started

Install dependencies:

```
npm install
```

Set up environment variables — create a `.env` file in the root directory:

```
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Start the development server:

```
npm start
```

Press `a` for Android emulator, `i` for iOS simulator, or scan the QR code with Expo Go on your device.
