
class NotificationService {
    constructor() {
      this.baseUrl = 'https://fosterpet.azurewebsites.net';
    }
//get user by id
async getNotificationsByUserId(id,token) {
    try {
      const response = await fetch(`${this.baseUrl}/api/notification/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        
      });

      if (!response.ok) {
        throw new Error('Failed to get notificaations data');
      }

      const data = await response.json();
      console.warn(data);
      return data; 
    } catch (error) {
      throw error;
    }
  }
}
  
export default new NotificationService();