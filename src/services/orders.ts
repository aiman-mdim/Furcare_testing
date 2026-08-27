import {
  Order,
  PaymentMethod,
} from "../types";

import API_BASE_URL from "../config/api";

const request = async (
  url: string,
  options: RequestInit = {}
) => {
  const response = await fetch(url, {
    ...options,

    credentials: "include",

    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  const data = await response
    .json()
    .catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data?.error ||
        data?.message ||
        `Request failed with status ${response.status}`
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
      paymentMethod: PaymentMethod;
      customerEmail?: string;
      customerPhone?: string;
      deliveryAddress?: string;
    }
  ): Promise<Order> => {
    const data = await request(
      `${API_BASE_URL}/api/orders`,
      {
        method: "POST",

        body: JSON.stringify(
          orderData
        ),
      }
    );

    return data.order;
  },

  getMyOrders:
    async (): Promise<Order[]> => {
      const data = await request(
        `${API_BASE_URL}/api/orders/my-orders`
      );

      return data.orders;
    },
};
