
class PetsService {
    constructor() {
      this.baseUrl = 'https://fosterpet.azurewebsites.net';
    }

//get pets by owner id
async getPetsByOwnerId(id,token) {
    try {
      const response = await fetch(`${this.baseUrl}/api/pet/owner?ownerId=${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        
      });

      if (!response.ok) {

        throw new Error('Failed to get pets data');

      }

      const data = await response.json();
      console.warn(data);
      return data; 
    } catch (error) {
      throw error;
    }
  }


  //get pet by id
  async getPetById(id,token) {
    try {
      const response = await fetch(`${this.baseUrl}/api/pet/id?petId=${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to get pet data');
      }
  
      const data = await response.json();
      console.warn(data);
      return data; 
    } catch (error) {
      throw error;
    }
  }
  

}
  
export default new PetsService();