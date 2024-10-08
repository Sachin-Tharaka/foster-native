import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import KennelService from "../services/KennelService";

const KennelHome = ({ route, navigation }) => {
  const { kennelID } = route.params;
  const [kennelData, setKennelData] = useState([]);

  useEffect(() => {
    console.log("Kennel ID: ", kennelID);
    const getToken = async () => {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        getKennelById(kennelID, token);
      } else {
        console.log("Please login");
        navigation.navigate("Login");
      }
    };
    getToken();
  }, []);

  const getKennelById = async (id, token) => {
    try {
      const data = await KennelService.getKennelById(id, token);
      console.log("Kennel data:", data);
      setKennelData(data);
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  const updateData = () => {
    console.log("Navigate to update kennel screen");
    navigation.navigate("UpdateKennelDataScreen", { kennelId: kennelID });
  };

  const viewReviews = () => {
    console.log("Navigate to reviews screen");
    navigation.navigate("KennelReviewScreen", { kennelId: kennelID });
  };

  const viewBooking = () => {
    console.log("Navigate to booking screen");
    navigation.navigate("KennelBookingScreen", { kennelId: kennelID });
  };

  const addChargingRates = () => {
    console.log("Navigate to charging rates screen");
    navigation.navigate("AddKennelChargingRatesScreen", { kennelId: kennelID });
  };

  const handleKennelChats = () => {
    console.log("Navigate to charging rates screen");
    navigation.navigate("ChatListAgent", { kennelId: kennelID });
  };

  const handleDeleteKennel = () => {
    Alert.alert(
      "Delete Kennel",
      "Are you sure you want to delete this kennel?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => deleteKennel(),
        },
      ],
      { cancelable: false }
    );
  };

  const deleteKennel = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await KennelService.delete(kennelID, token);
      console.log("Kennel deleted:", response);
      navigation.navigate("MyKennelsScreen");
    } catch (error) {
      console.error("Error deleting kennel:", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.user_header}>
          <Image
            source={
              kennelData.profileImage ? { uri: kennelData.profileImage } : null
            }
            style={styles.logo}
          />

          <Text style={styles.title}>{kennelData.kennelName}</Text>
          <Text style={styles.location}>
            {kennelData.kennelAddress
              ? `${kennelData.kennelAddress.address1}, ${kennelData.kennelAddress.address2}, ${kennelData.kennelAddress.city},${kennelData.kennelAddress.zipCode}.`
              : "Address not available"}
          </Text>
          <View style={styles.paymentRatesContainer}>
            {kennelData.paymentRates && kennelData.paymentRates.length > 0 ? (
              <View>
                <Text style={styles.paymentRatesTitle}>Payment Rates:</Text>
                {kennelData.paymentRates.map((rate, index) => (
                  <Text key={index} style={styles.paymentRate}>
                    {rate.animalType}: {rate.rate}
                  </Text>
                ))}
              </View>
            ) : (
              <Text style={styles.noPaymentRatesText}>
                No payment rates available
              </Text>
            )}
          </View>
        </View>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.button} onPress={updateData}>
            <Text style={styles.buttonText}>Change Details</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={viewBooking}>
            <Text style={styles.buttonText}>Bookings</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={viewReviews}>
            <Text style={styles.buttonText}>Reviews</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={addChargingRates}>
            <Text style={styles.buttonText}>Add Charging Rates</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleDeleteKennel}>
            <Text style={styles.buttonText}>Delete Kennel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleKennelChats}>
            <Text style={styles.buttonText}>View Kennel Chats</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal style={styles.imagesContainer}>
          {kennelData.images &&
            Array.isArray(kennelData.images) &&
            kennelData.images.map((image, index) => (
              <Image key={index} source={{ uri: image }} style={styles.image} />
            ))}
        </ScrollView>
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  location: {
    fontSize: 16,
    color: "gray",
    marginBottom: 20,
  },
  user_header: {
    alignItems: "center",
    marginTop: 20,
  },
  buttonsContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-around",
    marginVertical: 20,
  },
  button: {
    backgroundColor: "black",
    padding: 10,
    width: "80%",
    alignItems: "center",
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 12,
    color: "white",
    fontWeight: "bold",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: 50,
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
  paymentRatesContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  paymentRatesTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  paymentRate: {
    fontSize: 16,
    color: "gray",
  },
});

export default KennelHome;
