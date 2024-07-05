class NotificationService {
  constructor() {
    this.baseUrl = "https://fosterpet.azurewebsites.net";
  }
  //get user by id
  async getNotificationsByUserId(id, token) {
    try {
      const response = await fetch(`${this.baseUrl}/api/notification/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to get notificaations data");
      }

      const data = await response.json();
      console.warn(data);
      return data;
    } catch (error) {
      throw error;
    }
  }

  async sendNotification(data, token) {
    console.log("notification data: ", data);
    console.log("token: ", token);

    try {
      const response = await fetch(
        `${this.baseUrl}/api/notification/expoNotification`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        console.error(
          "Server returned error:",
          response.status,
          response.statusText
        );
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const responseData = await response.json();
      console.warn("notification response: ", responseData);
      return responseData;
    } catch (error) {
      console.error("Error:", error.message);
      throw error;
    }
  }
}

export default new NotificationService();
