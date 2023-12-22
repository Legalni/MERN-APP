const bcrypt = require("bcrypt");
const Admin = require("../models/admin");
const User = require("../models/user");
const Transaction = require("../models/transaction");
const mongoose = require("mongoose");

exports.getAdminInformations = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.userId);
    const users = await User.find();

    res.status(200).json({ admin, users });
  } catch (err) {
    console.log(err);
  }
};

exports.addUserTransaction = async (req, res, next) => {
  const username = req.body.username;
  const goods = req.body.goods;
  const quantity = req.body.quantity;
  const price = req.body.price;
  const password = "12345";

  let user;

  try {
    const existingUser = await User.findOne({ username });

    if (!existingUser) {
      const hashedPassword = await bcrypt.hash(password, 12);
      console.log(hashedPassword);

      user = new User({
        username: username,
        email: `${username.toLowerCase()}@gmail.com`,
        password: hashedPassword,
      });
    } else {
      user = existingUser;
    }

    const transactionId = new mongoose.Types.ObjectId();
    const transactionDate = new Date().toISOString();

    let newTransaction;

    if (!goods) {
      newTransaction = {
        _id: transactionId,
        price: -Number(price),
        debt: -Number(price),
        createdAt: transactionDate,
      };
    } else {
      newTransaction = {
        _id: transactionId,
        goods: goods,
        price: price,
        quantity: quantity,
        debt: price * quantity,
        createdAt: transactionDate,
      };
    }

    user.transactions.push(newTransaction);

    const result = await user.save();

    if (!goods) {
      const transaction = new Transaction({
        _id: transactionId,
        price: -Number(price),
        debt: -Number(price),
        creator: result._id,
        createdAt: transactionDate,
      });

      await transaction.save();
    } else {
      const transaction = new Transaction({
        _id: transactionId,
        goods,
        price,
        quantity,
        debt: price * quantity,
        creator: result._id,
        createdAt: transactionDate,
      });

      await transaction.save();
    }

    res.status(200).json({
      message: "Korisnik je uspesno kreiran ili azuriran.",
      newTransaction: newTransaction,
      transactions: result.transactions,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message:
        "Doslo je do greske prilikom dodavanja korisnika ili transakcije.",
    });
  }
};

exports.acceptUserTransaction = async (req, res, next) => {
  const _id = req.body._id;
  const username = req.body.username;
  const price = req.body.price;

  const user = await User.findOne({ username });
  const transactionDate = new Date().toISOString();

  if (!req.body.goods) {
    try {
      const transaction = new Transaction({
        _id,
        price,
        debt: price,
        creator: user._id,
      });

      await transaction.save();

      user.transactions.push({
        _id,
        price,
        debt: price,
        createdAt: transaction.createdAt,
      });

      user.requests = user.requests.filter(
        (request) => _id.toString() !== request._id.toString()
      );

      await user.save();

      res.status(200).json({
        message: "Transakcija je uspesno dodata.",
        transactionId: _id,
      });
    } catch (err) {
      console.log(err);
    }
  } else {
    const goods = req.body.goods;
    const quantity = req.body.quantity;

    try {
      const transaction = new Transaction({
        _id,
        goods,
        price,
        quantity,
        debt: quantity * price,
        creator: user._id,
      });

      await transaction.save();

      user.transactions.push({
        _id,
        goods,
        price,
        quantity,
        debt: price * quantity,
        createdAt: transaction.createdAt,
      });

      user.requests = user.requests.filter(
        (request) => _id.toString() !== request._id.toString()
      );

      await user.save();

      res.status(200).json({
        message: "Transakcija je uspesno dodata.",
        transactionId: _id,
      });
    } catch (err) {
      console.log(err);
    }
  }
};

exports.rejectUserTransaction = async (req, res, next) => {
  const username = req.body.username;
  const _id = req.params.requestId;

  const user = await User.findOne({ username });

  try {
    user.requests = user.requests.filter(
      (request) => _id.toString() !== request._id.toString()
    );

    await user.save();

    res.status(200).json({
      message: "Zahtev je uspesno obrisan.",
      transactionId: _id,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getUserInformations = async (req, res, next) => {
  const username = req.params.username;

  const user = await User.findOne({ username });

  res.status(200).json({ user });
};

exports.getTransactions = async (req, res, next) => {
  try {
    const transactions = await Transaction.find();
    const updatedTransactions = await Promise.all(
      transactions.map(async (transaction) => {
        const user = await User.findById(transaction.creator);

        if (user) {
          transaction = {
            ...transaction.toObject(),
            creator: user.username,
            createdAt: `${transaction.createdAt.getDate()}.${
              transaction.createdAt.getMonth() + 1
            }.${transaction.createdAt.getFullYear()}`,
          };
        }

        return transaction;
      })
    );

    res.status(200).json({ transactions: updatedTransactions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.deleteUser = async (req, res, next) => {
  const userId = req.params.userId;

  try {
    const deletedUser = await User.findByIdAndRemove(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: "Korisnik nije pronadjen." });
    }

    await Transaction.deleteMany({ creator: userId });

    res.status(200).json({
      message: `Korisnik ${deletedUser.username} je uspesno obrisan.`,
    });
  } catch (error) {
    res
      .status(200)
      .json({ message: "Doslo je do greske prilikom brisanja korisnika." });
  }
};

exports.deleteTransaction = async (req, res, next) => {
  const _id = req.params.transactionId;

  try {
    const transaction = await Transaction.findById(_id);
    const user = await User.findById(transaction.creator);
    console.log(user);

    user.transactions = user.transactions.filter(
      (transaction) => _id.toString() !== transaction._id.toString()
    );

    await user.save();

    const deletedTransaction = await Transaction.findByIdAndRemove(_id);

    res.status(200).json({
      message: `Transakcija ${deletedTransaction._id} je uspesno obrisana`,
      transactionId: deletedTransaction._id,
    });
  } catch (err) {
    console.log(err);
  }
};
