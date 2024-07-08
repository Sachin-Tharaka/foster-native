class InvoiceService {
  constructor() {
    this.baseUrl = "https://fosterpet.azurewebsites.net";
  }

  //get pets by owner id
  async getInvoiceByUserId(id, token) {
    try {
      const response = await fetch(
        `${this.baseUrl}/api/payment/get-invoices-by-user?userId=${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to get invoice data");
      }

      const data = await response.json();
      console.warn(data);
      return data;
    } catch (error) {
      throw error;
    }
  }
}

export default new InvoiceService();
