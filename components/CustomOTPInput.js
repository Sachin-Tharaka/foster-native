import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';


function CustomOTPInput({ length, onComplete }) {
  const [otp, setOtp] = useState(Array(length).fill(''));

  const handleOTPChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (index < length - 1 && text !== '') {
      // Move focus to the next input
      otpInputsRefs[index + 1].focus();
    }

    if (newOtp.every((digit) => digit !== '')) {
      const otpValue = newOtp.join('');
      onComplete(otpValue);
    }
  };

  // Create an array to store refs for each input
  const otpInputsRefs = Array(length).fill(null).map(() => React.createRef());

  return (
    <View style={styles.otpInput}>
      {otp.map((digit, index) => (
        <TextInput
          key={index}
          ref={otpInputsRefs[index]}
          style={styles.otpDigit}
          onChangeText={(text) => handleOTPChange(text, index)}
          value={digit}
          keyboardType="numeric"
          maxLength={1}
        />
      ))}
    </View>
  );
}
const styles = StyleSheet.create({
    otpInput: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    otpDigit: {
      width: 50,
      height: 50,
      borderWidth: 1,
      textAlign: 'center',
      fontSize: 20,
    },
  });
  
export default CustomOTPInput;
