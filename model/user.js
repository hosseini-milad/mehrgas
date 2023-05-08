const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  phone: { type: String, unique: true },
  cName: { type: String},
  cCode:{ type: String},
  password: { type: String },
  email: { type: String },
  access:{
    type:String,
    enum:["manager","sale","security","customer","shop","request"]
  },
  group: {
    type:String
  },
  credit: { type: String },
  token: { type: String },
  otp:{ type: String , default: null },
  sex: { type: String },
  mahiat: { type: String },
  activity: { type: String },
  phone1: { type: String },
  fax: { type: String },
  state:{ type: String },
  date:{ type: String },
});

module.exports = mongoose.model("user", userSchema);