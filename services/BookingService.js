
class BookingService {
    constructor() {
      //base url
      this.baseUrl = 'https://fosterpet.azurewebsites.net';
    }
  

    //booking function
    async booking(petID,ownerID,kennelID,volunteerID,startDate,endDate,token) {
      try {
        const response = await fetch(`${this.baseUrl}/api/booking`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            petID,
            ownerID,
            kennelID,
            volunteerID,
            startDate,
            endDate,
          }),
        });
  
        if (!response.ok) {
          throw new Error('Error');
        }
  
        const data = await response.json();
        console.warn("response ",data);
        return data; 
      } catch (error) {
        throw error;
      }
    }


  
  }
  
  export default new BookingService();
  

