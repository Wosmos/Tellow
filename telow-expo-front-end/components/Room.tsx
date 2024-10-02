import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { CallContent } from '@stream-io/video-react-native-sdk';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { router, useRouter } from 'expo-router';
import { copySlug, formatSlug } from '@/app/lib/slugs';
export default function room({ slug }: { slug: string }) {
  const router = useRouter();
  return (
    <View style={{ flex: 1 }}>
      <View>
        <RoomId slug={slug} />
      </View>
      <GestureHandlerRootView
        style={{
          flex: 1,
        }}
      >
        <CallContent onHangupCallHandler={() => router.back()} />
      </GestureHandlerRootView>
    </View>
  );
}

const RoomId = ({ slug }: { slug: string | null }) => {
  return (
    <TouchableOpacity onPress={() => copySlug(slug)}>
      <Text>Call ID : {formatSlug(slug)}</Text>
    </TouchableOpacity>
  );
};
