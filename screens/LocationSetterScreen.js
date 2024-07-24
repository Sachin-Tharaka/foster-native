import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import * as Location from 'expo-location';

const GOOGLE_MAPS_API_KEY = 'AIzaSyBlzB96dEoYVpv_cZ79JqxOKvuYjE9uuB8';

const LocationSetterScreen = ({ navigation, route }) => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const { setLocation,existingLocation } = route.params;

  useEffect(() => {
    console.log("existing ",existingLocation);
    (async () => {
      if(existingLocation.latitude!=null){
        console.log("existing....");
 setSelectedLocation(existingLocation);
      }else{
        console.log("not existing....");
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      const currentLocation = {
        label: 'Current Location',
        latitude,
        longitude,
      };
      setCurrentLocation(currentLocation);
      setSelectedLocation(currentLocation);
    }
    })();
  }, []);

  const reverseGeocode = async (latitude, longitude) => {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`
    );
    const data = await response.json();
    if (data.results && data.results.length > 0) {
      return data.results[0].formatted_address;
    }
    return 'Selected Location';
  };

  const handlePlaceSelect = (data, details) => {
    const label = details.formatted_address; // Use formatted_address for the label
    const { lat: latitude, lng: longitude } = details.geometry.location;
    const location = {
      label,
      latitude,
      longitude,
    };
    setSelectedLocation(location);
    console.log(location);
  };
  

  const handleSaveLocation = () => {
    if (selectedLocation) {
      setLocation(selectedLocation);
      navigation.goBack();
    }
  };

  const handleMapPress = async (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    const locationName = await reverseGeocode(latitude, longitude);
    const location = { label: locationName, latitude, longitude };
    setSelectedLocation(location);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Select Location</Text>
      <GooglePlacesAutocomplete
  placeholder='Enter Location'
  fetchDetails
  onPress={handlePlaceSelect}
  query={{
    key: GOOGLE_MAPS_API_KEY,
    language: 'en',
  }}
  styles={{
    textInput: styles.input,
    predefinedPlacesDescription: styles.predefinedPlacesDescription,
  }}
  currentLocation={true}
  currentLocationLabel="Current Location"
  GooglePlacesDetailsQuery={{ fields: 'geometry,formatted_address' }} // Ensure formatted_address is included
/>

      <MapView
        style={styles.map}
        initialRegion={{
          latitude: currentLocation ? currentLocation.latitude : 37.78825,
          longitude: currentLocation ? currentLocation.longitude : -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        region={
          selectedLocation
            ? {
                latitude: selectedLocation.latitude,
                longitude: selectedLocation.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }
            : undefined
        }
        onPress={handleMapPress}
      >
        {selectedLocation && (
          <Marker coordinate={selectedLocation} />
        )}
      </MapView>
      {selectedLocation && (
        <TouchableOpacity onPress={handleSaveLocation} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save Location</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#ffffff',
    marginTop: 60,
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
    marginBottom: 20,
  },
  map: {
    flex: 1,
    marginBottom: 10,
  },
  saveButton: {
    padding: 10,
    backgroundColor: 'green',
    borderRadius: 5,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default LocationSetterScreen;
