import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const ResetPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  
  const [emailError, setEmailError] = useState('');
  
  //reset password
  const handleReset = () => {
    setEmailError('');
   
    
    const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!email) {
      setEmailError('Email is required.');
      return;
    } else if (!regex.test(email)) {
      setEmailError('Please enter a valid email address.');
      return;
    } 

    // Call the reset passowrd function

    
  };

//resend email
const handleResend =()=>{
    //call resend email function
}


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Email Address"
        onChangeText={(text) => setEmail(text)}
        value={email}
      />
      {emailError && <Text style={styles.error}>{emailError}</Text>}
      

      <TouchableOpacity style={styles.button} onPress={handleReset}>
        <Text style={styles.buttonText}>Send reset link</Text>
      </TouchableOpacity>
      
      <Text>
  Didn't get the Email?{' '}
  <Text style={styles.resend} onPress={handleResend}>
    Resend
  </Text>
</Text>
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
    width: '80%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 0,
    marginTop: 20,
    padding: 10,
    borderRadius: 4,

  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    width: '80%',
    marginTop: 30,
    marginBottom: 10,
    borderRadius: 20

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
  
  resend: {
    color: 'blue',
  },
});

export default ResetPasswordScreen;
