class ChatService {

    constructor() {
        this.baseUrl = 'https://fosterpet.azurewebsites.net';
    }
  async fetchMessagePreviews(token, userId) {
      try {
          const response = await fetch(`${this.baseUrl}/api/chat/get-chat-previews-by-user?userId=${userId}`, {
              method: 'GET',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`,
              },

          });

          if (!response.ok) {
              throw new Error('Failed to get chat data');
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
            const response = await fetch(`${this.baseUrl}/api/chat/get-messages?chatThreadId=${chatId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },

            });

            if (!response.ok) {
                throw new Error('Failed to get chat data');
            }

            const data = await response.json();
            //console.warn(data);
            return data;
        } catch (error) {
            throw error;
        }
    }

    async sendMessage(token, formData) {
        fetch(`${this.baseUrl}/api/chat/send-message`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        })
            .then(response => {
                console.log("response body: ", response.body)
                // Check if response status is OK
                if (!response.ok) {
                    // If response status is not OK, handle the error
                    return response.text().then(errorMessage => {
                        throw new Error(errorMessage);
                    })
                }
                // If response status is OK, return the JSON response
                return response;
            })
    }
}

export default new ChatService();
