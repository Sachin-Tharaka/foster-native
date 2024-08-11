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
import VounteerService from "../services/VounteerService";

const VolunteerProfileScreen = ({ route, navigation }) => {
  const { volunteerId } = route.params || { volunteerId: "" };
  const [volunteer, setVolunteer] = useState([]);

  useEffect(() => {

        getVolunteerById(volunteerId);

  }, [navigation]);

  //get pet by id
  const getVolunteerById = async (id) => {
    // call get pets by userid function
    try {
      const data = await VounteerService.getVolunteerDataById(id);
      console.log("volunteer data:", data);
      setVolunteer(data);
    } catch (error) {
      // Handle error
      console.error("Error:", error.message);
    }
  };

  const openChat = async () => {};

  const viewReview = async () => {
    navigation.navigate("VolunteerReviewForUser", { volunteerId: volunteerId });
  };

  const bookingVolunteer = async () => {
    const token = await AsyncStorage.getItem("token");
    if(token!=null) {
      navigation.navigate("Booking", {volunteerID: volunteerId});
    }
    else {
        navigation.navigate("Landing");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.petContainer}>
        <Image
          style={styles.petImage}
          source={
            volunteer.images && volunteer.images.length > 0
              ? { uri: volunteer.images[0] }
              : null
          }
        />
        <View>
          <Text>Name: {volunteer.volunteerName}</Text>
          <Text>Nic NO: {volunteer.nicNumber}</Text>
          <Text style={styles.location}>
            Address:
            {volunteer.volunteerAddress
              ? `${volunteer.volunteerAddress.address1}, ${volunteer.volunteerAddress.address2}, ${volunteer.volunteerAddress.city}.`
              : "Address not available"}
          </Text>
        </View>
        {volunteer.paymentRates && (
          <View>
            <Text>Animal Types:</Text>
            {volunteer.paymentRates.map((rate, index) => (
              <Text key={index}>{rate.animalType}</Text>
            ))}
          </View>
        )}
      </View>

      <TouchableOpacity style={styles.button} onPress={viewReview}>
        <Text style={styles.buttonText}>View Review</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={bookingVolunteer}>
        <Text style={styles.buttonText}>Book</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={openChat}>
        <Text style={styles.buttonText}>Message</Text>
      </TouchableOpacity>

      <ScrollView>
        <View style={styles.images}>
          {volunteer.images &&
            Array.isArray(volunteer.images) &&
            volunteer.images.map(
              (image, index) =>
                index % 2 === 0 && (
                  <View key={index} style={styles.petRow}>
                    <Image source={{ uri: image }} style={styles.image} />
                    {index + 1 < volunteer.images.length && (
                      <Image
                        source={{ uri: volunteer.images[index + 1] }}
                        style={styles.image}
                      />
                    )}
                  </View>
                )
            )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#ffffff",
    paddingTop: 60,
  },
  petImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    margin: "auto",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "black",
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
  },
  buttonText: {
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  petContainer: {
    paddingHorizontal: 10,
    paddingVertical: 20,
    margin: "auto",
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 5,
    marginBottom: 20,
  },
  images: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 20,
  },
  petRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
    margin: 5,
  },
});

export default VolunteerProfileScreen;
