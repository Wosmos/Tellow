// // import React, { useState } from 'react';
// // import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
// // import { Ionicons } from '@expo/vector-icons';
// // import style from '@/constants/styles';

// // interface PasswordInputProps {
// //   password: string;
// //   setPassword: (password: string) => void;
// //   placeholder?: string;
// // }

// // const PasswordInputWithEye: React.FC<PasswordInputProps> = ({
// //   password,
// //   setPassword,
// //   placeholder = 'Password...',
// // }) => {
// //   const [showPassword, setShowPassword] = useState(false);

// //   return (
// //     <View style={styles.container}>
// //       <TextInput
// //         value={password}
// //         placeholder={placeholder}
// //         secureTextEntry={!showPassword}
// //         onChangeText={setPassword}
// //         style={[styles.input, styles.input]}
// //       />
// //       <TouchableOpacity
// //         style={styles.eyeButton}
// //         onPress={() => setShowPassword(!showPassword)}
// //       >
// //         <Ionicons
// //           name={showPassword ? 'eye-off' : 'eye'}
// //           size={24}
// //           color='#e4e9ff'
// //         />
// //       </TouchableOpacity>
// //     </View>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: {
// //     position: 'relative',
// //   },
// //   input: {
// //     paddingRight: 50, // Make room for the eye icon
// //   },
// //   eyeButton: {
// //     position: 'absolute',
// //     right: 15,
// //     top: '50%',
// //     transform: [{ translateY: -12 }], // Half of the icon size
// //   },
// // });

// // export default PasswordInputWithEye;

// import React, { useState } from 'react';
// import {
//   View,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   Text,
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import style from '@/constants/styles';

// interface PasswordInputProps {
//   password: string;
//   setPassword: (password: string) => void;
//   placeholder?: string;
// }

// const PasswordInputWithEye: React.FC<PasswordInputProps> = ({
//   password,
//   setPassword,
//   placeholder = 'Password...',
// }) => {
//   const [showPassword, setShowPassword] = useState(false);

//   const getPasswordStrength = (
//     password: string
//   ): { strength: string; color: string } => {
//     if (password.length === 0) return { strength: '', color: 'transparent' };
//     if (password.length < 8) return { strength: 'Weak', color: '#ff4444' };

//     const hasLower = /[a-z]/.test(password);
//     const hasUpper = /[A-Z]/.test(password);
//     const hasNumber = /\d/.test(password);
//     const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

//     // const strength = hasLower + hasUpper + hasNumber + hasSpecial;
//     const strength =
//       (hasLower ? 1 : 0) +
//       (hasUpper ? 1 : 0) +
//       (hasNumber ? 1 : 0) +
//       (hasSpecial ? 1 : 0);

//     if (strength <= 2) return { strength: 'Medium', color: '#ffbb33' };
//     if (strength === 3) return { strength: 'Strong', color: '#00C851' };
//     return { strength: 'Very Strong', color: '#007E33' };
//   };

//   const passwordStrength = getPasswordStrength(password);

//   return (
//     <View style={styles.container}>
//       <View style={styles.inputContainer}>
//         <TextInput
//           secureTextEntry={!showPassword}
//           value={password}
//           onChangeText={setPassword}
//           placeholder={placeholder}
//           style={[style.input, styles.input]}
//         />
//         <TouchableOpacity
//           style={styles.eyeButton}
//           onPress={() => setShowPassword(!showPassword)}
//         >
//           <Ionicons
//             name={showPassword ? 'eye-off' : 'eye'}
//             size={24}
//             color='#666'
//           />
//         </TouchableOpacity>
//       </View>
//       {password.length > 0 && (
//         <View style={styles.strengthIndicator}>
//           <View
//             style={[
//               styles.strengthBar,
//               { backgroundColor: passwordStrength.color },
//             ]}
//           />
//           <Text style={styles.strengthText}>{passwordStrength.strength}</Text>
//         </View>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     width: '100%',
//   },
//   inputContainer: {
//     position: 'relative',
//   },
//   input: {
//     paddingRight: 50,
//   },
//   eyeButton: {
//     position: 'absolute',
//     right: 15,
//     top: '45%',
//     transform: [{ translateY: -12 }],
//   },
//   strengthIndicator: {
//     marginTop: 5,
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   strengthBar: {
//     height: 4,
//     flex: 1,
//     borderRadius: 2,
//   },
//   strengthText: {
//     marginLeft: 8,
//     fontSize: 12,
//     color: '#666',
//   },
// });

// export default PasswordInputWithEye;





import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { commonStyles } from '@/constants/styles';

interface PasswordInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  value,
  onChangeText,
  placeholder = 'Password',
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.container}>
      <TextInput
        style={[commonStyles.input, styles.input]}
        secureTextEntry={!showPassword}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor='#999'
      />
      <TouchableOpacity
        style={styles.eyeButton}
        onPress={() => setShowPassword(!showPassword)}
      >
        <Ionicons
          name={showPassword ? 'eye-off' : 'eye'}
          size={24}
          color='#999'
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '100%',
  },
  input: {
    paddingRight: 50,
  },
  eyeButton: {
    position: 'absolute',
    right: 16,
    top: '50%',
    transform: [{ translateY: -12 }],
  },
});

export default PasswordInput;