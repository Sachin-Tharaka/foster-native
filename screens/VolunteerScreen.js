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

const VolunteerScreen = ({ route, navigation }) => {
  const { volunteerId } = route.params || { volunteerId: "" };
  const [volunteer, setVolunteer] = useState([]);

  useEffect(() => {
    const getToken = async () => {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        // Token exists, fetch pet data
        getVolunteerById(volunteerId, token);
      } else {
        // Token doesn't exist, navigate to Login screen
        console.log("Please login");
        navigation.navigate("Login");
      }
    };
    getToken();
  }, [navigation]);

  //get pet by id
  const getVolunteerById = async (id, token) => {
    // call get pets by userid function
    try {
      const data = await VounteerService.getVolunteerDataById(id, token);
      console.log("volunteer data:", data);
      setVolunteer(data);
    } catch (error) {
      // Handle error
      console.error("Error:", error.message);
    }
  };


  //navigate to update screen
  const handleEditProfile =async()=>{
    console.log("navigate to update profile screen");
    navigation.navigate("UpdateVolunteerProfileScreen", { volunteerId: volunteerId });
  }

  const openChat=async()=>{

  }

  const viewReview=async()=>{
    navigation.navigate("VolunteerReview", { volunteerId: volunteerId });
  }

  const viewBooking=async()=>{
    navigation.navigate("VolunteerBooking", { volunteerId: volunteerId });
  }
  
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
