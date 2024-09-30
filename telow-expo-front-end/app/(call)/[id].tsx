import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import {
  Call,
  CallingState,
  StreamCall,
  useStreamVideoClient,
} from '@stream-io/video-react-native-sdk';
import { useLocalSearchParams } from 'expo-router';
import Room from '@/components/Room';
import { generateSlug } from 'random-word-slugs';
import Toast from 'react-native-root-toast';
import { copySlug } from '../lib/slugs';

export default function CallScreen() {
  const { id } = useLocalSearchParams();
  const [call, setCall] = useState<Call | null>(null);
  const client = useStreamVideoClient();
  const [slug, setSlug] = useState<string | null>(null);

  useEffect(() => {
    let slug: string;

    if (id !== '(call)' && id) {
      //joining an existing call
      slug = id.toString();
      const _call = client?.call('default', slug);
      _call?.join({ create: false }).then(() => {
        setCall(_call);
      });
    } else {
      // slug = 'demo room';
      slug = generateSlug(3, {
        categories: {
          adjective: ['color', 'personality', 'appearance'],
          noun: ['animals', 'place', 'thing'],
        },
      });

      //creating a new call
      const _call = client?.call('default', slug);
      _call?.join({ create: true }).then(() => {
        // have a toast pop up here

        Toast.show(
          `Call created successfully \n Tap here to copy the call Id to share `,
          {
            duration: Toast.durations.LONG,
            position: Toast.positions.CENTER,
            shadow: true,
            animation: true,
            hideOnPress: true,
            delay: 0,
            onPress: async () => {
              copySlug(slug);
            },
          }
        );
        setCall(_call);
      });
    }
    setSlug(slug);
  }, [id, client]);
  useEffect(() => {
    if (call?.state.callingState !== CallingState.LEFT) {
      call?.leave();
    }
  }, [call]);

  if (!call || !slug) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size='large' />
      </View>
    );
  }

  return (
    <StreamCall call={call}>
      <Text
        style={{
          fontSize: 20,
          fontWeight: 'bold',
          textAlign: 'center',
          marginTop: 20,
        }}
      >
        CallScreen
      </Text>
      <Room slug={slug} />
    </StreamCall>
  );
}

const styles = StyleSheet.create({});
