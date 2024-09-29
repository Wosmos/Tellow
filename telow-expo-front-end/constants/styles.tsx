import { StyleSheet } from 'react-native';

const Authstyles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    padding: 20,
    gap: 10
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#f8faff',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 20,
    color: '#333333',
  },

  form: {
    width: '100%',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 10,
    
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    padding: 15,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  signupContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  signupText: {
    fontSize: 16,
    color: '#5e9dea',
  },
  signupLink: {
    marginLeft: 5,
  },
  signupLinkText: {
    fontSize: 16,
    color: '#b6d9fe',
    fontWeight: 'bold',
  },
  signInContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  signInText: {
    fontSize: 16,
    color: '#e4e9ff',
  },
  signInLink: {
    marginLeft: 5,
  },
  signInLinkText: {
    fontSize: 16,
    color: '#ddedff',
    fontWeight: 'bold',
  },
});
export default Authstyles;
