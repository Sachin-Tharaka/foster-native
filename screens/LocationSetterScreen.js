import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Navbar from '../components/Navbar';

const LocationSetterScreen = ({ navigation, route }) => {
  const [searchText, setSearchText] = useState('');
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const { setLocation } = route.params;

  useEffect(() => {
    // Initialize with some locations or fetch from an API
    setLocations([]);
  }, []);

  const filteredLocations = locations.filter(location => 
    location.label.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleLocationSelect = (location) => {
    setLocation(location);
    navigation.goBack();
  };

  const handleMapPress = (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setSelectedLocation({ label: 'Custom Location', latitude, longitude });
  };

  const handleSaveLocation = () => {
    if (selectedLocation) {
      setLocation(selectedLocation);
      navigation.goBack();
    }
  };

  const renderLocation = ({ item }) => (
    <TouchableOpacity onPress={() => handleLocationSelect(item)} style={styles.locationContainer}>
      <Text style={styles.locationLabel}>{item.label}</Text>
      <Text style={styles.locationAddress}>{item.address}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Search Location</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Type location name"
        value={searchText}
        onChangeText={setSearchText}
      />
      <FlatList
        data={filteredLocations}
        renderItem={renderLocation}
        keyExtractor={item => item.key}
      />
      <MapView
        style={styles.map}
        onPress={handleMapPress}
      >
        {selectedLocation && (
          <Marker coordinate={selectedLocation} />
        )}
      </MapView>
      <TouchableOpacity onPress={handleSaveLocation} style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Save Location</Text>
      </TouchableOpacity>
      <Navbar />
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
  searchInput: {
    height: 40,
    borderColor: '#cccccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  locationContainer: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
  },
  locationLabel: {
    fontSize: 18,
  },
  locationAddress: {
    fontSize: 14,
    color: '#666666',
  },
  map: {
    flex: 1,
    marginBottom: 10,
  },
  saveButton: {
    padding: 10,
    backgroundColor: 'blue',
    borderRadius: 5,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default LocationSetterScreen;