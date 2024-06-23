import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, ScrollView, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PetsService from '../services/PetsService';
import * as ImagePicker from 'expo-image-picker';

const AddPetScreen = ({ navigation }) => {
  const [petType, setPetType] = useState('');
  const [petName, setPetName] = useState('');
  const [petAddress1, setPetAddress1] = useState('');
  const [petAddress2, setPetAddress2] = useState('');
  const [petCity, setPetCity] = useState('');
  const [petZip, setPetZip] = useState('');
  const [petAge, setPetAge] = useState('');
  const [petWeight, setPetWeight] = useState('');
  const [petBreed, setPetBreed] = useState('');
  const [petMediConditions, setPetMediConditions] = useState('');
  const [petVaccinationStatus, setPetVaccinationStatus] = useState('');
  const [kasl_regNo, setKasl_regNo] = useState('');
  const [images, setImages] = useState([]);
  const [error, setError] = useState('');

  const addNewPet = async () => {
    console.log('adding new pet....');
    const age = parseInt(petAge);
    const weight = parseFloat(petWeight);

    if (isNaN(age) || isNaN(weight)) {
      setError('Age and weight must be numbers');
      return;
    }

    if (!petType || !petName || !petAddress1 || !petCity || !petZip || !age || !weight || !petBreed || !petMediConditions || !petVaccinationStatus || !kasl_regNo || images.length === 0) {
      setError('All fields are required, including at least one image');
      return;
    }

    console.log('petImages:', images);

    try {
      const token = await AsyncStorage.getItem('token');
      const ownerId = await AsyncStorage.getItem('userId');

      const formData = new FormData();
      formData.append('petType', petType);
      formData.append('petName', petName);
      formData.append('petAddress1', petAddress1);
      formData.append('petAddress2', petAddress2);
      formData.append('petCity', petCity);
      formData.append('petZip', petZip);
      formData.append('petAge', age.toString());
      formData.append('petWeight', weight.toString());
      formData.append('petBreed', petBreed);
      formData.append('petMediConditions', petMediConditions);
      formData.append('petVaccinationStatus', petVaccinationStatus);
      formData.append('ownerId', ownerId);
      formData.append('KASL_regNo', kasl_regNo);

      images.forEach((image, index) => {
        formData.append('petImages', {
          uri: image.uri,
          name: `image_${index}.jpg`,
          type: 'image/jpeg',
        });
      });

      console.log('Calling backend...');
      const response = await PetsService.addNewPet(formData, token);
      console.log('pet data: ', response);
      console.log("navigate to pet screen");
        navigation.navigate('PetsScreen');
    //   if (response==null) {
    //     setError("Failed to add new pet");
    //   } else {
    //     console.log("navigate to pet screen");
    //     navigation.navigate('PetsScreen');
    //   }

      setPetType('');
      setPetName('');
      setPetAddress1('');
      setPetAddress2('');
      setPetCity('');
      setPetZip('');
      setPetAge('');
      setPetWeight('');
      setPetBreed('');
      setPetMediConditions('');
      setPetVaccinationStatus('');
      setKasl_regNo('');
      setImages([]);
    } catch (error) {
      console.error('Error:', error.message);
      setError("Failed to add new pet");
    }
  };

  const pickImages = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      base64: false,
    });

    if (!result.canceled) {
      setImages([...images, ...result.assets]);
    }
  };

  const removeImage = (index) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.header}>Add New Pet</Text>
        {error && <Text style={styles.error}>{error}</Text>}
        <TextInput style={styles.input} placeholder="Pet Type" value={petType} onChangeText={setPetType} />
        <TextInput style={styles.input} placeholder="Pet Name" value={petName} onChangeText={setPetName} />
        <TextInput style={styles.input} placeholder="Pet Address Line 1" value={petAddress1} onChangeText={setPetAddress1} />
        <TextInput style={styles.input} placeholder="Pet Address Line 2" value={petAddress2} onChangeText={setPetAddress2} />
        <TextInput style={styles.input} placeholder="Pet City" value={petCity} onChangeText={setPetCity} />
        <TextInput style={styles.input} placeholder="Pet Zip" value={petZip} onChangeText={setPetZip} />
        <TextInput style={styles.input} placeholder="Pet Age" value={petAge} onChangeText={setPetAge} keyboardType="numeric" />
        <TextInput style={styles.input} placeholder="Pet Weight" value={petWeight} onChangeText={setPetWeight} keyboardType="numeric" />
        <TextInput style={styles.input} placeholder="Pet Breed" value={petBreed} onChangeText={setPetBreed} />
        <TextInput style={styles.input} placeholder="Medical Conditions" value={petMediConditions} onChangeText={setPetMediConditions} />
        <TextInput style={styles.input} placeholder="Vaccination Status" value={petVaccinationStatus} onChangeText={setPetVaccinationStatus} />
        <TextInput style={styles.input} placeholder="KASL Registration Number" value={kasl_regNo} onChangeText={setKasl_regNo} />

        <Button title="Choose Images" onPress={pickImages} />
        <View style={styles.imageContainer}>
          {images.map((image, index) => (
            <View key={index} style={styles.imageWrapper}>
              <Image source={{ uri: image.uri }} style={styles.image} />
              <TouchableOpacity onPress={() => removeImage(index)} style={styles.removeButton}>
                <Text style={styles.removeButtonText}>Remove</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
        <Button title="Add Pet" onPress={addNewPet} />
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
  },
  error: {
    color: 'red',
    marginTop: 5,
    marginBottom: 10,
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  imageWrapper: {
    position: 'relative',
    margin: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 5,
  },
  removeButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 5,
    borderRadius: 5,
  },
  removeButtonText: {
    color: 'white',
    fontSize: 12,
  },
});

export default AddPetScreen;
