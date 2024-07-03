import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Button, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import KennelService from '../services/KennelService';

const AddChargingRatesScreen = ({ route, navigation }) => {
  const { kennelId } = route.params || { kennelId: "" };
  const [paymentRates, setPaymentRates] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const getTokenAndFetchData = async () => {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        getKennelById(kennelId, token);
      } else {
        navigation.navigate("Login");
      }
    };
    getTokenAndFetchData();
  }, [kennelId, navigation]);

  const getKennelById = async (id, token) => {
    try {
      const data = await KennelService.getKennelById(id, token);
      setPaymentRates(data.paymentRates || []);
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  const addRates = async () => {
    const formattedRates = paymentRates.map(rate => ({
      animalType: rate.animalType,
      rate: parseFloat(rate.rate)
    }));

    if (formattedRates.some(rate => isNaN(rate.rate) || !rate.animalType || rate.rate === '')) {
      setError('All fields are required and rates must be numbers.');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('token');
      const data = {
        kennelId,
        paymentRates: formattedRates
      };
      const response = await KennelService.addRates(data, token);
      navigation.navigate("AgentHome", { kennelID: kennelId });
      setPaymentRates([{ animalType: '', rate: '' }]);
    } catch (error) {
      console.error('Error:', error.message);
      setError("Failed to save payment rates");
    }
  };

  const handleAddField = () => {
    setPaymentRates([...paymentRates, { animalType: '', rate: '' }]);
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
        <Text style={styles.header}>Add Payment Rates</Text>
        {error && <Text style={styles.error}>{error}</Text>}
        {paymentRates.map((rate, index) => (
          <View key={index} style={styles.rateContainer}>
            <TextInput
              style={styles.input}
              placeholder="Animal Type"
              value={rate.animalType}
              onChangeText={(value) => handleInputChange(index, 'animalType', value)}
            />
            <TextInput
              style={styles.input}
              placeholder="Payment Rate"
              value={rate.rate.toString()}
              onChangeText={(value) => handleInputChange(index, 'rate', value)}
              keyboardType="numeric"
            />
            <Button title="Remove" onPress={() => handleRemoveField(index)} />
          </View>
        ))}
        <Button title="Add More" onPress={handleAddField} />
        <Button title="Add Payment Rates" onPress={addRates} />
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

export default AddChargingRatesScreen;
