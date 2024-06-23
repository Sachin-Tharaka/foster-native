import React, { useState,useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Button, ScrollView, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import KennelService from '../services/KennelService';
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/FontAwesome';

const UpdateKennelDataScreen = ({ route, navigation }) => {

  const { kennelId } = route.params || { kennelId: "" };
    
  const [kennelName, setKennelName] = useState('');
  const [kennelAddress1, setKennelAddress1] = useState('');
  const [kennelAddress2, setKennelAddress2] = useState('');
  const [kennelCity, setKennelCity] = useState('');
  const [kennelZip, setKennelZip] = useState('');
  const [longitude, setLongitude] = useState(0);
  const [latitude, setLatitude] = useState(0);
  const [images, setImages] = useState([]);
  const [error, setError] = useState('');
  const [selectedLocation, setSelectedLocation] = useState({});


  useEffect(() => {
    const getToken = async () => {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        // Token exists, fetch pet data
        getKennelById(kennelId, token);
      } else {
        // Token doesn't exist, navigate to Login screen
        console.log("Please login");
        navigation.navigate("Login");
      }
    };
    getToken();
  }, [navigation]);

  const getKennelById = async (id, token) => {
    try {
      const data = await KennelService.getKennelById(id, token);
      console.log("kennel data:", data);

      // Ensure data is converted to string if necessary
      setKennelName(data.kennelName || '');
      setKennelAddress1(data.kennelAddress?.address1 || '');
      setKennelAddress2(data.kennelAddress?.address2 || '');
      setKennelCity(data.kennelAddress?.city || '');
      setKennelZip(data.kennelAddress?.zipCode.toString() || '');
      setLongitude(data.kennelLocation?.coordinates[0].toString() || '');
      setLatitude(data.kennelLocation?.coordinates[1].toString()|| '');
     

      // Check if petImages is an array of objects with uri property
      const imageUris = (data.images || []).map(image => {
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

  const updateKennel = async () => {
    console.log('update kennel....');
    
    

    if (!kennelName || !kennelAddress1 || !kennelAddress2 || !kennelCity || !kennelZip || !longitude || !latitude || images.length === 0) {
      setError('All fields are required, including at least one image');
      return;
    }

    console.log('images:', images);

    try {
      const token = await AsyncStorage.getItem('token');
      const ownerId = await AsyncStorage.getItem('userId');

      const formData = new FormData();
      formData.append('kennelId', kennelId);
      formData.append('kennelName', kennelName);
      formData.append('kennelAddress1', kennelAddress1);
      formData.append('kennelAddress2', kennelAddress2);
      formData.append('kennelCity', kennelCity);
      formData.append('kennelZip', kennelZip);
      formData.append('kennelLongitude', longitude.toString());
      formData.append('kennelLatitude', latitude.toString());
     formData.append('ownerId', ownerId);


      images.forEach((image, index) => {
        formData.append('images', {
          uri: image.uri,
          name: `image_${index}.jpg`,
          type: 'image/jpeg',
        });
      });

      console.log('Calling backend...');
      const response = await KennelService.updateKennel(formData, token);
      console.log(' data: ', response);
      console.log("navigate to all screen");
        navigation.navigate('MyKennelsScreen');
    //   if (response==null) {
    //     setError("Failed to add new kennel");
    //   } else {
    //     console.log("navigate to kennel screen");
    //     navigation.navigate('MyKennelsScreen');
    //   }

      
    } catch (error) {
      console.error('Error:', error.message);
      setError("Failed to update kennel");
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

  const goToChangeLocation = async() => {
    navigation.navigate('LocationSetterScreen', { setLocation: setSelectedLocation });
    console.log(selectedLocation);
    setLatitude( selectedLocation.latitude);
    setLongitude(selectedLocation.longitude);
    
  };
  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.header}>Update Kennel</Text>
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
          <TouchableOpacity
            style={styles.locationText}
            onPress={goToChangeLocation}
          >
            <Text style={styles.address}>{selectedLocation.label || 'Set Location'}</Text>
            <Text style={styles.addressDetails}>
              {latitude} {longitude}
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.changeButton} onPress={goToChangeLocation}>
          <Text style={styles.changeButtonText}>Select location</Text>
        </TouchableOpacity>
        
      </View>
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
        <Button title="Update Kennel" onPress={updateKennel} />
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
    color: '#888',
  },
  changeButton: {
    padding: 10,
    backgroundColor: 'blue',
    borderRadius: 5,
    alignItems:'center',
    justifyContent:'center'
  },
  changeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    alignItems:'center'
  },
});

export default UpdateKennelDataScreen;
