import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Button, ScrollView, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import PetsService from "../services/PetsService";

const UpdatePetProfileScreen = ({ route, navigation }) => {
  const { petID } = route.params || { petID: "" };

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

  useEffect(() => {
    const getToken = async () => {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        // Token exists, fetch pet data
        getPetById(petID, token);
      } else {
        // Token doesn't exist, navigate to Login screen
        console.log("Please login");
        navigation.navigate("Login");
      }
    };
    getToken();
  }, [navigation]);

  const getPetById = async (id, token) => {
    try {
      const data = await PetsService.getPetById(id, token);
      console.log("pet data:", data);

      // Ensure data is converted to string if necessary
      setPetType(data.petType || '');
      setPetName(data.petName || '');
      setPetAddress1(data.petAddress?.address1 || '');
      setPetAddress2(data.petAddress?.address2 || '');
      setPetCity(data.petAddress?.city || '');
      setPetZip(data.petAddress?.zipCode?.toString() || '');
      setPetAge(data.petAge?.toString() || '');
      setPetWeight(data.petWeight?.toString() || '');
      setPetBreed(data.petBreed || '');
      setPetMediConditions(data.petMediConditions || '');
      setPetVaccinationStatus(data.petVaccinationStatus || '');
      setKasl_regNo(data.kasl_regNo || '');

      // Check if petImages is an array of objects with uri property
      const imageUris = (data.petImages || []).map(image => {
        if (typeof image === 'string') {
          return { uri: image };
        } else if (image.uri) {
          return { uri: image.uri };
        }
        return null;
      }).filter(Boolean);

      setImages(imageUris);
      console.log("images:", imageUris);

    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  const updateData = async () => {
    console.log('updating....');
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
      formData.append('petID', petID);
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
      const response = await PetsService.updatePetProfile(formData, token);
      console.log('pet data: ', response);
      console.log("navigate to pet profile screen");
      navigation.navigate("PetProfileScreen", { petID: petID });

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
        <Text style={styles.header}>Update Pet Profile</Text>
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
        <Button title="Update" onPress={updateData} />
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
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  imageWrapper: {
    position: 'relative',
    marginRight: 10,
    marginBottom: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  removeButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: 5,
    borderRadius: 10,
  },
  removeButtonText: {
    fontSize: 12,
    color: 'red',
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
});

export default UpdatePetProfileScreen;
