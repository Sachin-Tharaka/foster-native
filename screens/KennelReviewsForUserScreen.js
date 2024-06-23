import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Button,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ReviewService from "../services/ReviewService";

const KennelReviewsForUserScreen = ({ route, navigation }) => {
  const { kennelId } = route.params || { kennelId: "" };
  const [reviews, setReviews] = useState([]);
  const [newReviewMessage, setNewReviewMessage] = useState("");
  const [newReviewRating, setNewReviewRating] = useState(0);

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

  const postReview = async () => {
    const token = await AsyncStorage.getItem("token");
    const userId=await AsyncStorage.getItem("userId");
    if (!token) {
      console.log("Please login");
      navigation.navigate("Login");
      return;
    }

    const newReview = {
      message: newReviewMessage,
      rating: newReviewRating,
      kennelId:kennelId,
      reviewerId:userId
    };

    try {
        console.log(newReview);
      const data = await ReviewService.postReview(newReview, token);
      setReviews([...reviews, data]);
      setNewReviewMessage("");
      setNewReviewRating(0);
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  const renderStars = (rating) => {
    return (
      <Text style={styles.rating}>
        {Array(rating).fill("★").join("")}
        {Array(5 - rating).fill("☆").join("")}
      </Text>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Reviews</Text>
      <ScrollView style={styles.list}>
        {reviews.map((review) => (
          <View key={review.reviewId} style={styles.entry}>
            <View style={styles.infoContainer}>
              <Text style={styles.message}>{review.message}</Text>
              {renderStars(review.rating)}
            </View>
          </View>
        ))}
      </ScrollView>
      {/* <View style={styles.newReviewContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Write your review..."
          value={newReviewMessage}
          onChangeText={setNewReviewMessage}
        />
        <View style={styles.ratingContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity key={star} onPress={() => setNewReviewRating(star)}>
              <Text style={styles.star}>
                {star <= newReviewRating ? "★" : "☆"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <Button title="Submit Review" onPress={postReview} />
      </View> */}
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
  newReviewContainer: {
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    marginTop: 20,
  },
  textInput: {
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  ratingContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
  },
  star: {
    fontSize: 30,
    color: "#FFD700",
    marginHorizontal: 5,
  },
});

export default KennelReviewsForUserScreen;
