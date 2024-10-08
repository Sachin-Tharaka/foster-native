import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import VolunteerService from "../services/VounteerService";
import * as ImagePicker from "expo-image-picker";

const UpdateVolunteerScreen = ({ route, navigation }) => {
  const { volunteerId } = route.params || { volunteerId: "" };

  const [nicNo, setNicNo] = useState("");
  const [userId, setUserId] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [images, setImages] = useState([]);
  const [error, setError] = useState("");
  const [longitude, setLongitude] = useState(0);
  const [latitude, setLatitude] = useState(0);
  const [locationLabel, setLocationLabel] = useState("Set Location");
  const [selectedLocation, setSelectedLocation] = useState({});

  useEffect(() => {
    const getToken = async () => {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        getVolunteerById(volunteerId, token);
      } else {
        console.log("Please login");
        navigation.navigate("Login");
      }
    };
    getToken();
  }, [navigation]);

  useEffect(() => {
    if (longitude && latitude) {
      getAddressFromCoordinates(latitude, longitude);
    }
  }, [longitude, latitude]);

  const getVolunteerById = async (id, token) => {
    try {
      const data = await VolunteerService.getVolunteerDataById(id, token);
      setNicNo(data.nicNumber || "");
      setUserId(data.userId || "");
      setLongitude(data.volunteerLocation?.coordinates[0] || 0);
      setLatitude(data.volunteerLocation?.coordinates[1] || 0);
      const profileImageData = typeof data.profileImage === "string"
        ? { uri: data.profileImage }
        : data.profileImage;
      setProfileImage(profileImageData || null);


      const imageUris = (data.images || [])
        .map((image) =>
          typeof image === "string"
            ? { uri: image }
            : image.uri
            ? { uri: image.uri }
            : null
        )
        .filter(Boolean);
      setImages(imageUris);
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  const getAddressFromCoordinates = async (lat, lon) => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setError("Permission to access location was denied");
        return;
      }
      let reverseGeocode = await Location.reverseGeocodeAsync({
        latitude: lat,
        longitude: lon,
      });
      if (reverseGeocode.length > 0) {
        const address = reverseGeocode[0];
        setLocationLabel(
          `${address.street}, ${address.city}, ${address.region}, ${address.country}`
        );
      } else {
        setLocationLabel("Location not found");
      }
    } catch (error) {
      console.error("Error getting location label:", error);
    }
  };

  const updateVolunteer = async () => {
    console.warn(images.length);
    if (!nicNo || !longitude || !latitude || images.length === 0 || !profileImage) {
      setError("All fields are required, including at least one image and profile image");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("token");
      const formData = new FormData();
      formData.append("nicNumber", nicNo);
      formData.append("volunteerId", volunteerId);
      formData.append("userId", userId);
      formData.append("volunteerLongitude", longitude.toString());
      formData.append("volunteerLatitude", latitude.toString());

      if (profileImage) {
        formData.append("profileImage", {
          uri: profileImage.uri,
          name: "profile_image.jpg",
          type: "image/jpeg",
        });
      }

      images.forEach((image, index) => {
        formData.append("images", {
          uri: image.uri,
          name: `image_${index}.jpg`,
          type: "image/jpeg",
        });
      });

      const response = await VolunteerService.updateVolunteer(formData, token);
      navigation.navigate("VolunteerScreen", { volunteerId: volunteerId });
    } catch (error) {
      console.error("Error:", error.message);
      setError("Failed to update volunteer");
    }
  };

  const pickProfileImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      base64: false,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0]);
    }
  };

  const pickImages = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      base64: false,
    });

    if (!result.canceled) {
      setImages([...images, ...result.assets]);
    }
  };

  const removeImage = (index) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
  };

  const goToChangeLocation = async () => {
    navigation.navigate("LocationSetterScreen", {
      setLocation: setSelectedLocation,
      existingLocation: selectedLocation,
    });
    console.log(selectedLocation);
    setLatitude(selectedLocation.latitude);
    setLongitude(selectedLocation.longitude);
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.header}>Update Volunteer</Text>
        {error && <Text style={styles.error}>{error}</Text>}
        <TouchableOpacity onPress={pickProfileImage} style={styles.profileImageContainer}>
        <Image
  source={profileImage ? { uri: profileImage.uri } : null}
  style={styles.profileImage}
/>

        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Nic No"
          value={nicNo}
          onChangeText={setNicNo}
        />
        <View style={styles.locationContainer}>
          <TouchableOpacity
            style={styles.locationText}
            onPress={goToChangeLocation}
          >
            <Text style={styles.address}>{locationLabel}</Text>
            <Text style={styles.addressDetails}>
              {latitude} {longitude}
            </Text>
          </TouchableOpacity>
        </View>
        <Button title="Choose Images" onPress={pickImages} />
        <View style={styles.imageContainer}>
          {images.map((image, index) => (
            <View key={index} style={styles.imageWrapper}>
              <Image source={{ uri: image.uri }} style={styles.image} />
              <TouchableOpacity
                onPress={() => removeImage(index)}
                style={styles.removeButton}
              >
                <Text style={styles.removeButtonText}>Remove</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <TouchableOpacity onPress={updateVolunteer} style={styles.updateButton}>
          <Text style={styles.updateButtonText}>Update Volunteer</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#ffffff",
    paddingTop: 40,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 40,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
  error: {
    color: "red",
    marginTop: 5,
    marginBottom: 10,
  },
  profileImageContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  imageContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 15,
    marginBottom: 15,
  },
  imageWrapper: {
    position: "relative",
    margin: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 5,
  },
  removeButton: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 5,
    borderRadius: 5,
  },
  removeButtonText: {
    color: "white",
    fontSize: 12,
  },
  locationText: {
    marginBottom: 10,
  },
  address: {
    fontSize: 16,
    fontWeight: "bold",
  },
  addressDetails: {
    fontSize: 14,
    color: "#777",
  },
  updateButton: {
    marginTop: 10,
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
  },
  updateButtonText: {
    color: "white",
    textAlign: "center",
  },
});

export default UpdateVolunteerScreen;
