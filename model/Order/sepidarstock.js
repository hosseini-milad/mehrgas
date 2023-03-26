const mongoose = require("mongoose");

const sepidarStockSchema = new mongoose.Schema({
  brandName: {type: String},
  lenzIndex: { type: String },
  material: { type: String },
  coating: { type: String },
  title: { type: String },

  sku:{ type: String , unique: true},
  hesabfa:{type: String},

  sph:{ type: String },
  cyl:{ type: String },
  dia: { type: String },
  add: { type: String },
  align: { type: String },
  design: { type: String },
  lenzType: { type: String },
  
  price: { type: Number },
  purchase: { type: Number }
});

module.exports = mongoose.model("sepidarStock", sepidarStockSchema);