
class UserService {
    constructor() {
      this.baseUrl = 'https://fosterpet.azurewebsites.net';
    }
//get user by id
async getUserById(id,token) {
    try {
      const response = await fetch(`${this.baseUrl}/api/user/id?id=${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        
      });

      if (!response.ok) {
        throw new Error('Failed to get user data');
      }

      const data = await response.json();
      console.warn(data);
      return data; 
    } catch (error) {
      throw error;
    }
  }
}
  
export default new UserService();