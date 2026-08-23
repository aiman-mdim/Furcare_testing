import {
  Order,
  PaymentMethod,
} from "../types";


const request = async (
  url: string,
  options: RequestInit = {}
) => {

  const response =
    await fetch(
      url,
      {
        credentials:
          "include",

        headers: {
          "Content-Type":
            "application/json",

          ...(options.headers || {}),
        },

        ...options,
      }
    );


  const data =
    await response.json();


  if (!response.ok) {

    throw new Error(
      data.error ||
      "Something went wrong"
    );

  }


  return data;
};


export const ordersApi = {

  createOrder: async (
    orderData: {
      items: any[];

      subtotal: number;

      deliveryFee: number;

      totalAmount: number;

      paymentMethod:
        PaymentMethod;

      customerEmail?: string;

      customerPhone?: string;

      deliveryAddress?: string;
    }
  ): Promise<Order> => {

    const data =
      await request(
        "/api/orders",
        {
          method: "POST",

          body:
            JSON.stringify(
              orderData
            ),
        }
      );


    return data.order;
  },


  getMyOrders:
    async (): Promise<Order[]> => {

      const data =
        await request(
          "/api/orders/my-orders"
        );


      return data.orders;
    },
};