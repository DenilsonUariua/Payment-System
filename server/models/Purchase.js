require("dotenv").config();
var uniqid = require("uniqid");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { MONGODB_URI } = process.env;

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const purchaseSchema = mongoose.Schema(
  {
    sellerId: {
      type: String,
      required: true
    },
    buyerId: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: [
        "Pending",
        "Completed",
        "Cancelled",
        "Verified",
        "Paid Awaiting Delivery"
      ],
      default: "Pending"
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "products",
      required: true
    },
    purchaseId: {
      type: String,
      required: true,
      default: uniqid("purchase-")
    }
  },
  { timestamps: true }
);

const purchaseModel = mongoose.model("purchase", purchaseSchema);

module.exports = purchaseModel;
