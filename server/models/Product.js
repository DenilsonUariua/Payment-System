require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { MONGODB_URI } = process.env;

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    image: {
      type: String,
      required: true
    },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true
    },
    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user"
    },
    status: {
      type: String,
      enum: ["Available", "Sold", "Payment Pending"],
      default: "Available"
    }
  },
  { timestamps: true }
);

const productModel = mongoose.model("products", productSchema);

module.exports = productModel;
