require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { MONGODB_URI } = process.env;

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const customerSchema = mongoose.Schema(
  {
    fullname: String,
    idNumber: {
      type: String,
      unique: true,
      required: true,
    },
    cellphone: {
      type: String,
      required: true,
    },
    altCellphone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    idUrl: {
      type: String,
      required: true,
    },
    waterElecBillUrl: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["Customer", "Entrepreneur"],
      default: "Customer",
    },
  },
  { timestamps: true }
);

customerSchema.pre("save", function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = bcrypt.hashSync(this.password, 10);
  next();
});

customerSchema.methods.comparePassword = function (plaintext, callback) {
  return callback(null, bcrypt.compareSync(plaintext, this.password));
};

const userModel = mongoose.model("customer", customerSchema);

module.exports = userModel;
