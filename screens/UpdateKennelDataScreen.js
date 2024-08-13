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
import KennelService from "../services/KennelService";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";

const UpdateKennelDataScreen = ({ route, navigation }) => {
  const { kennelId } = route.params || { kennelId: "" };

  const [kennelName, setKennelName] = useState("");
  const [kennelAddress1, setKennelAddress1] = useState("");
  const [kennelAddress2, setKennelAddress2] = useState("");
  const [kennelCity, setKennelCity] = useState("");
  const [kennelZip, setKennelZip] = useState("");
  const [longitude, setLongitude] = useState(0);
  const [latitude, setLatitude] = useState(0);
  const [images, setImages] = useState([]);
  const [profileImage, setProfileImage] = useState(null);
  const [error, setError] = useState("");
  const [selectedLocation, setSelectedLocation] = useState({});
  const [locationLabel, setLocationLabel] = useState("Set Location");

  useEffect(() => {
    const getToken = async () => {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        getKennelById(kennelId, token);
      } else {
        console.log("Please login");
        navigation.navigate("Login");
      }
    };
    getToken();
  }, [navigation]);

  const getKennelById = async (id, token) => {
    try {
      const data = await KennelService.getKennelById(id, token);
      setKennelName(data.kennelName || "");
      setKennelAddress1(data.kennelAddress?.address1 || "");
      setKennelAddress2(data.kennelAddress?.address2 || "");
      setKennelCity(data.kennelAddress?.city || "");
      setKennelZip(data.kennelAddress?.zipCode.toString() || "");
      setLongitude(data.kennelLocation?.coordinates[0] || 0);
      setLatitude(data.kennelLocation?.coordinates[1] || 0);
      setProfileImage(data.profileImage ? { uri: data.profileImage } : null);
      const imageUris = (data.images || [])
        .map((image) => ({ uri: image }))
        .filter(Boolean);
      setImages(imageUris);
      console.warn(
        data.kennelLocation?.coordinates[1],
        data.kennelLocation?.coordinates[0]
      );
      getAddressFromCoordinates(
        data.kennelLocation?.coordinates[1],
        data.kennelLocation?.coordinates[0]
      );
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

  const updateKennel = async () => {
    if (
      !kennelName ||
      !kennelAddress1 ||
      !kennelAddress2 ||
      !kennelCity ||
      !kennelZip ||
      !longitude ||
      !latitude ||
      images.length === 0
    ) {
      setError("All fields are required, including at least one image");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("token");
      const ownerId = await AsyncStorage.getItem("userId");

      const formData = new FormData();
      formData.append("kennelId", kennelId);
      formData.append("kennelName", kennelName);
      formData.append("kennelAddress1", kennelAddress1);
      formData.append("kennelAddress2", kennelAddress2);
      formData.append("kennelCity", kennelCity);
      formData.append("kennelZip", kennelZip);
      formData.append("kennelLongitude", longitude.toString());
      formData.append("kennelLatitude", latitude.toString());
      formData.append("ownerId", ownerId);

      images.forEach((image, index) => {
        formData.append("images", {
          uri: image.uri,
          name: `image_${index}.jpg`,
          type: "image/jpeg",
        });
      });

      if (profileImage) {
        formData.append("profileImage", {
          uri: profileImage.uri,
          name: `profile_image.jpg`,
          type: "image/jpeg",
        });
      }

      const response = await KennelService.updateKennel(formData, token);
      navigation.navigate("MyKennelsScreen");
    } catch (error) {
      console.error("Error:", error.message);
      setError("Failed to update kennel");
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
      setProfileImage({ uri: result.assets[0].uri });
    }
  };

  const removeImage = (index) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
  };

  const removeProfileImage = () => {
    setProfileImage(null);
  };

  const goToChangeLocation = async () => {
    console.log("existing location: ", selectedLocation);
    navigation.navigate("LocationSetterScreen", {
      setLocation: setSelectedLocation,
      existingLocation: selectedLocation,
    });
    console.warn(selectedLocation);
    setLocationLabel(selectedLocation.label);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Update Kennel</Text>
      {error && <Text style={styles.error}>{error}</Text>}
      <TextInput
        style={styles.input}
        placeholder="Kennel Name"
        value={kennelName}
        onChangeText={setKennelName}
      />
      <TextInput
        style={styles.input}
        placeholder="Address Line 1"
        value={kennelAddress1}
        onChangeText={setKennelAddress1}
      />
      <TextInput
        style={styles.input}
        placeholder="Address Line 2"
        value={kennelAddress2}
        onChangeText={setKennelAddress2}
      />
      <TextInput
        style={styles.input}
        placeholder="City"
        value={kennelCity}
        onChangeText={setKennelCity}
      />
      <TextInput
        style={styles.input}
        placeholder="Zip"
        value={kennelZip}
        onChangeText={setKennelZip}
      />
      <View style={styles.locationContainer}>
        <TouchableOpacity
          style={styles.locationButton}
          onPress={goToChangeLocation}
        >
          <Text style={styles.locationLabel}>{locationLabel}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.profileImageContainer}>
        {profileImage ? (
          <View style={styles.imageWrapper}>
            <Text>Profile Image:</Text>
            <Image source={{ uri: profileImage.uri }} style={styles.image} />
            <TouchableOpacity
              onPress={removeProfileImage}
              style={styles.removeButton}
            >
              <Text style={styles.removeButtonText}>Remove</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Button
            title="Choose Profile Image"
            onPress={pickProfileImage}
            color="#000000" // Black color
          />
        )}
      </View>
      <Button
        title="Choose Additional Images"
        onPress={pickImages}
        color="#000000" // Black color
      />
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

      <Button
        title="Update Kennel"
        onPress={updateKennel}
        color="#000000" // Black color
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 60,
    backgroundColor: "#ffffff",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#cccccc",
    padding: 12,
    marginBottom: 15,
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
  },
  error: {
    color: "red",
    marginBottom: 15,
    textAlign: "center",
  },
  imageContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  profileImageContainer: {
    marginBottom: 20,
    alignItems: "center",
  },
  imageWrapper: {
    position: "relative",
    marginBottom: 15,
    width: 100,
    height: 100,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  removeButton: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    padding: 5,
    borderRadius: 20,
  },
  removeButtonText: {
    color: "white",
    fontSize: 12,
  },
  locationContainer: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#cccccc",
    borderRadius: 8,
    marginBottom: 20,
    backgroundColor: "#f9f9f9",
  },
  locationButton: {
    alignItems: "center",
  },
  locationLabel: {
    fontWeight: "bold",
    color: "#333",
  },
});

export default UpdateKennelDataScreen;
