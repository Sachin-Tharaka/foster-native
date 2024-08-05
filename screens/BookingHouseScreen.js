import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Alert,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import Slider from "@react-native-community/slider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import KennelService from "../services/KennelService";
import UserService from "../services/UserService";
import VolunteerService from "../services/VounteerService";
import Navbar from "../components/Navbar";
import AnimalTypeDropdown from "../components/AnimalTypeDropdown";
import * as Location from 'expo-location';


const BookingHouseScreen = ({ navigation }) => {
  const [kennels, setKennels] = useState([]);
  const [volunteersData, setVolunteersData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState({});
  const [category, setCategory] = useState("all");
  const [maxDistance, setMaxDistance] = useState(10);
  const [animalType, setAnimalType] = useState("");

  useEffect(() => {
    const getToken = async () => {
      const token = await AsyncStorage.getItem("token");
      const userId = await AsyncStorage.getItem("userId");
      getAllKennel();
      getAllVolunteer();
      if (token) {
        getUserById(userId, token);
      }
    };

  const getCurrentLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      const geocode = await Location.reverseGeocodeAsync({ latitude, longitude });
      const address = geocode[0];
      const locationLabel = `${address.city}, ${address.region}, ${address.country}`;

      setSelectedLocation({
        latitude,
        longitude,
        label: locationLabel
      });
    } catch (error) {
      console.error("Error getting location:", error);
    }
  };

  getCurrentLocation();
  getToken();
}, []);


  const getAllKennelNear = async (
    longitude,
    latitude,
    maxDistance,
    animalType
  ) => {
    console.log("Calling for get near by kennels...");
    try {
      const data = await KennelService.getAllKennelNear(
        longitude,
        latitude,
        maxDistance,
        animalType
      );
      setKennels(data);
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  const getAllVolunteerNear = async (
    longitude,
    latitude,
    maxDistance,
    animalType
  ) => {
    console.log("Calling for get near by volunteer...");
    try {
      const data = await VolunteerService.getAllVolunteerNear(
        longitude,
        latitude,
        maxDistance,
        animalType
      );
      setVolunteersData(data);
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  const getUserById = async (id, token) => {
    try {
      const data = await UserService.getUserById(id, token);
      setUserData(data);
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  const goToChangeLocation = async () => {
    console.log("existing location: ", selectedLocation);
    navigation.navigate("LocationSetterScreen", {
      setLocation: setSelectedLocation,
      existingLocation: selectedLocation,
    });
    console.log(selectedLocation);
  };

  const getAllKennel = async () => {
    try {
      const data = await KennelService.getAllKennels();
      setKennels(data);
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  const getAllVolunteer = async () => {
    try {
      const data = await VolunteerService.getAllVolunteers();
      setVolunteersData(data);
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  const getAll = () => {
    setCategory("all");
  };

  const getProfessional = () => {
    setCategory("prop");
  };

  const getVolunteer = () => {
    setCategory("vol");
  };

  const filteredData = () => {
    if (category === "all") {
      return [...kennels, ...volunteersData];
    } else if (category === "prop") {
      return kennels;
    } else if (category === "vol") {
      return volunteersData;
    }
  };

  const searchData = async () => {
    if (!animalType) {
      Alert.alert("Error", "Please select an animal type");
      return;
    }

    const distanceInMeters = maxDistance * 1000;

    getAllKennelNear(
      selectedLocation.longitude,
      selectedLocation.latitude,
      distanceInMeters,
      animalType
    );
    getAllVolunteerNear(
      selectedLocation.longitude,
      selectedLocation.latitude,
      distanceInMeters,
      animalType
    );
  };

  const handleAnimalTypeChange = (type) => {
    setAnimalType(type);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Welcome, {userData.firstName}</Text>

      <View style={styles.locationContainer}>
        <View style={styles.locationDetails}>
          <View style={styles.locationIcon}>
            <Icon name="map-marker" size={32} color="#333" />
          </View>
          <TouchableOpacity
            style={styles.locationText}
            onPress={goToChangeLocation}
          >
            <Text style={styles.address}>
              {selectedLocation.label || "Set Location"}
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.changeButton}
          onPress={goToChangeLocation}
        >
          <Text style={styles.changeButtonText}>Change</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.sliderContainer}>
        <Text>Maximum Distance: {maxDistance} km</Text>
        <Slider
          style={styles.slider}
          minimumValue={10}
          maximumValue={200}
          step={1}
          value={maxDistance}
          onValueChange={(value) => setMaxDistance(value)}
          minimumTrackTintColor="#1EB1FC"
          maximumTrackTintColor="#d3d3d3"
          thumbTintColor="#1EB1FC"
        />
      </View>
      <AnimalTypeDropdown
        selectedAnimal={animalType}
        onAnimalTypeChange={handleAnimalTypeChange}
      />
      <View>
        <TouchableOpacity style={styles.changeButton} onPress={searchData}>
          <Text style={styles.changeButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={getAll}>
          <Text>All</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={getProfessional}>
          <Text>Kennels</Text>
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
                ? navigation.navigate("FosterProfile", {
                    kennelId: item.kennelId,
                  })
                : navigation.navigate("VolunteerProfileScreen", {
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
    backgroundColor: "#ffffff",
    paddingTop: 60,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    backgroundColor: "#f2f2f2",
    padding: 10,
    borderRadius: 5,
  },
  locationDetails: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  locationIcon: {
    marginRight: 10,
  },
  locationText: {
    flex: 1,
  },

  addressDetails: {
    fontSize: 14,
    color: "#888",
  },
  changeButton: {
    padding: 10,
    backgroundColor: "blue",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  changeButtonText: {
    color: "white",
    fontWeight: "bold",
    alignItems: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  button: {
    padding: 10,
    backgroundColor: "#ddd",
    borderRadius: 5,
    alignItems: "center",
    flex: 1,
    margin: 5,
  },
  list: {
    flex: 1,
  },
  entry: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#f9f9f9",
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
    fontWeight: "bold",
  },
  address: {
    fontSize: 14,
    color: "#888",
  },
  location: {
    fontSize: 14,
    color: "#888",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
  },
});

export default BookingHouseScreen;
