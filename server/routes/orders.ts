import { Router } from "express";

import {
  requireAuth,
  AuthRequest,
} from "../middleware/auth";

import { Order } from "../models/Order";
import { User } from "../models/User";

const router = Router();


function generateOrderId() {
  const random =
    Math.floor(
      100000 + Math.random() * 900000
    );

  return `FC-${Date.now()}-${random}`;
}


/*
|--------------------------------------------------------------------------
| CREATE ORDER
|--------------------------------------------------------------------------
*/

router.post(
  "/",
  requireAuth,
  async (
    req: AuthRequest,
    res
  ) => {
    try {
      const {
        items,
        subtotal,
        deliveryFee,
        totalAmount,
        paymentMethod,
        customerEmail,
        customerPhone,
        deliveryAddress,
      } = req.body;


      if (
        !Array.isArray(items) ||
        items.length === 0
      ) {
        return res.status(400).json({
          error: "Cart is empty",
        });
      }


      /*
      ------------------------------------------
      ADOPTION CHECK
      ------------------------------------------
      */

      const hasOnlyAdoptionItems =
        items.every(
          (item: any) =>
            item.type === "adoption"
        );


      let paymentStatus:
        | "pending"
        | "paid"
        | "not_required" =
        "pending";


      let orderStatus:
        | "pending"
        | "confirmed" =
        "confirmed";


      /*
      ------------------------------------------
      FREE ADOPTION
      ------------------------------------------
      */

      if (
        hasOnlyAdoptionItems ||
        Number(totalAmount) === 0
      ) {
        paymentStatus =
          "not_required";

        orderStatus =
          "pending";
      }


      /*
      ------------------------------------------
      SIMULATED PAYMENT
      ------------------------------------------
      */

      else if (
        paymentMethod === "visa" ||
        paymentMethod === "mastercard" ||
        paymentMethod === "american_express" ||
        paymentMethod === "bkash"
      ) {
        paymentStatus =
          "paid";

        orderStatus =
          "confirmed";
      }


      /*
      ------------------------------------------
      CASH PAYMENT
      ------------------------------------------
      */

      else if (
        paymentMethod === "cash"
      ) {
        paymentStatus =
          "pending";

        orderStatus =
          "confirmed";
      }


      const order =
        await Order.create({
          orderId:
            generateOrderId(),

          userId:
            req.userId,

          items,

          subtotal:
            Number(subtotal),

          deliveryFee:
            Number(deliveryFee),

          totalAmount:
            Number(totalAmount),

          paymentMethod:
            hasOnlyAdoptionItems
              ? "none"
              : paymentMethod,

          paymentStatus,

          orderStatus,

          customerEmail,

          customerPhone,

          deliveryAddress,
        });


      /*
      ------------------------------------------
      PREMIUM ACTIVATION
      ------------------------------------------
      */

      const hasPremium =
        items.some(
          (item: any) =>
            item.type ===
            "premium_plan"
        );


      if (hasPremium) {
        await User.findByIdAndUpdate(
          req.userId,
          {
            isPremium: true,
          }
        );
      }


      return res.status(201).json({
        message:
          "Order created successfully",

        order,
      });

    } catch (error) {

      console.error(
        "Order creation error:",
        error
      );

      return res.status(500).json({
        error:
          "Failed to create order",
      });
    }
  }
);


/*
|--------------------------------------------------------------------------
| GET MY ORDERS
|--------------------------------------------------------------------------
*/

router.get(
  "/my-orders",
  requireAuth,
  async (
    req: AuthRequest,
    res
  ) => {
    try {

      const orders =
        await Order.find({
          userId:
            req.userId,
        })
          .sort({
            createdAt: -1,
          });


      return res.json({
        orders,
      });

    } catch (error) {

      console.error(
        "Get orders error:",
        error
      );

      return res.status(500).json({
        error:
          "Failed to load orders",
      });
    }
  }
);


export default router;
