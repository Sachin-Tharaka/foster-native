class BookingService {
  constructor() {
    //base url
    this.baseUrl = "https://fosterpet.azurewebsites.net";
  }

  //booking function
  async booking(data, token) {
    console.log("Booking data: ", data);
    try {
      const response = await fetch(`${this.baseUrl}/api/booking`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      console.log("Response from server:", response);

      if (!response.ok) {
        console.error(
          "Server returned error:",
          response.status,
          response.statusText
        );
        const errorText = await response.text();
        console.error("Server error message:", errorText);
        throw new Error("Failed to complete booking");
      }

      const responseData = await response.json();
      console.log("Booking successful:", responseData);
      return responseData;
    } catch (error) {
      console.error("Error booking:", error.message);
      throw error;
    }
  }

  //update booking
  async updateBooking(data, token) {
    console.log("Booking data: ", data);
    try {
      const response = await fetch(`${this.baseUrl}/api/booking/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      console.log("Response from server:", response);

      if (!response.ok) {
        console.error(
          "Server returned error:",
          response.status,
          response.statusText
        );
        const errorText = await response.text();
        console.error("Server error message:", errorText);
        throw new Error("Failed to complete booking");
      }

      const responseData = await response.json();
      console.log("Booking successful:", responseData);
      return responseData;
    } catch (error) {
      console.error("Error booking:", error.message);
      throw error;
    }
  }

  //get booking by kennek id
  async getBookingByKennelId(kennelId, token) {
    console.warn("Calling api...");
    try {
      const response = await fetch(
        `${this.baseUrl}/api/booking/kennelId?kennelId=${kennelId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json;charset=utf-8",
            Authorization: `Bearer ${token}`,
          },
          //mode: 'no-cors'
        }
      );

      if (!response.ok) {
        console.warn("Error.........");
        throw new Error("Failed to get booking data");
      }
      //console.warn("response " ,response);
      const data = await response.json();
      //console.warn(data);
      return data;
    } catch (error) {
      throw error;
    }
  }

  //get booking by volunteer id
  async getBookingByVolunteerId(id, token) {
    console.warn("Calling api...");
    try {
      const response = await fetch(
        `${this.baseUrl}/api/booking/volunteerId?volunteerId=${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json;charset=utf-8",
            Authorization: `Bearer ${token}`,
          },
          //mode: 'no-cors'
        }
      );

      if (!response.ok) {
        console.warn("Error.........");
        throw new Error("Failed to get booking data");
      }
      //console.warn("response " ,response);
      const data = await response.json();
      //console.warn(data);
      return data;
    } catch (error) {
      throw error;
    }
  }

  //get booking by user id
  async getBookingByUserId(id, token) {
    console.warn("Calling api...");
    try {
      const response = await fetch(
        `${this.baseUrl}/api/booking/owner?ownerId=${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json;charset=utf-8",
            Authorization: `Bearer ${token}`,
          },
          //mode: 'no-cors'
        }
      );

      if (!response.ok) {
        console.warn("Error.........");
        throw new Error("Failed to get booking data");
      }
      //console.warn("response " ,response);
      const data = await response.json();
      //console.warn(data);
      return data;
    } catch (error) {
      throw error;
    }
  }

  //get all booking
  async getBooking(token) {
    console.warn("Calling api...");
    try {
      const response = await fetch(`${this.baseUrl}/api/booking`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
          Authorization: `Bearer ${token}`,
        },
        //mode: 'no-cors'
      });

      if (!response.ok) {
        console.warn("Error.........");
        throw new Error("Failed to get booking data");
      }
      //console.warn("response " ,response);
      const data = await response.json();
      //console.warn(data);
      return data;
    } catch (error) {
      throw error;
    }
  }

  //cancel booking
  async cancelBooking(id, token) {
    try {
      const response = await fetch(
        `${this.baseUrl}/api/booking/cancel?bookingId=${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        console.error(
          "Server returned error:",
          response.status,
          response.statusText
        );
        throw new Error("Failed to cancel booking");
      }

      const data = await response.json();
      console.log("Cancelled:", data);
      return data;
    } catch (error) {
      console.error("Error canceling booking:", error.message);
      throw error;
    }
  }

  //reject
  async rejectBooking(id, token) {
    try {
      const response = await fetch(
        `${this.baseUrl}/api/booking/reject?bookingId=${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Response from server:", response);

      if (!response.ok) {
        console.error(
          "Server returned error:",
          response.status,
          response.statusText
        );
        throw new Error("Failed to reject booking");
      }

      const data = await response.json();
      console.log("Booking rejected:", data);
      return data;
    } catch (error) {
      console.error("Error booking:", error.message);
      throw error;
    }
  }

  //confirm
  async confirmBooking(id, token) {
    try {
      const response = await fetch(
        `${this.baseUrl}/api/booking/confirm?bookingId=${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Response from server:", response);

      if (!response.ok) {
        console.error(
          "Server returned error:",
          response.status,
          response.statusText
        );
        throw new Error("Failed to confirm booking");
      }

      const data = await response.json();
      console.log("Booking confirmed successful:", data);
      return data;
    } catch (error) {
      console.error("Error booking:", error.message);
      throw error;
    }
  }

  async changeBookingStatusToOngoing(id, token) {
    try {
      const response = await fetch(
        `${this.baseUrl}/api/booking/ongoing?bookingId=${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Response from server:", response);

      if (!response.ok) {
        console.error(
          "Server returned error:",
          response.status,
          response.statusText
        );
        throw new Error("Failed to change booking status");
      }

      const data = await response.json();
      console.log("Status changed successful:", data);
      return data;
    } catch (error) {
      console.error("Error booking:", error.message);
      throw error;
    }
  }

  //completed
  async changeBookingStatusToCompleted(id, token) {
    console.log("id: ", id);
    try {
      const response = await fetch(
        `${this.baseUrl}/api/booking/complete?bookingId=${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Response from server:", response);

      if (!response.ok) {
        console.error(
          "Server returned error:",
          response.status,
          response.statusText
        );
        const errorText = await response.text();
        console.error("Server error message:", errorText); // Log the error message from the server
        throw new Error("Failed to change status");
      }

      const data = await response.json();
      console.log("Booking status changed successfully:", data);
      return data;
    } catch (error) {
      console.error("Error changing booking status:", error.message);
      throw error;
    }
  }
}

export default new BookingService();
