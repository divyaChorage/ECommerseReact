// db/Order.js

const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "products", required: true },
  categoryId: { type: mongoose.Schema.Types.ObjectId, required: true },
  categoryName: { type: String, required: true },
  price: { type: String, required: true },
  quality: { type: String, required: true },
  description: { type: String, required: true },
  pincode: { type: String, required: true },
  address: { type: String, required: true },
  todayDate: { type: Date, default: Date.now },
  orderWillReachDate: { type: Date, required: true },
  otp: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true }, // Assuming you have a User schema
});

module.exports = mongoose.model("Order", orderSchema);
