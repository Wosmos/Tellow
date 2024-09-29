import { Link } from 'expo-router';
import { StyleSheet, View, Text,  } from 'react-native';
import React from 'react';


export default function NotFoundScreen() {
  return (
    <>
      {/* <Stack.Screen options={{ title: 'Oops!' }} /> */}
      <View style={styles.container}>
        <Text style={styles.title}>404</Text>
        <Text style={styles.subtitle}>This is not the web page you are looking for!</Text>
        <Link href='/' style={styles.link}>
          <Text style={styles.text}>Go to home screen</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  text: {
    fontSize: 18,
    color: '#2e78b7',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 30,
  },
  subtitle: {
    fontSize: 18,
    color: 'gray',
  },
});
