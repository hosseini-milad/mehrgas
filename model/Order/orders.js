const mongoose = require("mongoose");

const OrdersSchema = new mongoose.Schema({
  userId:{type: mongoose.Schema.Types.ObjectId, ref: 'user'},
  stockId: {type: mongoose.Schema.Types.ObjectId, ref: 'stocks'},
  manageId: {type: String},
  //frameShape: { type: String },
  stockOrderNo:{type:String},
  carNo: { type: String },

  stockOrderPrice:{type:String},
  stockFaktor:[{type:Object}],
  stockFaktorOrg:[{type:Object}],
  status:{ type: String },
  description:{ type: String },
  date:{ type: Date },
  progressDate:{ type: Date },
});

module.exports = mongoose.model("orders", OrdersSchema);