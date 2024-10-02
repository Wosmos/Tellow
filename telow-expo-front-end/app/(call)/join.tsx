import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from 'react-native';
import React, { useState } from 'react';
import { inverseFormatSlug } from '../lib/slugs';
import { useStreamVideoClient } from '@stream-io/video-react-native-sdk';
import { useRouter } from 'expo-router';
import Toast from 'react-native-root-toast';

export default function join() {
  const [roomId, setRoomId] = useState('');
  const client = useStreamVideoClient();
  const router = useRouter();

  const handleJoinRoom = async () => {
    if (!roomId) return;

    const slug = inverseFormatSlug(roomId);

    const call = client?.call('default', await slug);
    call
      ?.get()
      .then((callResponse) => {
        console.log(callResponse);
        router.push(`/(call)${slug}`);
      })
      .catch((reason) => {
        console.log(reason.message);
        Toast.show(
          'Looks like room you are looking to join does not exist 🥲 ',
          {
            duration: Toast.durations.LONG,
            position: Toast.positions.CENTER,
            shadow: true,
          }
        );
      });
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 20,
        gap: 20,
      }}
    >
      <Text
        style={{
          fontSize: 20,
          fontWeight: 'bold',
          color: '#000',
          textAlign: 'center',
          marginBottom: 20,
        }}
      >
        Enter the Room name
      </Text>
      <TextInput
        style={{
          width: '100%',
          height: 50,
          borderWidth: 1,
          borderColor: '#ccc',
          borderRadius: 5,
          padding: 10,
          fontSize: 16,
        }}
        placeholder='Join Room'
        value={roomId}
        onChangeText={setRoomId}
      />
      <TouchableOpacity
        style={{
          backgroundColor: '#000',
          padding: 10,
          borderRadius: 5,
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onPress={handleJoinRoom}
      ></TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({});
