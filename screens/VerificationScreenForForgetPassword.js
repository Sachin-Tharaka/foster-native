import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import CustomOTPInput from '../components/CustomOTPInput';

const VerificationScreenForForgetPassword = ({ navigation, route }) => {
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');

  const email = route.params.email;

  // Verification function
  const handleNext = async () => {
    console.warn("email:", email);
    console.warn('verification code: ', verificationCode);
    setError('');
    if (!verificationCode) {
      setError('Please enter verification code');
      return;
    } else if (verificationCode.length < 6 && verificationCode) {
      setError('Verification code should have 6 digits');
      return;
    } else {
      
        console.warn('navigate to save new password screen');
        navigation.navigate('SaveNewPasswordScreen', { email, verificationCode });
      
    }
  };

  // Resend email
  const handleResend = () => {
    // Call the resend email function
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Email Verification</Text>
      <Text>Enter the verification code we sent to your email address:</Text>
      <CustomOTPInput length={6} onComplete={(otp) => setVerificationCode(otp)} />
      {error && <Text style={styles.error}>{error}</Text>}
      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
      <Text>
        {' '}
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
    marginTop: 50,
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
  resend: {
    marginTop: 10,
    color: 'blue',
    textDecorationLine: 'underline',
    marginBottom: 100,
  },
  codeInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cell: {
    width: 40,
    height: 40,
    lineHeight: 40,
    fontSize: 24,
    borderWidth: 2,
    borderColor: 'black',
    textAlign: 'center',
  },
  cellFocused: {
    borderColor: 'blue',
  },
});

export default VerificationScreenForForgetPassword;
