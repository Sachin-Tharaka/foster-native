import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Button, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import VounteerService from '../services/VounteerService';

const AddPetTypesToVolunteerProfileScreen = ({ route, navigation }) => {
  const { volunteerId } = route.params || { volunteerId: "" };
  const [paymentRates, setPaymentRates] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const getTokenAndFetchData = async () => {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        console.log("volunteer id"+volunteerId);
        getVolunteerById(volunteerId, token);
      } else {
        navigation.navigate("Login");
      }
    };
    getTokenAndFetchData();
  }, [volunteerId, navigation]);

  const getVolunteerById = async (id, token) => {
    try {
      const data = await VounteerService.getVolunteerById(id, token);
      setPaymentRates(data.paymentRates || []);
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  const addRates = async () => {
    const formattedRates = paymentRates.map(rate => ({
      animalType: rate.animalType,
      rate: 0 // Set the default rate to 0
    }));

    if (formattedRates.some(rate => !rate.animalType)) {
      setError('All fields are required.');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('token');
      const data = {
        volunteerId,
        paymentRates: formattedRates
      };
      const response = await VounteerService.addRates(data, token);
      navigation.navigate("VolunteerScreen");
      setPaymentRates([{ animalType: '' }]);
    } catch (error) {
      console.error('Error:', error.message);
      setError("Failed to save pet types");
    }
  };

  const handleAddField = () => {
    setPaymentRates([...paymentRates, { animalType: '' }]);
  };

  const handleRemoveField = (index) => {
    const updatedRates = paymentRates.filter((_, i) => i !== index);
    setPaymentRates(updatedRates);
  };

  const handleInputChange = (index, name, value) => {
    const updatedRates = paymentRates.map((rate, i) => {
      if (i === index) {
        return { ...rate, [name]: value };
      }
      return rate;
    });
    setPaymentRates(updatedRates);
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.header}>Add Pet Types</Text>
        {error && <Text style={styles.error}>{error}</Text>}
        {paymentRates.map((rate, index) => (
          <View key={index} style={styles.rateContainer}>
            <TextInput
              style={styles.input}
              placeholder="Animal Type"
              value={rate.animalType}
              onChangeText={(value) => handleInputChange(index, 'animalType', value)}
            />
            <Button title="Remove" onPress={() => handleRemoveField(index)} />
          </View>
        ))}
        <Button title="Add More" onPress={handleAddField} />
        <Button title="Save Pet Types" onPress={addRates} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#ffffff',
    marginTop: 100,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  error: {
    color: 'red',
    marginTop: 5,
    marginBottom: 10,
  },
  rateContainer: {
    marginBottom: 20,
  },
});

export default AddPetTypesToVolunteerProfileScreen;
