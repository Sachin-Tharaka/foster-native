import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Navbar from "../components/Navbar";
import NotificationService from "../services/NotificationService";

const NotificationScreen = ({ navigation }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const getToken = async () => {
      const token = await AsyncStorage.getItem("token");
      const userId = await AsyncStorage.getItem("userId");
      if (token) {
        // Token exists, fetch notifications
        getNotificationsByUserId(userId, token);
      } else {
        // Token doesn't exist, navigate to Login screen
        console.log("Please login");
        navigation.navigate("Login");
      }
    };
    getToken();
  }, []);

  // Get notifications by user id
  const getNotificationsByUserId = async (id, token) => {
    try {
      const data = await NotificationService.getNotificationsByUserId(
        id,
        token
      );
      console.log("user data:", data);
      setNotifications(data);
    } catch (error) {
      // Handle error
      console.error("Error:", error.message);
    }
  };

  const handleNotificationPress = (notification) => {
    switch (notification.type) {
      case "BOOKING_USER":
        navigation.navigate("MyBookingScreen");
        break;
      case "BOOKING_KENNEL":
        navigation.navigate("KennelBookingScreen");
        break;
      case "BOOKING_VOLUNTEER":
        navigation.navigate("VolunteerBooking");
        break;
      case "ACCOUNT_USER":
        navigation.navigate("UserAccount");
        break;
      case "ACCOUNT_KENNEL":
        navigation.navigate("AgentHome");
        break;
      case "ACCOUNT_VOLUNTEER":
        navigation.navigate("VolunteerScreen");
        break;
      default:
        console.log("Unknown notification type");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Notifications</Text>
      <ScrollView style={styles.list}>
        {notifications.map((notification) => (
          <TouchableOpacity
            key={notification.id}
            style={styles.entry}
            onPress={() => handleNotificationPress(notification)}
          >
            <View style={styles.infoContainer}>
              <Text style={styles.sender}>{notification.senderName}</Text>
              <Text style={styles.heading}>{notification.heading}</Text>
              <Text style={styles.message}>{notification.message}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View></View>
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
    marginBottom: 40,
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
    backgroundColor: "#F0F0F0",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  infoContainer: {
    flex: 1,
    justifyContent: "center",
  },
  sender: {
    fontSize: 18,
    fontWeight: "bold",
  },
  heading: {
    fontSize: 14,
    fontWeight: "bold",
  },
  message: {
    fontSize: 14,
    color: "#666",
  },
  button: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default NotificationScreen;
