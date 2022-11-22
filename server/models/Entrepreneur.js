require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { MONGODB_URI } = process.env;

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const entrepreneurSchema = mongoose.Schema(
  {
    fullname: String,
    idNumber: {
      type: String,
      unique: true,
      required: true
    },
    cellphone: {
      type: String,
      required: true
    },
    altCellphone: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    businessName: {
      type: String,
      unique: true,
      required: true
    },
    businessResgistrationNo: {
      type: String,
      unique: true,
      required: true
    },
    socialSecurityNumber: {
      type: String,
      unique: true,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    idUrl: {
      type: String,
      required: true
    },
    waterElecBillUrl: {
      type: String,
      required: true
    },
    socialSecurityEmployerCertUrl: {
      type: String,
      required: true
    },
    certificateOfIncorporationUrl: {
      type: String,
      required: true
    },
    policeClearanceUrl: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ["Customer", "Entrepreneur"],
      default: "Entrepreneur",
    },
  },
  { timestamps: true }
);

entrepreneurSchema.pre("save", function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = bcrypt.hashSync(this.password, 10);
  next();
});

entrepreneurSchema.methods.comparePassword = function (plaintext, callback) {
  return callback(null, bcrypt.compareSync(plaintext, this.password));
};

const userModel = mongoose.model("entrepreneur", entrepreneurSchema);

module.exports = userModel;
