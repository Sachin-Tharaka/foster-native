import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import KennelService from '../services/KennelService';
import UserService from '../services/UserService';
import VolunteerService from '../services/VounteerService';
import Navbar from '../components/Navbar';

const BookingHouseScreen = ({ navigation }) => {
  const [kennels, setKennels] = useState([]);
  const [volunteersData, setVolunteersData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState({});
  const [category, setCategory] = useState('all');
  const [maxDistance,setMaxDistance]=useState('');

  useEffect(() => {
    const getToken = async () => {
      const token = await AsyncStorage.getItem('token');
      const userId = await AsyncStorage.getItem('userId');
      if (token) {
        getUserById(userId, token);
       
          getAllKennel(token);
          getAllVolunteer(token);
        
      } else {
        navigation.navigate('Login');
      }
    };
    getToken();
  }, [selectedLocation]);

  const getAllKennelNear = async (longitude, latitude, maxDistance, token) => {
    console.log("Calling for get near by kennels...");
    try {
      const data = await KennelService.getAllKennelNear(longitude, latitude, maxDistance, token);
      setKennels(data);
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  const getAllVolunteerNear = async (longitude, latitude, maxDistance, token) => {
    console.log("Calling for get near by volunteer...");
    try {
      const data = await VolunteerService.getAllVolunteerNear(longitude, latitude, maxDistance, token);
      setVolunteersData(data);
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  const getUserById = async (id, token) => {
    try {
      const data = await UserService.getUserById(id, token);
      setUserData(data);
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  const goToChangeLocation = async() => {
    navigation.navigate('LocationSetterScreen', { setLocation: setSelectedLocation });
    console.log(selectedLocation);
    
  };

  const getAllKennel = async (token) => {
    try {
      const data = await KennelService.getAllKennels(token);
      setKennels(data);
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  const getAllVolunteer = async (token) => {
    try {
      const data = await VolunteerService.getAllVolunteers(token);
      setVolunteersData(data);
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  const getAll = () => {
    setCategory('all');
  };

  const getProfessional = () => {
    setCategory('prop');
  };

  const getVolunteer = () => {
    setCategory('vol');
  };

  const filteredData = () => {
    if (category === 'all') {
      return [...kennels, ...volunteersData];
    } else if (category === 'prop') {
      return kennels;
    } else if (category === 'vol') {
      return volunteersData;
    }
  };

  const searchData=async()=>{
    const token = await AsyncStorage.getItem('token');
    getAllKennelNear(selectedLocation.longitude, selectedLocation.latitude, maxDistance, token);
          getAllVolunteerNear(selectedLocation.longitude, selectedLocation.latitude, maxDistance, token);
        
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Welcome, {userData.firstName}</Text>

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
              {selectedLocation.latitude && selectedLocation.longitude
                ? `${selectedLocation.latitude}, ${selectedLocation.longitude}`
                : ''}
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.changeButton} onPress={goToChangeLocation}>
          <Text style={styles.changeButtonText}>Change</Text>
        </TouchableOpacity>
        
      </View>
  <View>
  <TextInput style={styles.input} placeholder="Enter Maximum Distance" value={maxDistance} onChangeText={setMaxDistance} keyboardType="numeric" />
  </View>
  <View><TouchableOpacity style={styles.changeButton} onPress={searchData}>
          <Text style={styles.changeButtonText}>Search</Text>
        </TouchableOpacity></View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={getAll}>
          <Text>All</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={getProfessional}>
          <Text>Professional</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={getVolunteer}>
          <Text>Volunteer</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.list}>
        {filteredData().map((item) => (
          <TouchableOpacity
            key={item.kennelId || item.volunteerId}
            style={styles.entry}
            onPress={() =>
              item.kennelId
                ? navigation.navigate('FosterProfile', {
                    kennelId: item.kennelId,
                  })
                : navigation.navigate('VolunteerProfileScreen', {
                    volunteerId: item.volunteerId,
                  })
            }
          >
            <Image source={{ uri: item.images[0] }} style={styles.image} />
            <View style={styles.infoContainer}>
              <Text style={styles.name}>
                {item.kennelName || item.volunteerName}
              </Text>
              <Text>
              {item.kennelAddress?.city || item.volunteerAddress?.city}
              </Text>
              
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  button: {
    padding: 10,
    backgroundColor: '#ddd',
    borderRadius: 5,
    alignItems: 'center',
    flex: 1,
    margin: 5,
  },
  list: {
    flex: 1,
  },
  entry: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  address: {
    fontSize: 14,
    color: '#888',
  },
  location: {
    fontSize: 14,
    color: '#888',
  },
  input:{
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    
  }
});

export default BookingHouseScreen;
