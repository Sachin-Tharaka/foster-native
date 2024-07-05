class PetsService {
  constructor() {
    this.baseUrl = "https://fosterpet.azurewebsites.net";
  }

  //get pets by owner id
  async getPetsByOwnerId(id, token) {
    try {
      const response = await fetch(
        `${this.baseUrl}/api/pet/owner?ownerId=${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to get pets data");
      }

      const data = await response.json();
      console.warn(data);
      return data;
    } catch (error) {
      throw error;
    }
  }

  //get pet by id
  async getPetById(id, token) {
    try {
      const response = await fetch(`${this.baseUrl}/api/pet/id?petId=${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to get pet data");
      }

      const data = await response.json();
      console.warn(data);
      return data;
    } catch (error) {
      throw error;
    }
  }

  // add pet
  async addNewPet(petData, token) {
    // Assuming petData is the data you want to send to the server
    console.log("petData:", petData);
    // Make a POST request to the endpoint where the save method is defined
    fetch(`${this.baseUrl}/api/pet`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: petData,
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
        console.log("Pet saved successfully:", data);
      })
      .catch((error) => {
        // Handle any errors that occurred during the fetch
        console.error("Error saving pet:", error.message);
      });
  }

  //update pet profile
  async updatePetProfile(petData, token) {
    // Assuming petData is the data you want to send to the server
    console.log("petData:", petData);
    // Make a POST request to the endpoint where the save method is defined
    fetch(`${this.baseUrl}/api/pet/update`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: petData,
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
        console.log("Pet updated successfully:", data);
      })
      .catch((error) => {
        // Handle any errors that occurred during the fetch
        console.error("Error saving pet:", error.message);
      });
  }

  //delete pet
  async delete(id, token) {
    try {
      const response = await fetch(
        `${this.baseUrl}/api/pet/delete?petId=${id}`,
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

export default new PetsService();
