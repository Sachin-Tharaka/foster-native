class ReviewService {
  constructor() {
    this.baseUrl = "https://fosterpet.azurewebsites.net";
  }

  //get reviews by kennel id
  async getReviewsByKennelId(kennelId) {
    console.warn("Calling api...");
    try {
      const response = await fetch(
        `${this.baseUrl}/api/review/kennel?kennelId=${kennelId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json;charset=utf-8",
           // Authorization: `Bearer ${token}`,
          },
          //mode: 'no-cors'
        }
      );

      if (!response.ok) {
        console.warn(
          "Response from server for review:",
          response.status,
          response.statusText
        );
        const errorMessage = await response.text();
        console.error("Server error message for  review:", errorMessage);
        throw new Error(errorMessage);
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
  async getReviewsByVolunteerId(id) {
    console.warn("Calling api...");
    try {
      const response = await fetch(
        `${this.baseUrl}/api/review/volunteer?volunteerId=${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json;charset=utf-8",
            //Authorization: `Bearer ${token}`,
          },
          //mode: 'no-cors'
        }
      );

      if (!response.ok) {
        console.warn(
          "Response from server for review:",
          response.status,
          response.statusText
        );
        const errorMessage = await response.text();
        console.error("Server error message for  review:", errorMessage);
        throw new Error(errorMessage);
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
  async postReview(data, token) {
    console.log("review: ", data);
    try {
      const response = await fetch(`${this.baseUrl}/api/review`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        console.error(
          "Server returned error:",
          response.status,
          response.statusText
        );
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const responseData = await response.json();
      console.warn("response ", responseData);
      return responseData;
    } catch (error) {
      console.error("Error:", error.message);
      throw error;
    }
  }
}
export default new ReviewService();
