const mongoose = require("mongoose");
 
const CartSchema = new mongoose.Schema({
  userId: { type: String },
  sku:{ type: String },
  hesabfa:{type: String},
  align:{type: String},
  count:{type: String},
  price:{type: String},
    
  date:{ type: Date },
});

module.exports = mongoose.model("cart", CartSchema);