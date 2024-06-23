class VoulnteerService {
    constructor() {
      this.baseUrl = 'https://fosterpet.azurewebsites.net';
    }
  
    
//get volunteer nearby
async getAllVolunteerNear(longitude, latitude, maxDistance, token) {
  console.warn("Calling api...");
    try {
      const response = await fetch(`${this.baseUrl}/api/volunteer/location?longitude=${longitude}&latitude=${latitude}&maxDistance=${maxDistance}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          'Authorization': `Bearer ${token}`,
        },
        //mode: 'no-cors'
      });

      if (!response.ok) {
        console.warn('Error.........');
        console.log(response);
        throw new Error('Failed to get volunteer data');
      }
     console.warn("response " ,response);
      const data = await response.json();
      console.warn(data);
      return data; 
    } catch (error) {
      throw error;
    }
  }

  //get volunteer by id
async getVolunteerById(id,token) {
  try {
    const response = await fetch(`${this.baseUrl}/api/volunteer/id?volunteerId=${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      
    });

    if (!response.ok) {
      throw new Error('Failed to get volunteer data');
    }

    const data = await response.json();
    console.warn(data);
    return data; 
  } catch (error) {
    throw error;
  }
}

//get volunteer by user id
async getVolunteerByUserId(id,token) {
  try {
    const response = await fetch(`${this.baseUrl}/api/volunteer/user?userId=${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      
    });

    if (!response.ok) {
      throw new Error('Failed to get volunteer data');
    }

    const data = await response.json();
    console.warn(data);
    return data; 
  } catch (error) {
    throw error;
  }
}

//get data by volunteer id
async getVolunteerDataById(id,token) {
  try {
    const response = await fetch(`${this.baseUrl}/api/volunteer/id?volunteerId=${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      
    });

    if (!response.ok) {
      throw new Error('Failed to get volunteer data');
    }

    const data = await response.json();
    console.warn(data);
    return data; 
  } catch (error) {
    throw error;
  }
}

//save volunteer
async saveVolunteer(data,token) {
 
    console.log('data:', data);
  // Make a POST request to the endpoint where the save method is defined
  fetch(`${this.baseUrl}/api/volunteer`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: data
  })
  .then(response => {
        console.log("response body: ",response.body)
      // Check if response status is OK
      if (!response.ok) {
          // If response status is not OK, handle the error
          return response.text().then(errorMessage => {
            throw new Error(errorMessage);
          })
      }
      // If response status is OK, return the JSON response
      return response.json();
  })
  .then(data => {
      // Handle successful response data here
      console.log('Data saved successfully:', data);
  })
  .catch(error => {
      // Handle any errors that occurred during the fetch
      console.error('Error saving data:', error.message);
  });
}

//update volunteer
async updateVolunteer(data,token) {
 
  console.log('data:', data);
// Make a POST request to the endpoint where the save method is defined
fetch(`${this.baseUrl}/api/volunteer/update`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: data
})
.then(response => {
      console.log("response body: ",response.body)
    // Check if response status is OK
    if (!response.ok) {
        // If response status is not OK, handle the error
        return response.text().then(errorMessage => {
          throw new Error(errorMessage);
        })
    }
    // If response status is OK, return the JSON response
    return response.json();
})
.then(data => {
    // Handle successful response data here
    console.log('Data saved successfully:', data);
})
.catch(error => {
    // Handle any errors that occurred during the fetch
    console.error('Error saving data:', error.message);
});
}

//get all volunteers
async getAllVolunteers(token) {
  try {
    const response = await fetch(`${this.baseUrl}/api/volunteer`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      
    });

    if (!response.ok) {
      throw new Error('Failed to get volunteers data');
    }


    const data = await response.json();
    console.warn(data);
    return data; 
  } catch (error) {
    throw error;
  }
}

  }
  
  export default new VoulnteerService();
  