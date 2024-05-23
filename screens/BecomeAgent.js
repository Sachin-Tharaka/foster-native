import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const BecomeAgent = ({ navigation }) => {
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [role, setRole] = useState('');

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Become an agent</Text>
      <TextInput
        style={styles.input}
        placeholder="Perera's heaven"
        value={name}
        onChangeText={setName}
      />
      <Picker
        selectedValue={city}
        onValueChange={(itemValue, itemIndex) => setCity(itemValue)}
        style={styles.picker}
        mode="dropdown"
      >
        <Picker.Item label="Colombo" value="colombo" />
        <Picker.Item label="Another City" value="anotherCity" />
      </Picker>
      <Picker
        selectedValue={role}
        onValueChange={(itemValue, itemIndex) => setRole(itemValue)}
        style={styles.picker}
        mode="dropdown"
      >
        <Picker.Item label="Volunteer" value="volunteer" />
        <Picker.Item label="Coordinator" value="coordinator" />
      </Picker>
      <TouchableOpacity style={styles.button} onPress={() => console.log('Setup!')}>
        <Text style={styles.buttonText}>SETUP</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    marginTop:60
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center'
  },
  input: {
    fontSize: 18,
    borderWidth: 1,
    borderColor: 'black',
    padding: 10,
    marginBottom: 20
  },
  picker: {
    fontSize: 18,
    borderWidth: 1,
    borderColor: 'black',
    padding: 10,
    marginBottom: 20
  },
  button: {
    backgroundColor: 'black',
    padding: 15,
    alignItems: 'center',
    borderRadius: 5
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold'
  }
});

export default BecomeAgent;
