const bcrypt = require("bcrypt");
const Admin = require("../models/admin");
const User = require("../models/user");
const Transaction = require("../models/transaction");

exports.getAdminInformations = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.userId);
    const users = await User.find();

    res.status(200).json({ admin, users });
  } catch (err) {
    console.log(err);
  }
};

exports.addUser = async (req, res, next) => {
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

    user.transactions.push({
      goods: goods,
      price: price,
      quantity: quantity,
      debt: price * quantity,
    });

    const result = await user.save();

    const transaction = new Transaction({
      price: price,
      debt: price,
      creator: result._id,
    });

    await transaction.save();

    res.status(200).json({
      message: "Korisnik je uspešno kreiran ili ažuriran.",
      userId: result._id.toString(),
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message:
        "Došlo je do greške prilikom dodavanja korisnika ili transakcije.",
    });
  }
};

exports.acceptGoodsTransaction = async (req, res, next) => {
  const _id = req.body._id;
  const username = req.body.username;
  const goods = req.body.goods;
  const quantity = req.body.quantity;
  const price = req.body.price;

  try {
    const user = await User.findOne({ username });

    console.log(user);
    user.transactions.push({
      _id,
      goods,
      price,
      quantity,
      debt: price * quantity,
    });

    user.requests = user.requests.filter(
      (request) => _id.toString() !== request._id.toString()
    );

    const result = await user.save();

    const transaction = new Transaction({
      _id,
      price,
      debt: price,
      creator: result._id,
    });

    await transaction.save();

    res.status(200).json({
      message: "Transakcija je uspesno dodata.",
      userId: result._id.toString(),
    });
  } catch (err) {
    console.log(err);
  }
};
