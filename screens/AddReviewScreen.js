import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import ReviewService from '../services/ReviewService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddReviewScreen = ({ route, navigation }) => {
  const { bookingId, kennelId, volunteerId } = route.params;
  const [message, setReviewMessage] = useState('');
  const [rating, setRating] = useState('');

  const handleSubmit = async () => {
    const token = await AsyncStorage.getItem("token");
    const reviewerId = await AsyncStorage.getItem("userId");

    if (!message || !rating) {
      Alert.alert("Error", "Please enter a review message and rating.");
      return;
    }

    if (rating < 0 || rating > 5) {
      Alert.alert("Error", "Please enter a rating between 0 and 5.");
      return;
    }

    try {
      const reviewData = {
        bookingId,
        kennelId,
        volunteerId,
        message,
        rating: parseFloat(rating),
        reviewerId
      };

      const response = await ReviewService.postReview(reviewData, token);
      console.log("Review submitted:", response);
      Alert.alert("Success", "Review submitted successfully.");
      navigation.goBack(); // Navigate back after submitting the review
    } catch (error) {
      console.error("Error submitting review:", error.message);
      if (error.message.includes('403')) {
        Alert.alert("Error", "You are not authorized to submit this review.");
      } else {
        Alert.alert("Error", "Error submitting review. Please try again.");
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Add Review</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your review message"
        value={message}
        onChangeText={setReviewMessage}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter your rating (0-5)"
        value={rating}
        onChangeText={setRating}
        keyboardType="numeric"
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit Review</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
  button: {
    backgroundColor: 'black',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
});

export default AddReviewScreen;
