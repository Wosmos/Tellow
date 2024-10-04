import { SignedIn, SignedOut, useAuth, useUser } from '@clerk/clerk-expo';
import { Link, useRouter } from 'expo-router';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradientContainer from '@/components/LinearGradient';
import { Colors } from '@/constants/Colors';
import { Entypo, Feather, Ionicons } from '@expo/vector-icons';
import Dialog from 'react-native-dialog';
import { Call, useStreamVideoClient } from '@stream-io/video-react-native-sdk';
import { useRoute } from '@react-navigation/native';
import useEffect from 'react';
import { formatSlug } from '../lib/slugs';
export default function Page() {
  const client = useStreamVideoClient();
  const { user } = useUser();
  const { signOut } = useAuth();
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isMyCalls, setIsMyCalls] = useState(false);
  const [calls, setCalls] = useState<Call[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  const fetchCalls = async () => {
    if (!client || !user) return;
    const { calls } = await client.queryCalls({
      filter_conditions: isMyCalls
        ? {
            $or: [
              { created_by_user_id: user.id },
              { members: { $in: [user.id] } },
            ],
          }
        : {},
      sort: [{ field: 'created_at', direction: -1 }],
      watch: true,
    });

    // sort count by participent count
    const sortedCalls = calls.sort((a, b) => {
      return b.state.participantCount - a.state.participantCount;
    });

    setCalls(sortedCalls);
  };

  React.useEffect(() => {
    fetchCalls();
  }, [isMyCalls]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchCalls();
    setIsRefreshing(false);
  };

  const handleJoinRoom = async (id: string) => {
    router.push(`/(call)${id}`);
  };

  return (
    <LinearGradientContainer
      colors={Colors.bgGradient}
      direction='bottomLeftToTopRight'
    >
      <SafeAreaView style={styles.container}>
        <TouchableOpacity
          onPress={() => setDialogOpen(true)}
          style={{
            position: 'absolute',
            flexDirection: 'row',
            top: 20,
            right: 20,
            borderRadius: 50,
            // backgroundColor: 'rgba(0,0,0,0.5)',
          }}
        >
          <Ionicons name='log-out-outline' size={30} color='#fff' />
        </TouchableOpacity>

        <Dialog.Container visible={dialogOpen}>
          <Dialog.Title>Log out</Dialog.Title>
          <Dialog.Description>Do you want to log out?</Dialog.Description>
          <Dialog.Button label='Cancel' onPress={() => setDialogOpen(false)} />
          <Dialog.Button
            label='Log out'
            onPress={async () => {
              await signOut();
              setDialogOpen(false);
            }}
          />
        </Dialog.Container>
        <FlatList
          data={calls}
          keyExtractor={(item) => item.id}
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
          renderItem={({ item }) => {
            const memberCount = item.state.participantCount;
            return (
              <TouchableOpacity
                key={item.id}
                onPress={() => handleJoinRoom(item.id)}
                disabled={memberCount == 0}
                style={{
                  padding: 20,
                  backgroundColor: memberCount === 0 ? '#f1f1f1' : '#fff',
                  opacity: memberCount === 0 ? 0.5 : 1,
                  borderBottomWidth: 1,
                  borderBottomColor: memberCount === 0 ? '#fff' : '#f1f1f1',
                  flexDirection: 'row',

                  alignItems: 'center',
                  gap: 10,
                }}
              >
                {memberCount === 0 ? (
                  <Feather name='phone-off' size={24} color='gray' />
                ) : (
                  <Feather name='phone-call' size={24} color='gray' />
                )}
                <Image
                  source={{ uri: item.state.createdBy?.image }}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    resizeMode: 'cover',
                    marginRight: 10,
                    borderWidth: 1,
                    borderColor: '#f1f1f1',
                  }}
                />

                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                >
                  <View style={{}}>
                    <Text>
                      {item.state.createdBy?.name ||
                        item.state.createdBy?.custom.email.split('@')[0]}
                    </Text>
                    <Text style={{ fontSize: 12 }}>
                      {item.state.createdBy?.custom.email}
                    </Text>
                  </View>
                </View>
                <View>
                  <Text
                    style={{ fontSize: 10, textAlign: 'right', width: 100 }}
                  >
                    {formatSlug(item.id)}
                  </Text>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  {memberCount === 0 ? (
                    <Text
                      style={{
                        fontSize: 10,
                        fontWeight: 'bold',
                        color: 'blue',
                      }}
                    >
                      Call Ended
                    </Text>
                  ) : (
                    <View
                      style={{
                        flexDirection: 'row',
                        borderRadius: 5,
                        backgroundColor: 'green',
                        alignItems: 'center',
                        borderWidth: 1,
                        borderColor: '#f1f1f1',
                      }}
                    >
                      <Entypo
                        name='users'
                        size={14}
                        color='blue'
                        style={{ marginRight: 5 }}
                      />
                      <Text
                        style={{
                          fontSize: 10,
                          fontWeight: 'bold',
                          color: 'white',
                          padding: 5,
                        }}
                      >
                        {memberCount}
                      </Text>
                    </View>
                  )}
                </View>
                {/* <Text>{item.id}</Text> */}
              </TouchableOpacity>
            );
          }}
        />
      </SafeAreaView>
    </LinearGradientContainer>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
    color: '#fff',
  },
});
