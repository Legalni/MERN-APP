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
        required: true,
      },
      quantity: {
        type: Number,
      },
      debt: {
        type: Number,
        required: true,
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
        required: true,
      },
      quantity: {
        type: Number,
      },
      debt: {
        type: Number,
        required: true,
      },
      createdAt: {
        type: Date,
        required: true,
      },
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
