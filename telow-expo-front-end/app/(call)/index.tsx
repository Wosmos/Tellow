import { SignedIn, SignedOut, useAuth, useUser } from '@clerk/clerk-expo';
import { Link } from 'expo-router';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradientContainer from '@/components/LinearGradient';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import Dialog from 'react-native-dialog';
export default function Page() {
  const { user } = useUser();
  const { signOut } = useAuth();

  const [dialogOpen, setDialogOpen] = React.useState(false);
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
        <View>
          <Dialog.Container visible={dialogOpen}>
            <Dialog.Title>Sign Out</Dialog.Title>
            <Dialog.Description>
              Are you sure you want Sign Out?
            </Dialog.Description>
            <Dialog.Button
              label='Cancel'
              onPress={() => setDialogOpen(false)}
            />
            <Dialog.Button
              label='Sign Out'
              onPress={async () => {
                await signOut();
                setDialogOpen(false);
              }}
            />
          </Dialog.Container>
        </View>

        <SignedIn>
          <Text style={styles.text}>Welcome to Tele mr </Text>

          <Link href='/(auth)/sign-in' style={styles.link}>
            <Text style={styles.text}>Sign In</Text>
          </Link>
        </SignedIn>

        <SignedOut>
          <Text style={styles.text}>Welcome to Tele</Text>
          <Link href='/(auth)/sign-in' style={styles.link}>
            <Text style={styles.text}>Sign Up</Text>
          </Link>
        </SignedOut>
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
