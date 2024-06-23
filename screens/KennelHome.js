import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, Image } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import KennelService from '../services/KennelService';

const KennelHome = ({ route, navigation }) => {
  const { kennelID } = route.params;
  const [kennelData, setKennelData] = useState([]);

  useEffect(() => {
    console.log("kennel id ", kennelID);
    const getToken = async () => {
      const token = await AsyncStorage.getItem("token");
      const userId = await AsyncStorage.getItem("userId");
      if (token) {
        // Token exists, fetch kennels and user data
        getKennelById(kennelID, token);
      } else {
        // Token doesn't exist, navigate to Login screen
        console.log("Please login");
        navigation.navigate("Login");
      }
    };
    getToken();
  }, []);

  const toggleNavbar = () => {
    setIsCollapsed(!isCollapsed);
  };

  //get kennel by id
  const getKennelById = async (id, token) => {
    // call get kennel by id function
    try {
      const data = await KennelService.getKennelById(id, token);
      console.log("kennel data:", data);
      setKennelData(data);
    } catch (error) {
      // Handle error
      console.error("Error:", error.message);
    }
  };


  const updateData = () => {
    console.log('navigate to update kennel screen');
    navigation.navigate("UpdateKennelDataScreen",{kennelId:kennelID});
  };

  const viewReviews = () => {
    console.log('navigate to reviews screen');
    navigation.navigate("KennelReviewScreen",{kennelId:kennelID});
  };

  const viewBooking=()=>{
    console.log('navigate to booking screen');
    navigation.navigate("KennelBookingScreen",{kennelId:kennelID});
  }


  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        

        <Text style={styles.header}>Home</Text>

        <View style={styles.user_header}>
          <Image
            source={{
              uri:
                kennelData.images && kennelData.images.length > 0
                  ? kennelData.images[0]
                  : '',
            }}
            style={styles.logo}
          />

          <Text style={styles.title}>{kennelData.kennelName}</Text>
          <Text style={styles.location}>
            {kennelData.kennelAddress
              ? `${kennelData.kennelAddress.address1}, ${kennelData.kennelAddress.address2}, ${kennelData.kennelAddress.city},${kennelData.kennelAddress.zipCode}.`
              : "Address not available"}
          </Text>
          <Text>Owner Name: {kennelData.ownerName}</Text>
          <Text>Owner Email: {kennelData.ownerEmail}</Text>
          <Text>Owner Phone: {kennelData.ownerPhone}</Text>
          <Text>Payment Rates: {kennelData.paymentRates}</Text>
        </View>

        <ScrollView horizontal style={styles.imagesContainer}>
          {kennelData.images &&
            Array.isArray(kennelData.images) &&
            kennelData.images.map((image, index) => (
              <Image key={index} source={{ uri: image }} style={styles.image} />
            ))}
        </ScrollView>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.button}>

            <Text style={styles.buttonText} onPress={updateData}>Change Details</Text>

          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Notifications</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText} onPress={viewBooking}>Booking</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText} onPress={viewReviews}>Reviews</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 60,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#FFFFFF',
    marginBottom: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  location: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 20,
  },
  user_header: {
    alignItems: 'center',
    marginTop: 20,
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  detailContainer: {
    flex: 1,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  role: {
    fontSize: 14,
    color: '#666',
  },
  detail: {
    fontSize: 12,
    color: '#999',
  },
  buttonsContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  button: {
    backgroundColor: 'black',
    padding: 10,
    width: '80%',
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  buttonSmall: {
    backgroundColor: '#E0E0E0',
    padding: 8,
    borderRadius: 5,
    marginBottom: 5,
  },
  buttonSmallBlue: {
    backgroundColor: '#007BFF',
    padding: 8,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 12,
    color: 'white',
    fontWeight: 'bold',
  },
  buttonTextWhite: {
    fontSize: 12,
    color: '#FFF',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 50, // Add margin to avoid overlap with the menu icon
  },
  sidebar: {
    position: 'absolute',
    width: 200,
    height: '100%',
    backgroundColor: '#2C3E50',
    paddingTop: 20,
    left: 0,
    top: 0,
  },
  navItem: {
    padding: 10,
    color: 'white',
    fontWeight: 'bold',
  },
  menuIcon: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 2,
  },
  closeIcon: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 2,
  },
  imagesContainer: {
    marginVertical: 20,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 10,
    marginRight: 10,
  },
});

export default KennelHome;
