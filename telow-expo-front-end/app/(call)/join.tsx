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
  import { SafeAreaView } from 'react-native-safe-area-context';
  import LinearGradientContainer from '@/components/LinearGradient';
  import { Colors } from '@/constants/Colors';
  import styles from '@/constants/styles';

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
      <LinearGradientContainer
        colors={Colors.bgGradient}
        direction='bottomLeftToTopRight'
      >
        <SafeAreaView style={styles.container}>
          <Text style={[styles.title, { textAlign: 'center' }]}>
            Enter the Room name
          </Text>
          <TextInput
            style={styles.input}
            placeholder='Join Room'
            value={roomId}
            onChangeText={setRoomId}
          />
          <TouchableOpacity style={styles.button} onPress={handleJoinRoom}>
            <Text style={styles.buttonText}>Join Room</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </LinearGradientContainer>
    );
  }
