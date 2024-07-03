class UserService {
  constructor() {
    this.baseUrl = "https://fosterpet.azurewebsites.net";
  }
  //get user by id
  async getUserById(id, token) {
    try {
      const response = await fetch(`${this.baseUrl}/api/user/id?id=${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to get user data");
      }

      const data = await response.json();
      console.warn(data);
      return data;
    } catch (error) {
      throw error;
    }
  }

  //update user
  async updateUser(formData, token) {
    console.log("User data:", formData);

    try {
      const response = await fetch(`${this.baseUrl}/api/user/update`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        console.log(
          "Response from server:",
          response.status,
          response.statusText
        );
        const errorMessage = await response.text();
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log("User Profile updated successfully:", data);
      return data;
    } catch (error) {
      console.error("Error saving user:", error.message);
      throw error;
    }
  }

  //delete user
  async delete(id, token) {
    try {
      const response = await fetch(`${this.baseUrl}/api/user/delete?id=${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

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

export default new UserService();
