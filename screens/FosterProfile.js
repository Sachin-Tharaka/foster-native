import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Navbar from "../components/Navbar";
import KennelService from "../services/KennelService";
import ChatService from "../services/ChatService";

const FosterProfile = ({ route, navigation }) => {
  const { kennelId } = route.params;
  const [kennelData, setKennelData] = useState({
    images: [],
    paymentRates: [],
  });

  useEffect(() => {
    getKennelById(kennelId);
  }, []);

  //get kennel by id
  const getKennelById = async (id) => {
    // call get kennel by id function
    try {
      const data = await KennelService.getKennelById(id);
      console.log("kennel data:", data);
      setKennelData(data);
    } catch (error) {
      // Handle error
      console.error("Error:", error.message);
    }
  };

  // Handle book a foster house
  const handleBookFosterHouse = async () => {
    navigation.navigate("Booking", { kennelID: kennelId });
  };

  const viewReviews = () => {
    navigation.navigate("KennelReviewsForUserScreen", { kennelId: kennelId });
  };

  const messageKennel = async () => {
    const token = await AsyncStorage.getItem("token");
    const userId = await AsyncStorage.getItem("userId");
    const volunteerId = "";
    if (token != null) {
      const res = ChatService.getChatThreadByUserAndKennel(
        token,
        userId,
        kennelId
      );
      console.warn("response: ", res);
      if (!res) {
        //create chat
        const data = await ChatService.createChatThread(
          token,
          userId,
          kennelId,
          volunteerId
        );
        navigation.navigate("ChatScreenUser", { chatId: data.chatThreadId });
      } else {
        //if chat exist
        navigation.navigate("ChatScreenUser", { chatId: res.chatThreadId });
      }
    } else {
      navigation.navigate("Landing");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={
            kennelData.profileImage ? { uri: kennelData.profileImage } : null
          }
          style={styles.logo}
        />
        <Text style={styles.title}>{kennelData.kennelName}</Text>
        <Text style={styles.location}>
          {kennelData.kennelAddress
            ? `${kennelData.kennelAddress.address1}, ${kennelData.kennelAddress.address2}, ${kennelData.kennelAddress.city}.`
            : "Address not available"}
        </Text>
      </View>
      <View style={styles.paymentRatesContainer}>
        <Text style={styles.sectionTitle}>Payment Rates</Text>
        {kennelData.paymentRates.map((rate, index) => (
          <View key={index} style={styles.rateRow}>
            <Text style={styles.rateText}>
              {rate.animalType}: ${rate.rate}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button} onPress={handleBookFosterHouse}>
          <Text style={styles.buttonText}>Book A Fostering</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={viewReviews}>
          <Text style={styles.buttonText}>Reviews</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={messageKennel}>
          <Text style={styles.buttonText}>Message</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.petsContainer}>
        {kennelData.images.map(
          (image, index) =>
            index % 2 === 0 && (
              <View key={index} style={styles.petRow}>
                <Image source={{ uri: image }} style={styles.petImage} />
                {index + 1 < kennelData.images.length && (
                  <Image
                    source={{ uri: kennelData.images[index + 1] }}
                    style={styles.petImage}
                  />
                )}
              </View>
            )
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: 60,
  },
  header: {
    alignItems: "center",
    marginTop: 20,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
  },
  location: {
    fontSize: 16,
    color: "gray",
    marginBottom: 20,
    textAlign: "center",
  },
  buttonsContainer: {
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
    color: "white",
    fontWeight: "bold",
  },
  petsContainer: {
    width: "90%",
    marginBottom: 10,
    margin: "auto",
  },
  petRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  petImage: {
    width: "50%",
    height: 150,
    margin: 5,
  },
  paymentRatesContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: "center", // Center horizontally
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  rateRow: {
    flexDirection: "row",
    justifyContent: "center", // Center horizontally
    marginBottom: 10,
  },
  rateText: {
    fontSize: 16,
  },
});

export default FosterProfile;
