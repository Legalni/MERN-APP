const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  requests: [
    {
      transactionId: {
        type: Schema.Types.ObjectId,
        ref: "Transaction",
      },
      goods: {
        type: String,
      },
      price: {
        type: Number,
      },
      quantity: {
        type: Number,
      },
      debt: {
        type: Number,
      },
    },
    ,
  ],
  transactions: [
    {
      transactionId: {
        type: Schema.Types.ObjectId,
        ref: "Transaction",
      },
      goods: {
        type: String,
      },
      price: {
        type: Number,
      },
      quantity: {
        type: Number,
      },
      debt: {
        type: Number,
      },
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
