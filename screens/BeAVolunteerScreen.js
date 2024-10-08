import React, { useId, useState } from "react";
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
import * as ImagePicker from "expo-image-picker";
import VounteerService from "../services/VounteerService";
import Icon from 'react-native-vector-icons/FontAwesome'; // Import Icon component

const BeAVolunteerScreen = ({ navigation }) => {
  const [nicNo, setNicNo] = useState("");
  const [images, setImages] = useState([]);
  const [profileImage, setProfileImage] = useState(null); // Profile image state
  const [longitude, setLongitude] = useState('');
  const [latitude, setLatitude] = useState('');
  const [selectedLocation, setSelectedLocation] = useState({}); // Selected location state
  const [error, setError] = useState("");

  const addNewVolunteer = async () => {
    console.log("adding new volunteer....");
    const volunteerLongitude = longitude;
    const volunteerLatitude = latitude;

    if (!nicNo || !longitude || !latitude || images.length === 0 || !profileImage) {
      setError("All fields are required, including at least one profile image and one other image");
      return;
    }

    console.log("images:", images);

    try {
      const token = await AsyncStorage.getItem("token");
      const ownerId = await AsyncStorage.getItem("userId");

      const formData = new FormData();
      formData.append("nicNumber", nicNo);
      formData.append("userId", ownerId);
      formData.append('volunteerLongitude', volunteerLongitude.toString());
      formData.append('volunteerLatitude', volunteerLatitude.toString());

      formData.append("profileImage", {
        uri: profileImage.uri,
        name: `profile_image.jpg`,
        type: "image/jpeg",
      });

      images.forEach((image, index) => {
        formData.append("images", {
          uri: image.uri,
          name: `image_${index}.jpg`,
          type: "image/jpeg",
        });
      });

      console.log("Calling backend...");
      const response = await VounteerService.saveVolunteer(formData, token);
      console.log("data: ", response);
      console.log("navigate to volunteer screen");
      navigation.navigate("VolunteerScreen");

      setNicNo("");
      setImages([]);
      setProfileImage(null);
    } catch (error) {
      console.error("Error:", error.message);
      setError("Failed to save data");
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

  const pickProfileImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      base64: false,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0]);
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
        <Text style={styles.header}>Be a Volunteer</Text>
        {error && <Text style={styles.error}>{error}</Text>}
        <TextInput
          style={styles.input}
          placeholder="Nic Number"
          value={nicNo}
          onChangeText={setNicNo}
        />
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
            <Text style={styles.changeButtonText}>Select location</Text>
          </TouchableOpacity>
        </View>
        <Button title="Choose Profile Image" onPress={pickProfileImage} />
        {profileImage && (
          <View style={styles.profileImageContainer}>
            <Image source={{ uri: profileImage.uri }} style={styles.profileImage} />
          </View>
        )}
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
        <Button title="Save" onPress={addNewVolunteer} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#ffffff",
    marginTop: 100,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
  },
  error: {
    color: "red",
    marginTop: 5,
    marginBottom: 10,
  },
  imageContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
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
  profileImageContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  locationContainer: {
    marginBottom: 10,
  },
  locationDetails: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationIcon: {
    marginRight: 10,
  },
  locationText: {
    flex: 1,
  },
  address: {
    fontWeight: "bold",
  },
  addressDetails: {
    color: "#555",
  },
  changeButton: {
    marginTop: 10,
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
  },
  changeButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
});

export default BeAVolunteerScreen;
