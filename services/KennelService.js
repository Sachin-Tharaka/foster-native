class KennelService {
    constructor() {
      this.baseUrl = 'https://fosterpet.azurewebsites.net';
    }
  
    //get all kennels
    async getAllKennel(token) {
        try {
          const response = await fetch(`${this.baseUrl}/api/kennel`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            
          });
    
          if (!response.ok) {
            throw new Error('Failed to get kennel data');
          }
    
          const data = await response.json();
          console.warn(data);
          return data; 
        } catch (error) {
          throw error;
        }
      }
//get kennel nearby
async getAllKennelNear(longitude, latitude, maxDistance, token) {
  console.warn("Calling api...");
    try {
      const response = await fetch(`${this.baseUrl}/api/kennel/near?longitude=${longitude}&latitude=${latitude}&maxDistance=${maxDistance}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          'Authorization': `Bearer ${token}`,
        },
        //mode: 'no-cors'
      });

      if (!response.ok) {
        console.warn('Error.........');
        throw new Error('Failed to get kennel data');
      }
     console.warn("response " ,response);
      const data = await response.json();
      console.warn(data);
      return data; 
    } catch (error) {
      throw error;
    }
  }

  //get kennel by id
async getKennelById(id,token) {
  try {
    const response = await fetch(`${this.baseUrl}/api/kennel/id?kennelId=${id}`, {
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
  
  export default new KennelService();
  