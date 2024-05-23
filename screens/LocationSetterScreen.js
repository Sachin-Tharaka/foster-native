import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity } from 'react-native';
import Navbar from '../components/Navbar';

const LocationSetterScreen = ({ navigation }) => {
  const [searchText, setSearchText] = useState('');
  const [locations, setLocations] = useState([
    { key: '1', label: 'Home', address: 'Kandy Road, Kelaniya' },
    { key: '2', label: 'Office', address: 'Kandy Road, Kelaniya' },
    { key: '3', label: 'Set location on map', address: '' }
  ]);

  const filteredLocations = locations.filter(location => 
    location.label.toLowerCase().includes(searchText.toLowerCase())
  );

  const renderLocation = ({ item }) => (
    <View style={styles.locationItem}>
      <View style={styles.iconContainer}>
        <Text style={styles.iconText}>📍</Text>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.locationLabel}>{item.label}</Text>
        {item.address ? <Text style={styles.locationAddress}>{item.address}</Text> : null}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="SEARCH"
          style={styles.searchInput}
          value={searchText}
          onChangeText={text => setSearchText(text)}
        />
      </View>
      <Text style={styles.savedPlacesText}>Saved places</Text>
      <FlatList
        data={filteredLocations}
        renderItem={renderLocation}
        keyExtractor={item => item.key}
      />
      <View> <Navbar /></View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    marginTop: 60,
  },
  searchContainer: {
    padding: 10,
    backgroundColor: '#f0f0f0'
  },
  searchInput: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10
  },
  savedPlacesText: {
    margin: 10,
    fontWeight: 'bold'
  },
  locationItem: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    backgroundColor: 'white',
    marginBottom: 2
  },
  iconContainer: {
    width: 40,
    height: 40,
    backgroundColor: 'lightblue',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  iconText: {
    fontSize: 20
  },
  textContainer: {
    marginLeft: 10
  },
  locationLabel: {
    fontWeight: 'bold'
  },
  locationAddress: {
    color: 'grey'
  }
});

export default LocationSetterScreen;
