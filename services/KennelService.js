class KennelService {
  constructor() {
    this.baseUrl = "https://fosterpet.azurewebsites.net";
  }

  //get kennel nearby
  async getAllKennelNear(longitude, latitude, distanceInMeters, animalType) {
    console.warn("Calling api...");
    try {
      const response = await fetch(
        `${this.baseUrl}/api/kennel/filter?longitude=${longitude}&latitude=${latitude}&maxDistance=${distanceInMeters}&animalType=${animalType}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          },
        }
      );

      if (!response.ok) {

        console.warn(
          "Response from server for filter kennel:",
          response.status,
          response.statusText
        );
        const errorMessage = await response.text();
        console.error("Server error message for filter kennel:", errorMessage);
        throw new Error(errorMessage);
      }
      //console.warn("response " ,response);
      const data = await response.json();
      //console.warn(data);
      return data;
    } catch (error) {
      console.error("Error:", error.message);
      throw error;
    }
  }

  //get kennel by id
  async getKennelById(id) {
    try {
      const response = await fetch(
        `${this.baseUrl}/api/kennel/id?kennelId=${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            //Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to get kennel data");
      }

      const data = await response.json();
      console.warn(data);
      return data;
    } catch (error) {
      throw error;
    }
  }

  //get kennel by user id
  async getKennelsByUserId(id, token) {
    try {
      const response = await fetch(
        `${this.baseUrl}/api/kennel/owner?ownerId=${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to get kennels data");
      }

      const data = await response.json();
      console.warn(data);
      return data;
    } catch (error) {
      throw error;
    }
  }

  //get all kennel
  async getAllKennels() {
    try {
      const response = await fetch(`${this.baseUrl}/api/kennel/active`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          
        },
      });

      if (!response.ok) {
        console.warn(
          "Response from server for kennel:",
          response.status,
          response.statusText
        );
        const errorMessage = await response.text();
        console.error("Server error message for  kennel:", errorMessage);
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.warn(data);
      return data;
    } catch (error) {
      throw error;
    }
  }

  //add new kennel
  async addNewKennel(kennelData, token) {
    try {
      console.log("kennel data:", kennelData);

      const response = await fetch(`${this.baseUrl}/api/kennel`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: kennelData,
      });

      if (!response.ok) {
        // If response status is not OK, handle the error
        const errorMessage = await response.text();
        throw new Error(errorMessage);
      }

      // If response status is OK, return the JSON response
      const data = await response.json();
      console.log("Kennel saved successfully:", data);
      return data;
    } catch (error) {
      // Handle any errors that occurred during the fetch
      console.error("Error saving kennel:", error.message);
      throw error;
    }
  }

  //add rates
  async addRates(data, token) {
    console.log("rates data:", data);
    console.log(token);
    try {
      const response = await fetch(`${this.baseUrl}/api/kennel/update-rates`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

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

  //update kennel
  async updateKennel(data, token) {
    // Assuming data is the data you want to send to the server
    console.log("kennel data:", data);
    // Make a POST request to the endpoint where the save method is defined
    fetch(`${this.baseUrl}/api/kennel/update`, {
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
        console.log("Kennel saved successfully:", data);
      })
      .catch((error) => {
        // Handle any errors that occurred during the fetch
        console.error("Error saving kennel:", error.message);
      });
  }

  //delete kennel
  async delete(id, token) {
    try {
      const response = await fetch(
        `${this.baseUrl}/api/kennel/delete?kennelId=${id}`,
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
      console.error("Error :", error.message);
      throw error;
    }
  }
}
export default new KennelService();
