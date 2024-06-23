import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BookingService from '../services/BookingService';

const KennelBookingScreen = ({ route, navigation }) => {
  const { kennelId } = route.params || { kennelId: "" };
  const [bookingData, setBookingData] = useState([]);

  useEffect(() => {
    const getToken = async () => {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        getBookingByKennelId(kennelId, token);
      } else {
        console.log("Please login");
        navigation.navigate("Login");
      }
    };
    getToken();
  }, [navigation]);

  const getBookingByKennelId = async (id, token) => {
    try {
      const data = await BookingService.getBookingByKennelId(id, token);
      console.log("booking data:", data);
      setBookingData(data);
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  const handleOwnerProfileClick = (ownerId) => {
    navigation.navigate("CustomerProfile", { customerId: ownerId });
  };

  const handlePetProfileClick = (petId) => {
    navigation.navigate("CustomerPetProfileScreen", { petID: petId });
  };

  //confirm
  const handleChangeStatusToConfrm = async (bookingId) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        await BookingService.confirmBooking(bookingId,  token);
        getBookingByKennelId(kennelId, token); // Refresh the booking data
      }
    } catch (error) {
      console.error("Error updating status:", error.message);
    }
  };

  //reject
  const handleChangeStatusToReject = async (bookingId) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        await BookingService.rejectBooking(bookingId,  token);
        getBookingByKennelId(kennelId, token); // Refresh the booking data
      }
    } catch (error) {
      console.error("Error updating status:", error.message);
    }
  };

  //change to ongoing
  const handleChangeStatusToOngoing = async (bookingId) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        await BookingService.changeBookingStatusToOngoing(bookingId,  token);
        getBookingByKennelId(kennelId, token); // Refresh the booking data
      }
    } catch (error) {
      console.error("Error updating status:", error.message);
    }
  };

  //change to confirm
  const handleChangeStatusToCompleted= async (bookingId) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        await BookingService.changeBookingStatusToCompleted(bookingId,  token);
        getBookingByKennelId(kennelId, token); // Refresh the booking data
      }
    } catch (error) {
      console.error("Error updating status:", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <Text style={styles.header}>Bookings</Text>
        {bookingData.map((booking) => (
          <View key={booking.bookingID} style={styles.itemContainer}>
            <View style={styles.detailContainer}>
              <Text style={styles.name}>Start Date: {new Date(booking.startDate).toLocaleString()}</Text>
              <Text style={styles.detail}>End Date: {new Date(booking.endDate).toLocaleString()}</Text>
              <Text style={styles.detail}>Status: {booking.status}</Text>
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.buttonSmallBlue}
                onPress={() => handleOwnerProfileClick(booking.ownerID)}
              >
                <Text style={styles.buttonTextWhite}>View Owner Profile</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.buttonSmallBlue}
                onPress={() => handlePetProfileClick(booking.petID)}
              >
                <Text style={styles.buttonTextWhite}>View Pet Profile</Text>
              </TouchableOpacity>
              {booking.status === 'PENDING' && (
                <>
                  <TouchableOpacity
                    style={styles.buttonSmallGreen}
                    onPress={() => handleChangeStatusToConfrm(booking.bookingID)}
                  >
                    <Text style={styles.buttonTextWhite}>Confirm</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.buttonSmallRed}
                    onPress={() => handleChangeStatusToReject(booking.bookingID)}
                  >
                    <Text style={styles.buttonTextWhite}>Reject</Text>
                  </TouchableOpacity>
                </>
              )}
              {booking.status === 'CONFIRM' && (
                <TouchableOpacity
                  style={styles.buttonSmallOrange}
                  onPress={() => handleChangeStatusToOngoing(booking.bookingID)}
                >
                  <Text style={styles.buttonTextWhite}>Change to Ongoing</Text>
                </TouchableOpacity>
              )}
              {booking.status === 'ONGOING' && (
                <TouchableOpacity
                  style={styles.buttonSmallPurple}
                  onPress={() => handleChangeStatusToCompleted(booking.bookingID)}
                >
                  <Text style={styles.buttonTextWhite}>Change to Completed</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}
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
  detailContainer: {
    flex: 1,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  detail: {
    fontSize: 14,
    color: '#666',
  },
  buttonContainer: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  buttonSmallBlue: {
    backgroundColor: '#007BFF',
    padding: 8,
    borderRadius: 5,
    marginBottom: 5,
  },
  buttonSmallGreen: {
    backgroundColor: '#28A745',
    padding: 8,
    borderRadius: 5,
    marginBottom: 5,
  },
  buttonSmallRed: {
    backgroundColor: '#DC3545',
    padding: 8,
    borderRadius: 5,
    marginBottom: 5,
  },
  buttonSmallOrange: {
    backgroundColor: '#FFC107',
    padding: 8,
    borderRadius: 5,
    marginBottom: 5,
  },
  buttonSmallPurple: {
    backgroundColor: '#6F42C1',
    padding: 8,
    borderRadius: 5,
    marginBottom: 5,
  },
  buttonTextWhite: {
    fontSize: 12,
    color: '#FFF',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 50,
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
});

export default KennelBookingScreen;
