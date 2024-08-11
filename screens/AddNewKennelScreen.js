import React, { useState,useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Button, ScrollView, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import KennelService from '../services/KennelService';
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as Location from 'expo-location';


const AddNewKennelScreen = ({ navigation }) => {
  const [kennelName, setKennelName] = useState('');
  const [kennelAddress1, setKennelAddress1] = useState('');
  const [kennelAddress2, setKennelAddress2] = useState('');
  const [kennelCity, setKennelCity] = useState('');
  const [kennelZip, setKennelZip] = useState('');
  const [longitude, setLongitude] = useState('');
  const [latitude, setLatitude] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [images, setImages] = useState([]);
  const [error, setError] = useState('');
  const [selectedLocation, setSelectedLocation] = useState({});

  useEffect(() => {

  const getCurrentLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      const geocode = await Location.reverseGeocodeAsync({ latitude, longitude });
      const address = geocode[0];
      const locationLabel = `${address.city}, ${address.region}, ${address.country}`;

      setSelectedLocation({
        latitude,
        longitude,
        label: locationLabel
      });
    } catch (error) {
      console.error("Error getting location:", error);
    }
  };

  getCurrentLocation();
}, []);

  const addNewKennel = async () => {
    console.warn('location ',selectedLocation);
    setError('');
    const kennelLongitude = selectedLocation.longitude;
    const kennelLatitude = selectedLocation.latitude;
   console.warn(kennelName ,kennelAddress1 ,kennelAddress2 ,kennelCity ,kennelZip ,kennelLongitude,kennelLatitude ,images.length ,profileImage)
    if (!kennelName || !kennelAddress1 || !kennelAddress2 || !kennelCity || !kennelZip || !kennelLongitude || !kennelLatitude || images.length === 0 || !profileImage) {
      setError('All fields are required, including profile image and at least one additional image');
      return;
    }

    console.log('images:', images);

    try {
      const token = await AsyncStorage.getItem('token');
      const ownerId = await AsyncStorage.getItem('userId');

      const formData = new FormData();
      formData.append('kennelName', kennelName);
      formData.append('kennelAddress1', kennelAddress1);
      formData.append('kennelAddress2', kennelAddress2);
      formData.append('kennelCity', kennelCity);
      formData.append('kennelZip', kennelZip);
      formData.append('kennelLongitude', kennelLongitude.toString());
      formData.append('kennelLatitude', kennelLatitude.toString());
      formData.append('ownerId', ownerId);

      formData.append('profileImage', {
        uri: profileImage.uri,
        name: 'profile_image.jpg',
        type: 'image/jpeg',
      });

      images.forEach((image, index) => {
        formData.append('images', {
          uri: image.uri,
          name: `image_${index}.jpg`,
          type: 'image/jpeg',
        });
      });

      console.log('Calling backend...');
      const response = await KennelService.addNewKennel(formData, token);
      console.log('data: ', response);
      console.log("navigate to all screen");
      navigation.navigate('MyKennelsScreen');

      setKennelName('');
      setKennelAddress1('');
      setKennelAddress2('');
      setKennelCity('');
      setKennelZip('');
      setLatitude('');
      setLongitude('');
      setProfileImage(null);
      setImages([]);
    } catch (error) {
      console.error('Error:', error.message);
      setError("Failed to add new kennel");
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

  const pickProfileImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: false,
      base64: false,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0]);
    }
  };

  const removeImage = (index) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
  };

  const goToChangeLocation = async () => {
    console.log("existing location: ", selectedLocation);
    navigation.navigate("LocationSetterScreen", {
      setLocation: setSelectedLocation,
      existingLocation: selectedLocation,
    });
    console.log(selectedLocation);
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.header}>Add New Kennel</Text>
        {error && <Text style={styles.error}>{error}</Text>}
        <TextInput style={styles.input} placeholder="Kennel Name" value={kennelName} onChangeText={setKennelName} />
        <TextInput style={styles.input} placeholder=" Address Line 1" value={kennelAddress1} onChangeText={setKennelAddress1} />

        <TextInput style={styles.input} placeholder=" Address Line 2" value={kennelAddress2} onChangeText={setKennelAddress2} />
        <TextInput style={styles.input} placeholder="City" value={kennelCity} onChangeText={setKennelCity} />
        <TextInput style={styles.input} placeholder="Zip" value={kennelZip} onChangeText={setKennelZip} />
        <View style={styles.locationContainer}>
          <View style={styles.locationDetails}>
            <View style={styles.locationIcon}>
              <Icon name='map-marker' size={32} color='#333' />
            </View>
            <TouchableOpacity style={styles.locationText} onPress={goToChangeLocation}>
              <Text style={styles.address}>{selectedLocation.label || 'Set Location'}</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.changeButton} onPress={goToChangeLocation}>
            <Text style={styles.changeButtonText}>Select location</Text>
          </TouchableOpacity>
        </View>
        <Button title="Choose Profile Image" onPress={pickProfileImage} />
        {profileImage && (
          <View style={styles.profileImageWrapper}>
            <Image source={{ uri: profileImage.uri }} style={styles.profileImage} />
          </View>
        )}
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
        <Button title="Add Kennel" onPress={addNewKennel} />
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
  profileImageWrapper: {
    alignItems: 'center',
    marginVertical: 10,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
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
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#f2f2f2',
    padding: 10,
    borderRadius: 5,
  },
  locationDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  locationIcon: {
    marginRight: 10,
  },
  locationText: {
    flex: 1,
  },
  address: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  addressDetails: {
    fontSize: 14,
    color: '#666',
  },
  changeButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
  },
  changeButtonText: {
    color: '#fff',
    fontSize: 14,
  },
});

export default AddNewKennelScreen;
