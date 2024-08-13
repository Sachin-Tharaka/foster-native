class ChatService {
  constructor() {
    this.baseUrl = "https://fosterpet.azurewebsites.net";
  }
  async fetchMessagePreviews(token, userId) {
    try {
      const response = await fetch(
        `${this.baseUrl}/api/chat/get-chat-previews-by-user?userId=${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to get chat data");
      }

      const data = await response.json();
      //console.warn(data);
      return data;
    } catch (error) {
      throw error;
    }
  }

  async fetchMessages(token, chatId) {
    try {
      const response = await fetch(
        `${this.baseUrl}/api/chat/get-messages?chatThreadId=${chatId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to get chat data");
      }

      const data = await response.json();
      //console.warn(data);
      return data;
    } catch (error) {
      throw error;
    }
  }

  async sendMessage(token, formData) {
    try {
      console.log("Sending message...");
      const response = await fetch(`${this.baseUrl}/api/chat/send-message`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      console.log(response);
      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
      }
      return await response.json(); // Ensure the response is returned in JSON format
    } catch (error) {
      throw error;
    }
  }

    async createChat(token, userId, kennelId) {
      try {
        const response = await fetch(
            `${this.baseUrl}/api/chat/create-chat-thread`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                userId: userId,
                kennelId: kennelId,
              }),
            }
        );

        if (!response.ok) {
          throw new Error("Failed to create chat thread");
        }

        const data = await response.json();
        return data;
      } catch (error) {
        throw error;
      }
    }
}

export default new ChatService();
