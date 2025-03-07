const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TruckUserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const TruckUser = mongoose.model("TruckUser", TruckUserSchema, "TruckUsers");
module.exports = TruckUser;
