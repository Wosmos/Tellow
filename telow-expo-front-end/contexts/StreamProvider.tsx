// app/contexts/StreamProvider.tsx
import React from 'react';
import { StreamVideo, User } from '@stream-io/video-react-native-sdk';
import { useAuth } from '@clerk/clerk-expo';

export const StreamContext = React.createContext<{
  clientIsReady: boolean;
}>({
  clientIsReady: false,
});

export function StreamProvider({ children }: { children: React.ReactNode }) {
  const { isSignedIn, userId } = useAuth();
  const [clientIsReady, setClientIsReady] = React.useState(false);
  const [streamClient, setStreamClient] = React.useState<typeof StreamVideo | null>(null);

  React.useEffect(() => {
    if (!isSignedIn || !userId) return;

    const streamUser: User = {
      id: user.id,
      name: user.fullName || user.username || '',
      image: user.imageUrl,
    };

    // Initialize Stream client
    const client =  StreamVideo({
      apiKey: process.env.EXPO_PUBLIC_STREAM_API_KEY!,
      user: streamUser,
      token: user.streamToken, // You need to provide this from your backend
    });

    setStreamClient(client);
    setClientIsReady(true);

    return () => {
      client.disconnectUser();
      setStreamClient(null);
      setClientIsReady(false);
    };
  }, [isSignedIn, user]);

  if (!clientIsReady || !streamClient) return null;

  return (
    <StreamContext.Provider value={{ clientIsReady }}>
      <StreamVideo client={streamClient}>{children}</StreamVideo>
    </StreamContext.Provider>
  );
}