import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ReviewService from "../services/ReviewService";

const KennelReviewScreen = ({ route, navigation }) => {
  const { kennelId } = route.params || { kennelId: "" };
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const getToken = async () => {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        getReviewByKennelId(kennelId, token);
      } else {
        console.log("Please login");
        navigation.navigate("Login");
      }
    };
    getToken();
  }, [navigation]);

  const getReviewByKennelId = async (id, token) => {
    try {
      const data = await ReviewService.getReviewsByKennelId(id, token);
      console.log("reviews data:", data);
      setReviews(data);
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  const handleReviewClick = (reviewerId) => {
    console.log(`Navigate to profile of reviewer with ID: ${reviewerId}`);
    // Implement navigation to the profile page
    navigation.navigate("CustomerProfile", { customerId:reviewerId });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Reviews</Text>
      <ScrollView style={styles.list}>
        {reviews.map((review) => (
          <TouchableOpacity key={review.reviewId} onPress={() => handleReviewClick(review.reviewerId)}>
            <View style={styles.entry}>
              <View style={styles.infoContainer}>
                <Text style={styles.message}>{review.message}</Text>
                <Text style={styles.rating}>
                  {Array(review.rating).fill("★").join("")}
                  {Array(5 - review.rating).fill("☆").join("")}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
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
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },
  list: {
    flex: 1,
  },
  entry: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#F2F2F2",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  infoContainer: {
    flex: 1,
  },
  message: {
    fontSize: 16,
    fontWeight: "normal",
  },
  rating: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFD700",
  },
});

export default KennelReviewScreen;
