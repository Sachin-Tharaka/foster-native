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
      images.length === 0
    ) {
      setError("All fields are required, including at least one image");
      return;
    }

    console.log("petImages:", images);

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
      setError("Failed to add new pet");
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

        <Text style={styles.label}>Pet Type</Text>
        <AnimalTypeDropdown selectedAnimal={petType} onAnimalTypeChange={handleAnimalTypeChange} />

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

        <Text style={styles.label}>Pet Zip</Text>
        <TextInput
          style={styles.input}
          placeholder="Pet Zip"
          value={petZip}
          onChangeText={setPetZip}
        />

        <Text style={styles.label}>Pet Age</Text>
        <TextInput
          style={styles.input}
          placeholder="Pet Age"
          value={petAge}
          onChangeText={setPetAge}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Pet Weight</Text>
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
          <Text style={styles.imagePickerButtonText}>Choose Images</Text>
        </TouchableOpacity>
        <View style={styles.imageContainer}>
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
        <TouchableOpacity style={styles.updateButton} onPress={updateData}>
          <Text style={styles.updateButtonText}>Update</Text>
        </TouchableOpacity>
      </ScrollView>
      <Navbar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f8f8f8",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "black",
    margin: "auto",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  input: {
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    width: "100%",
  },
  imagePickerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "black",
    borderRadius: 10,
    height: 48,
    width: "100%",
    marginBottom: 20,
  },
  imagePickerButtonText: {
    color: "#fff",
    marginLeft: 10,
    fontSize: 16,
  },
  imageContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  imageWrapper: {
    position: "relative",
    marginRight: 10,
    marginBottom: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  removeButton: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: 25,
    padding: 2,
  },
  updateButton: {
    backgroundColor: "black",
    borderRadius: 10,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  updateButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
});

export default UpdatePetProfileScreen;
