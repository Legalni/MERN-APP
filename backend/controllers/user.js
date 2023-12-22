const User = require("../models/user");
const Transaction = require("../models/transaction");

exports.getUserInformations = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    res.status(200).json({ user: user });
  } catch (err) {
    console.log(err);
  }
};

exports.postTransaction = async (req, res, next) => {
  if (!req.body.goods) {
    const price = -Number(req.body.price);
    try {
      const user = await User.findById(req.userId);
      user.requests.push({
        price: price,
        debt: price,
        creator: req.userId,
      });
      await user.save();
      res.status(200).json({ user: req.userId });
    } catch (err) {
      console.log(err);
    }
  } else {
    const goods = req.body.goods;
    const quantity = req.body.quantity;
    const price = req.body.price;
    try {
      const user = await User.findById(req.userId);
      user.requests.push({
        goods: goods,
        price: price,
        quantity: quantity,
        debt: price * quantity,
        creator: req.userId,
      });
      await user.save();
      res.status(200).json({ user: req.userId });
    } catch (err) {
      console.log(err);
    }
  }
};

exports.getTransactions = async (req, res, next) => {
  try {
    const user = User.findById(req.userId);
    console.log(user);
  } catch (err) {
    console.log(err);
  }
};
