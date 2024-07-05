import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import VolunteerService from "../services/VounteerService";

const VolunteerScreen = ({ navigation }) => {
  const [volunteerId, setVolunteerId] = useState("");
  const [volunteer, setVolunteer] = useState({});

  useEffect(() => {
    const getToken = async () => {
      const token = await AsyncStorage.getItem("token");
      const userId = await AsyncStorage.getItem("userId");
      if (token) {
        // Token exists, fetch volunteer data
        getVolunteerByUserId(userId, token);
      } else {
        // Token doesn't exist, navigate to Login screen
        console.log("Please login");
        navigation.navigate("Login");
      }
    };
    getToken();
  }, [navigation]);

  const getVolunteerByUserId = async (id, token) => {
    try {
      const data = await VolunteerService.getVolunteerByUserId(id, token);
      console.log("volunteer data:", data);
      setVolunteer(data);
      setVolunteerId(data.volunteerId);
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  // Navigate to update screen
  const handleEditProfile = () => {
    console.log("navigate to update profile screen");
    navigation.navigate("UpdateVolunteerProfileScreen", { volunteerId });
  };

  const openChat = () => {
    // Handle chat functionality here
  };

  const viewReview = () => {
    navigation.navigate("VolunteerReview", { volunteerId });
  };

  const viewBooking = () => {
    navigation.navigate("VolunteerBooking", { volunteerId });
  };

  const addPetTypes = () => {
    navigation.navigate("AddPetTypesToVolunteerProfileScreen", { volunteerId });
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete this account?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "Yes", onPress: () => deleteVolunteerAccount() },
      ],
      { cancelable: false }
    );
  };

  const deleteVolunteerAccount = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await VolunteerService.delete(volunteerId, token);
      console.log("response ", response);
      console.log("Volunteer account deleted");
      navigation.navigate("UserAccount");
    } catch (error) {
      console.error("Error deleting account:", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handleEditProfile}>
        <Text style={styles.buttonText}>Edit Account</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={viewReview}>
        <Text style={styles.buttonText}>View Review</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={viewBooking}>
        <Text style={styles.buttonText}>View Booking</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={openChat}>
        <Text style={styles.buttonText}>Open Chat</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={addPetTypes}>
        <Text style={styles.buttonText}>Add Pet Types</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleDeleteAccount}>
        <Text style={styles.buttonText}>Delete Account</Text>
      </TouchableOpacity>

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
          <Text>Nic NO: {volunteer.nicNumber}</Text>
          {volunteer.paymentRates && (
            <View>
              <Text>Animal Types:</Text>
              {volunteer.paymentRates.map((rate, index) => (
                <Text key={index}>{rate.animalType}</Text>
              ))}
            </View>
          )}
        </View>
      </View>

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
    marginTop: 100,
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
    marginBottom: 5,
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
  },
  images: {
    flexDirection: "row",
    flexWrap: "wrap",
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

export default VolunteerScreen;
