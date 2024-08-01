class VoulnteerService {
  constructor() {
    this.baseUrl = "https://fosterpet.azurewebsites.net";
  }

  //get volunteer nearby
  async getAllVolunteerNear(longitude, latitude, distanceInMeters,animalType, token) {
    console.warn("Calling api...");
    console.warn("passed data:",longitude, latitude, distanceInMeters,animalType);
    console.warn("token:",token);
    try {
      const response = await fetch(
        `${this.baseUrl}/api/volunteer/filter?longitude=${longitude}&latitude=${latitude}&maxDistance=${distanceInMeters}&animalType=${animalType}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        console.warn(
          "Response from server for filter volunteer:",
          response.status,
          response.statusText
        );
        const errorMessage = await response.text();
        console.error("Server error message for filter volunteer:", errorMessage);
        throw new Error(errorMessage);
      }
      console.warn("response ", response);
      const data = await response.json();
      console.warn(data);
      return data;
    } catch (error) {
      throw error;
    }
  }

  //get volunteer by id
  async getVolunteerById(id, token) {
    try {
      const response = await fetch(
        `${this.baseUrl}/api/volunteer/id?volunteerId=${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to get volunteer data");
      }

      const data = await response.json();
      console.warn(data);
      return data;
    } catch (error) {
      throw error;
    }
  }

  //get volunteer by user id
  async getVolunteerByUserId(id, token) {
    try {
      const response = await fetch(
        `${this.baseUrl}/api/volunteer/user?userId=${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to get volunteer data");
      }

      const data = await response.json();
      console.warn(data);
      return data;
    } catch (error) {
      throw error;
    }
  }

  //get data by volunteer id
  async getVolunteerDataById(id, token) {
    try {
      const response = await fetch(
        `${this.baseUrl}/api/volunteer/id?volunteerId=${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to get volunteer data");
      }

      const data = await response.json();
      console.warn(data);
      return data;
    } catch (error) {
      throw error;
    }
  }

  //save volunteer
  async saveVolunteer(data, token) {
    console.log("data:", data);
    // Make a POST request to the endpoint where the save method is defined
    fetch(`${this.baseUrl}/api/volunteer`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: data,
    })
      .then((response) => {
        console.log("response body: ", response.body);
        // Check if response status is OK
        if (!response.ok) {
          // If response status is not OK, handle the error
          return response.text().then((errorMessage) => {
            throw new Error(errorMessage);
          });
        }
        // If response status is OK, return the JSON response
        return response.json();
      })
      .then((data) => {
        // Handle successful response data here
        console.log("Data saved successfully:", data);
      })
      .catch((error) => {
        // Handle any errors that occurred during the fetch
        console.error("Error saving data:", error.message);
      });
  }

  //update volunteer
  async updateVolunteer(data, token) {
    console.log("data:", data);
    // Make a POST request to the endpoint where the save method is defined
    fetch(`${this.baseUrl}/api/volunteer/update`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: data,
    })
      .then((response) => {
        console.log("response body: ", response.body);
        // Check if response status is OK
        if (!response.ok) {
          // If response status is not OK, handle the error
          return response.text().then((errorMessage) => {
            throw new Error(errorMessage);
          });
        }
        // If response status is OK, return the JSON response
        return response.json();
      })
      .then((data) => {
        // Handle successful response data here
        console.log("Data saved successfully:", data);
      })
      .catch((error) => {
        // Handle any errors that occurred during the fetch
        console.error("Error saving data:", error.message);
      });
  }

  //add rates
  async addRates(data, token) {
    console.log("rates data:", data);
    console.log(token);
    try {
      const response = await fetch(
        `${this.baseUrl}/api/volunteer/update-rates`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        // If response status is not OK, handle the error
        console.error(
          "Server returned error:",
          response.status,
          response.statusText
        );
        const errorMessage = await response.text();
        throw new Error(errorMessage);
      }

      // If response status is OK, return the JSON response
      const responseData = await response.json();
      console.log("Rates saved successfully:", responseData);
      return responseData;
    } catch (error) {
      // Handle any errors that occurred during the fetch
      console.error("Error saving rates:", error.message);
      throw error;
    }
  }

  //get all volunteers
  async getAllVolunteers(token) {
    try {
      const response = await fetch(`${this.baseUrl}/api/volunteer`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        console.warn(
          "Response from server for volunterr:",
          response.status,
          response.statusText
        );
        const errorMessage = await response.text();
        console.error("Server error message for volunterr:", errorMessage);
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.warn(data);
      return data;
    } catch (error) {
      throw error;
    }
  }

  //delete volunteer
  async delete(id, token) {
    console.log("Deleting account");
    try {
      const response = await fetch(
        `${this.baseUrl}/api/volunteer/delete?volunteerId=${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Response from server:", response);

      if (!response.ok) {
        console.error(
          "Server returned error:",
          response.status,
          response.statusText
        );
        throw new Error("Failed");
      }

      const data = await response.json();

      return data;
    } catch (error) {
      console.error("Error:", error.message);
      throw error;
    }
  }
}

export default new VoulnteerService();
