import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, TextInput } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

const LocationSetterScreen = ({ navigation, route }) => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [locationText, setLocationText] = useState('');
  const { setLocation } = route.params;

  const handlePlaceSelect = (data, details) => {
    const { name } = data;
    const { lat: latitude, lng: longitude } = details.geometry.location;
    const location = {
      label: name,
      latitude,
      longitude,
    };
    setSelectedLocation(location);
    handleSaveLocation(location);
  };

  const handleSaveLocation = (location) => {
    if (location) {
      setLocation(location);
      navigation.goBack();
    }
  };

  const handleMapPress = (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    const location = { label: locationText || 'Selected Location', latitude, longitude };
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
              key: 'AIzaSyBlzB96dEoYVpv_cZ79JqxOKvuYjE9uuB8',
              language: 'en',
            }}
            styles={{
              textInput: styles.input,
              predefinedPlacesDescription: styles.predefinedPlacesDescription,
            }}
        />
        <MapView
            style={styles.map}
            onPress={handleMapPress}
        >
          {selectedLocation && (
              <Marker coordinate={selectedLocation} />
          )}
        </MapView>
        {selectedLocation && (
            <TouchableOpacity onPress={() => handleSaveLocation(selectedLocation)} style={styles.saveButton}>
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
