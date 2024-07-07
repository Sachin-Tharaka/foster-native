import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
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

  //get notifications by user id
  const getNotificationsByUserId = async (id, token) => {
    // call notifications by user id function
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

  // Function to render stars based on rating
  const renderStars = (count) => {
    let stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Text key={i} style={{ color: i < count ? "#FFD700" : "#ccc" }}>
          ★
        </Text>
      );
    }
    return stars;
  };

  const handleRedirect = (type) => {
    switch(type) {
      case "CHAT_USER":
        navigation.navigate("ChatListUser");
        break;
      case "CHAT_AGENT":
        navigation.navigate("ChatListAgent");
        break;
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
        //navigation.navigate("SwitchAccounts");
        break;
      case "ACCOUNT_VOLUNTEER":
        //navigation.navigate("AccountVolunteerScreen");
        break;
      case "PAYMENT_USER":
        //navigation.navigate("PaymentUserScreen");
        break;
      case "PAYMENT_KENNEL":
        //navigation.navigate("PaymentKennelScreen");
        break;
      case "PAYMENT_VOLUNTEER":
        //navigation.navigate("PaymentVolunteerScreen");
        break;
      case "SYSTEM":
        //navigation.navigate("SystemScreen");
        break;
      default:
        //console.log("Invalid type");
    }
  }

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.header}>Notifications</Text>
      </View>

      <ScrollView style={styles.list}>
        {notifications.map((notification) => (
          <TouchableOpacity key={notification.notificationID} style={styles.entry} onPress={() => handleRedirect(notification.type)}>
            <View key={notification.id} style={styles.entry}>
              <Image
                source={{ uri: "https://picsum.photos/400/600?image=1" }}
                style={styles.image}
              />
              <View style={styles.infoContainer}>
                <Text style={styles.heading}>{notification.heading}</Text>
                <Text style={styles.message}>{notification.message}</Text>
                <View style={{ flexDirection: "row" }}>
                  <Text>★★★★</Text>

                  {/* {renderStars(notification.stars)} */}
                </View>
              </View>
              <TouchableOpacity onPress={() => console.log("Close notification")}>
                <Text style={{ fontSize: 18, color: "#888" }}>✕</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View>
        <Navbar />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#ffffff",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
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
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  infoContainer: {
    flex: 1,
    justifyContent: "center",
  },
  heading: {
    fontSize: 18,
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
