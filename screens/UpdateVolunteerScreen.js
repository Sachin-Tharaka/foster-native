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
import VounteerService from "../services/VounteerService";
import * as ImagePicker from "expo-image-picker";

const UpdateVolunteerScreen = ({ route, navigation }) => {
  const { volunteerId } = route.params || { volunteerId: "" };

  const [nicNo, setNicNo] = useState("");
  const [userId, setUserId] = useState("");
  const [images, setImages] = useState([]);
  const [error, setError] = useState("");

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

  const getVolunteerById = async (id, token) => {
    try {
      const data = await VounteerService.getVolunteerDataById(id, token);
      console.log("volunteer data:", data);

      setNicNo(data.nicNumber || "");
      setUserId(data.userId || "");

      const imageUris = (data.images || [])
        .map((image) => {
          if (typeof image === "string") {
            return { uri: image };
          } else if (image.uri) {
            return { uri: image.uri };
          }
          return null;
        })
        .filter(Boolean);

      setImages(imageUris);
      console.log("images:", imageUris);
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  const updateVolunteer = async () => {
    console.log("update volunteer....");

    if (!nicNo || images.length === 0) {
      setError("All fields are required, including at least one image");
      return;
    }

    console.log("images:", images);

    try {
      const token = await AsyncStorage.getItem("token");

      const formData = new FormData();
      formData.append("nicNumber", nicNo);
      formData.append("volunteerId", volunteerId);
      formData.append("userId", userId);

      images.forEach((image, index) => {
        formData.append("images", {
          uri: image.uri,
          name: `image_${index}.jpg`,
          type: "image/jpeg",
        });
      });

      console.log("Calling backend...");
      const response = await VounteerService.updateVolunteer(formData, token);
      console.log(" data: ", response);
      console.log("navigate to all screen");
      navigation.navigate("VolunteerScreen", { volunteerId: volunteerId });
    } catch (error) {
      console.error("Error:", error.message);
      setError("Failed to update volunteer");
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

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.header}>Update Volunteer</Text>
        {error && <Text style={styles.error}>{error}</Text>}

        <Text style={styles.label}>NIC No</Text>
        <TextInput
          style={styles.input}
          placeholder="NIC No"
          value={nicNo}
          onChangeText={setNicNo}
        />

        <Button title="Choose Images" onPress={pickImages} color="black" />

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
  updateButton: {
    backgroundColor: "black",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  updateButtonText: {
    color: "white",
    fontSize: 16,
  },
});

export default UpdateVolunteerScreen;
