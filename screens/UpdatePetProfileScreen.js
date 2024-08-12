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
import * as ImagePicker from "expo-image-picker";
import PetsService from "../services/PetsService";
import Icon from "react-native-vector-icons/FontAwesome";
import Navbar from "../components/Navbar";
import AnimalTypeDropdown from "../components/AnimalTypeDropdown";

const UpdatePetProfileScreen = ({ route, navigation }) => {
  const { petID } = route.params || { petID: "" };

  const [petType, setPetType] = useState("");
  const [petName, setPetName] = useState("");
  const [petAddress1, setPetAddress1] = useState("");
  const [petAddress2, setPetAddress2] = useState("");
  const [petCity, setPetCity] = useState("");
  const [petZip, setPetZip] = useState("");
  const [petAge, setPetAge] = useState("");
  const [petWeight, setPetWeight] = useState("");
  const [petBreed, setPetBreed] = useState("");
  const [petMediConditions, setPetMediConditions] = useState("");
  const [petVaccinationStatus, setPetVaccinationStatus] = useState("");
  const [kasl_regNo, setKasl_regNo] = useState("");
  const [images, setImages] = useState([]);
  const [profileImage, setProfileImage] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const getToken = async () => {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        getPetById(petID, token);
      } else {
        console.log("Please login");
        navigation.navigate("Login");
      }
    };
    getToken();
  }, [navigation]);

  const getPetById = async (id, token) => {
    try {
      const data = await PetsService.getPetById(id, token);
      console.log("pet data:", data);

      setPetType(data.petType || "");
      setPetName(data.petName || "");
      setPetAddress1(data.petAddress?.address1 || "");
      setPetAddress2(data.petAddress?.address2 || "");
      setPetCity(data.petAddress?.city || "");
      setPetZip(data.petAddress?.zipCode?.toString() || "");
      setPetAge(data.petAge?.toString() || "");
      setPetWeight(data.petWeight?.toString() || "");
      setPetBreed(data.petBreed || "");
      setPetMediConditions(data.petMediConditions || "");
      setPetVaccinationStatus(data.petVaccinationStatus || "");
      setKasl_regNo(data.kasl_regNo || "");

      const imageUris = (data.petImages || [])
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
      setProfileImage(data.profileImage ? { uri: data.profileImage } : null);
      console.log("images:", imageUris);
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  const updateData = async () => {
    console.log("updating....");
    const age = parseInt(petAge);
    const weight = parseFloat(petWeight);

    if (isNaN(age) || isNaN(weight)) {
      setError("Age and weight must be numbers");
      return;
    }

    if (
      !petType ||
      !petName ||
      !petAddress1 ||
      !petCity ||
      !petZip ||
      !age ||
      !weight ||
      !petBreed ||
      !petMediConditions ||
      !petVaccinationStatus ||
      !kasl_regNo ||
      images.length === 0 ||
      !profileImage
    ) {
      setError(
        "All fields are required, including at least one image and a profile image"
      );
      return;
    }

    console.log("petImages:", images);
    console.log("profileImage:", profileImage);

    try {
      const token = await AsyncStorage.getItem("token");
      const ownerId = await AsyncStorage.getItem("userId");

      const formData = new FormData();
      formData.append("petID", petID);
      formData.append("petType", petType);
      formData.append("petName", petName);
      formData.append("petAddress1", petAddress1);
      formData.append("petAddress2", petAddress2);
      formData.append("petCity", petCity);
      formData.append("petZip", petZip);
      formData.append("petAge", age.toString());
      formData.append("petWeight", weight.toString());
      formData.append("petBreed", petBreed);
      formData.append("petMediConditions", petMediConditions);
      formData.append("petVaccinationStatus", petVaccinationStatus);
      formData.append("ownerId", ownerId);
      formData.append("KASL_regNo", kasl_regNo);

      // Append profile image
      if (profileImage) {
        formData.append("profileImage", {
          uri: profileImage.uri,
          name: "profile_image.jpg",
          type: "image/jpeg",
        });
      }

      images.forEach((image, index) => {
        formData.append("petImages", {
          uri: image.uri,
          name: `image_${index}.jpg`,
          type: "image/jpeg",
        });
      });

      console.log("Calling backend...");
      const response = await PetsService.updatePetProfile(formData, token);
      console.log("pet data: ", response);
      console.log("navigate to pet profile screen");
      navigation.navigate("PetProfileScreen", { petID: petID });
    } catch (error) {
      console.error("Error:", error.message);
      setError("Failed to update pet profile");
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

  const handleAnimalTypeChange = (type) => {
    setPetType(type);
  };

  return (
    <View>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.header}>Update Pet Profile</Text>
        </View>
        {error && <Text style={styles.error}>{error}</Text>}

        {profileImage && (
          <View style={styles.profileImageContainer}>
            <Image
              source={{ uri: profileImage.uri }}
              style={styles.profileImage}
            />
            <TouchableOpacity
              onPress={() => setProfileImage(null)}
              style={styles.removeButton}
            >
              <Icon name="close" size={24} color="#ffffff" />
            </TouchableOpacity>
          </View>
        )}
        <TouchableOpacity
          style={styles.imagePickerButton}
          onPress={pickProfileImage}
        >
          <Text style={styles.imagePickerButtonText}>Choose Profile Image</Text>
        </TouchableOpacity>

        <Text style={styles.label}>Pet Type</Text>
        <AnimalTypeDropdown
          selectedAnimal={petType}
          onAnimalTypeChange={handleAnimalTypeChange}
        />

        <Text style={styles.label}>Pet Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Pet Name"
          value={petName}
          onChangeText={setPetName}
        />

        <Text style={styles.label}>Pet Address Line 1</Text>
        <TextInput
          style={styles.input}
          placeholder="Pet Address Line 1"
          value={petAddress1}
          onChangeText={setPetAddress1}
        />

        <Text style={styles.label}>Pet Address Line 2</Text>
        <TextInput
          style={styles.input}
          placeholder="Pet Address Line 2"
          value={petAddress2}
          onChangeText={setPetAddress2}
        />

        <Text style={styles.label}>Pet City</Text>
        <TextInput
          style={styles.input}
          placeholder="Pet City"
          value={petCity}
          onChangeText={setPetCity}
        />

        <Text style={styles.label}>Pet Zip Code</Text>
        <TextInput
          style={styles.input}
          placeholder="Pet Zip Code"
          value={petZip}
          onChangeText={setPetZip}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Pet Age (in years)</Text>
        <TextInput
          style={styles.input}
          placeholder="Pet Age"
          value={petAge}
          onChangeText={setPetAge}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Pet Weight (in kg)</Text>
        <TextInput
          style={styles.input}
          placeholder="Pet Weight"
          value={petWeight}
          onChangeText={setPetWeight}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Pet Breed</Text>
        <TextInput
          style={styles.input}
          placeholder="Pet Breed"
          value={petBreed}
          onChangeText={setPetBreed}
        />

        <Text style={styles.label}>Medical Conditions</Text>
        <TextInput
          style={styles.input}
          placeholder="Medical Conditions"
          value={petMediConditions}
          onChangeText={setPetMediConditions}
        />

        <Text style={styles.label}>Vaccination Status</Text>
        <TextInput
          style={styles.input}
          placeholder="Vaccination Status"
          value={petVaccinationStatus}
          onChangeText={setPetVaccinationStatus}
        />

        <Text style={styles.label}>KASL Registration Number</Text>
        <TextInput
          style={styles.input}
          placeholder="KASL Registration Number"
          value={kasl_regNo}
          onChangeText={setKasl_regNo}
        />

        <TouchableOpacity style={styles.imagePickerButton} onPress={pickImages}>
          <Text style={styles.imagePickerButtonText}>
            Choose Additional Images
          </Text>
        </TouchableOpacity>

        <View style={styles.imagesContainer}>
          {images.map((image, index) => (
            <View key={index} style={styles.imageWrapper}>
              <Image source={{ uri: image.uri }} style={styles.image} />
              <TouchableOpacity
                onPress={() => removeImage(index)}
                style={styles.removeButton}
              >
                <Icon name="close" size={24} color="#ffffff" />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <Button title="Update Pet Profile" onPress={updateData} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  headerContainer: {
    alignItems: "center",
    marginVertical: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
  },
  error: {
    color: "red",
    marginVertical: 8,
    textAlign: "center",
  },
  profileImageContainer: {
    position: "relative",
    marginBottom: 16,
    alignItems: "center",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  removeButton: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "red",
    borderRadius: 50,
    padding: 4,
  },
  imagePickerButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    marginBottom: 16,
  },
  imagePickerButtonText: {
    color: "#ffffff",
    textAlign: "center",
    fontWeight: "bold",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 8,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  imagesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  imageWrapper: {
    position: "relative",
    margin: 4,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
});

export default UpdatePetProfileScreen;
