const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const roomSchema = new Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true, min: 1 },
  maxPeople: { type: Number, required: true, min: 1, max: 6 },
  desc: { type: String, required: true },
  roomNumbers: { type: [String], required: true },
  createdAt: { type: Date },
  updatedAt: { type: Date },
});

module.exports = mongoose.model("Room", roomSchema);
