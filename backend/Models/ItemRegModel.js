const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema({
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "tbl_category", required: true },
  addDate: { type: Date, required: true },
  campId: { type: mongoose.Schema.Types.ObjectId, ref: "tbl_camp", required: true },
  totalQuantity: { type: Number, required: true }, // Ensure this is defined and required
  usedQuantity: { type: Number, default: 0 },
  description: { type: String }
});

ItemSchema.virtual('availableQuantity').get(function () {
  return this.totalQuantity - this.usedQuantity;
});

ItemSchema.set('toJSON', { virtuals: true });
ItemSchema.set('toObject', { virtuals: true });


const Item = mongoose.model("tbl_items", ItemSchema);
module.exports = Item;
