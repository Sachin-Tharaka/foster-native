import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import AuthenticationService from '../services/AuthenticationService';
AuthenticationService

const SaveNewPasswordScreen = ({ navigation, route }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const { email, verificationCode } = route.params;

  const handleSave = async() => {
    setError('');
     if(password.length < 8 && password) {
        setError('Password should have atleaset 8 digits');
        return;

    }
    else if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }else{
        try {
            console.log(email,password,verificationCode);
            const response = await AuthenticationService.savePasswordForForget(email,password,verificationCode);
      
      console.log('Response', response);
     if(response.status=="Success"){
      console.warn('navigate to login screen');
    navigation.navigate('Login' );
     }else{
      setError('Invalid Verification code');
      console.warn('Invalid Verification code');
    navigation.navigate('VerificationScreenForSaveNewPassword',{email} );
     }    
          }catch (error) {
            // Handle verification error 
            console.error('Invalid emaail address:', error.message);
            setError('Invalid Verification code');
    navigation.navigate('VerificationScreenForSaveNewPassword',{email} );
          }
    }

  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Save New Password</Text>
      <TextInput
        placeholder="New Password"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />
      <TextInput
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        style={styles.input}
        secureTextEntry
      />
      {error && <Text style={styles.error}>{error}</Text>}
      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 5,
    width: '80%',
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    width: 150,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  error: {
    color: 'red',
    marginTop: 5,
    marginBottom: 10,
  },
});

export default SaveNewPasswordScreen;
