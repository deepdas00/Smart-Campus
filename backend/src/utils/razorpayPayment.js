import Razorpay from "razorpay";
import { ApiError } from "./apiError.js";

import crypto from "crypto"
export const getRazorpayInstance = () => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error("Razorpay keys are missing in .env");
  }

  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
};



// =======================
// CREATE RAZORPAY ORDER
// =======================
export const createRazorpayOrderUtil = async ({
  amount,
  receipt,
  saveOrderIdFn
}) => {

  if (amount <= 0) throw new ApiError(400, "Invalid payment amount");

  const razorpayOrder = await getRazorpayInstance().orders.create({
    amount: amount * 100,
    currency: "INR",
    receipt
  });

  await saveOrderIdFn(razorpayOrder.id);

  return {
    razorpayOrderId: razorpayOrder.id,
    amount: razorpayOrder.amount,
    currency: razorpayOrder.currency,
    key: process.env.RAZORPAY_KEY_ID
  };
};


// =======================
// VERIFY RAZORPAY PAYMENT
// =======================
export const verifyRazorpayPaymentUtil = async ({
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature
}) => {

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    throw new ApiError(400, "Payment verification data missing");
  }

  const generatedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (generatedSignature !== razorpay_signature) {
    throw new ApiError(400, "Invalid payment signature");
  }

  return true;
};
