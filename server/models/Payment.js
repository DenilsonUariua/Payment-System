require("dotenv").config();
const mongoose = require("mongoose");
const { MONGODB_URI } = process.env;

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const paymentSchema = mongoose.Schema(
  {
    purchaseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "purchase",
        required: true
    },
    status: {
      type: String,
      enum: ["Pending", "Paid"],
      default: "Pending"
    }
  },
  { timestamps: true }
);

const paymentModel = mongoose.model("payments", paymentSchema);

module.exports = paymentModel;
