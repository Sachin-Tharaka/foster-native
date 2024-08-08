import {Platform} from "react-native";
import * as Device from "expo-device";
import AsyncStorage from "@react-native-async-storage/async-storage";

class AuthenticationService {



  constructor() {
    this.baseUrl = "https://fosterpet.azurewebsites.net";
  }

  //login function
  async login(email, password) {

    const deviceType = `${Device.brand} ${Device.modelName}` || "Unknown Device";
    const os = `${Platform.OS} ${Platform.Version}` || "Unknown OS";
    const expoToken = await AsyncStorage.getItem("expoToken");

    try {
      console.log(expoToken)
      const response = await fetch(`${this.baseUrl}/api/auth/authenticate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Device-Type': deviceType,
          'OS': os,
          'Expo-Token': expoToken
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Invalid credentials");
      }

      const data = await response.json();
      console.warn("login response ", data);
      return data; // You may want to return a user token or user data here
    } catch (error) {
      throw error;
    }
  }

  //register function
  async register(firstName, lastName, email, password) {
    try {
      const response = await fetch(`${this.baseUrl}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ firstName, lastName, email, password }),
      });

      if (!response.ok) {
        throw new Error("Registration failed");
      }

      const data = await response.json();

      console.warn(data);
      return data; // You may want to return user data or a success message
    } catch (error) {
      throw error;
    }
  }

  //email verification
  async emailVerification(email, verificationCode) {
    try {
      const response = await fetch(`${this.baseUrl}/api/auth/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, verificationCode }),
      });

      if (!response.ok) {
        throw new Error("Invalid verification code");
      }

      const data = await response.json();
      console.warn("verified");
      console.warn(data);
      return data;
    } catch (error) {
      throw error;
    }
  }

  //email send
  async emailSend(email) {
    try {
      const response = await fetch(
        `${this.baseUrl}/api/auth/send-reset-password-code`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      if (!response.ok) {
        throw new Error("Invalid verification code");
      }

      const data = await response.json();
      console.warn("verified");
      console.warn(data);
      return data;
    } catch (error) {
      throw error;
    }
  }

  //save new password for porget
  async savePasswordForForget(email, password, verificationCode) {
    try {
      const response = await fetch(`${this.baseUrl}/api/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, verificationCode }),
      });

      if (!response.ok) {
        throw new Error("Registration failed");
      }

      const data = await response.json();

      console.warn(data);
      return data; // You may want to return user data or a success message
    } catch (error) {
      throw error;
    }
  }
}

export default new AuthenticationService();
