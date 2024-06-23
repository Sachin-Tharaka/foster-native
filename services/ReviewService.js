class ReviewService {
    constructor() {
      this.baseUrl = 'https://fosterpet.azurewebsites.net';
    }
  
    
//get reviews by kennel id
async getReviewsByKennelId(kennelId, token) {
  console.warn("Calling api...");
    try {
      const response = await fetch(`${this.baseUrl}/api/review/kennel?kennelId=${kennelId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          'Authorization': `Bearer ${token}`,
        },
        //mode: 'no-cors'
      });

      if (!response.ok) {
        console.warn('Error.........');
        throw new Error('Failed to get reviews data');
      }
     //console.warn("response " ,response);
      const data = await response.json();
      //console.warn(data);
      return data; 
    } catch (error) {
      throw error;
    }
  }

//get reviews by kennel id
async getReviewsByVolunteerId(id, token) {
  console.warn("Calling api...");
    try {
      const response = await fetch(`${this.baseUrl}/api/review/volunteer?volunteerId=${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          'Authorization': `Bearer ${token}`,
        },
        //mode: 'no-cors'
      });

      if (!response.ok) {
        console.warn('Error.........');
        throw new Error('Failed to get reviews data');
      }
     //console.warn("response " ,response);
      const data = await response.json();
      //console.warn(data);
      return data; 
    } catch (error) {
      throw error;
    }
  }
  
//post a review 
async postReview(data,token) {
  try {
    const response = await fetch(`${this.baseUrl}/api/review`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
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
  export default new ReviewService();
  