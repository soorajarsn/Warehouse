const database = require("../models/database");
const ObjectID = require("mongodb").ObjectID;
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const saveProduct = async (req, res) => {
  const { name, stocks, price, color, productClass, category, subCategory, brand, sizes, sStocks, mStocks, lStocks, xlStocks } = req.body;
  const reviews = [],
    rating = 5;
  const imageAddresses = [];
  if (req.files) {
    const images = { ...req.files };
    for (const img in images) {
      const file = images[img];
      const mimetype = file.mimetype;
      if (mimetype === "image/png" || mimetype === "image/jpeg") {
        console.log(file);
        imgFile = file.name;
        imageAddresses.push(`../assets/${imgFile}`);
        file.mv(path.join(__dirname, `../../client/views/public/assets/${imgFile}`), function (err) {
          if (err) {
            console.log("Error occured while saving the file : ", err);
            return res.status(501).json({ errorMsg: "Couldn't save the product, Error while saving the image" });
          }
        });
      } else {
        return res.status(400).json({ errorMsg: "Bad file uploaded as image" });
      }
    }
    let sizeWiseStocks = null;
    sizes.split(",").forEach(size => {
      if (!sizeWiseStocks) sizeWiseStocks = [];
      sizeWiseStocks.push({
        size,
        stocks: parseInt(eval(size.toLowerCase() + "Stocks")),
      });
    });
    doc = {
      name,
      stocks: parseInt(stocks),
      price: parseInt(price),
      color,
      productClass,
      category,
      subCategory,
      brand,
      rating,
      reviews,
      sizes: sizes.split(","),
      sizeWiseStocks: [
        { size: "S", stocks: parseInt(sStocks) },
        { size: "M", stocks: parseInt(mStocks) },
        { size: "L", stocks: parseInt(lStocks) },
        { size: "XL", stocks: parseInt(xlStocks) },
      ],
      imageAddresses,
    };
    console.log(doc);
    database.insertOne(await database.getNamespace("products"), doc);
    return res.status(200).json({ errorMsg: "Passed" });
  } else {
    console.log("no files in request");
  }
};

const signup = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  console.log(req.body);
  if (firstName && lastName && email && password) {
    const namespace = await database.getNamespace("users");
    var isPresent = await database.findOne(namespace, { email });
    if (isPresent) return res.send({ errorMsg: "This Email is Already Registered" });
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(password, salt, async (err, hash) => {
        if (err) throw err;
        await database.insertOne(namespace, { firstName, lastName, email, password: hash, cart: [] });
        var user = await database.findOne(namespace, { email });
        jwt.sign({ id: user._id }, config.get("jwtSecret"), { expiresIn: 60 * 60 }, (err, token) => {
          if (err) throw err;
          return res.status(200).send({ token });
        });
      });
    });
  } else {
    return res.send({ errorMsg: "Please Fill in all the fields" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  console.log({ email, password });
  if (email && password) {
    const namespace = await database.getNamespace("users");
    var user = await database.findOne(namespace, { email });
    if (user) {
      bcrypt.compare(password, user.password).then(isMatch => {
        if (!isMatch) return res.send({ errorMsg: "Please Check your Password" });
        jwt.sign({ id: user._id }, config.get("jwtSecret"), { expiresIn: 60 * 60 }, (err, token) => {
          if (err) throw err;
          return res.status(200).send({ token });
        });
      });
    } else return res.send({ errorMsg: "Please Check your Email" });
  } else {
    return res.send({ errorMsg: "Please Fill in all the fields" });
  }
};

const recover = async (req, res) => {
  const { email } = req.body;
  if (email) {
    var user = await database.findOne(await database.getNamespace("users"), { email });
    if (user) {
      return res.send({ errorMsg: "We have sent the link to your registered Email to recover your password" });
    } else return res.send({ errorMsg: "We can't find any account" });
  } else {
    return res.send({ errorMsg: "Please Fill in the Email" });
  }
};

const address = async (req, res) => {
  const token = req.header("x-auth-token");
  const address = req.body;
  let addresses = [];
  if (!token) return res.status(401).send({ errorMsg: "unauthenticated" });
  try {
    const decoded = jwt.verify(token, config.get("jwtSecret"));
    const namespace = await database.getNamespace("users");
    let user = await database.findOne(namespace, { _id: new ObjectID(decoded.id) });
    if (user) {
      let addressByThisZipcode = await database.findOne(namespace, { _id: new ObjectID(decoded.id), "addresses.zipCode": address.zipCode });
      if (addressByThisZipcode) return res.status(400).send({ errorMsg: "This zipCode is already available" });
      else {
        if (user.addresses && user.addresses.length > 0 && address.isDefault) {
          await namespace.updateOne({ _id: new ObjectID(decoded.id), "addresses.isDefault": true }, { $set: { "addresses.$.isDefault": false } });
          await namespace.updateOne({ _id: new ObjectID(decoded.id) }, { $push: { addresses: { $each: [address], $position: 0 } } });
          addresses = (await database.findOne(namespace, { _id: new ObjectID(decoded.id) })).addresses;
          addresses = addresses || [];
          return res.status(200).send({ addresses });
        } else {
          if (!user.addresses || user.addresses.length === 0) address.isDefault = true;
          await namespace.updateOne({ _id: new ObjectID(decoded.id) }, { $push: { addresses: address } });
          user = await database.findOne(namespace, { _id: new ObjectID(decoded.id) });
          addresses = user.addresses;
          addresses = addresses || [];
          return res.status(200).send({ addresses });
        }
      }
    } else {
      return res.status(401).send({ errorMsg: "unauthenticated" });
    }
  } catch (e) {
    console.log(e);
    return res.status(500).send({ errorMsg: "Something went wrong" });
  }
};

const addCart = async (req, res) => {
  const token = req.header("x-auth-token");
  const { id, size, address } = req.body;
  if (!id || !size || !address) return res.status(401).send({ errorMsg: "id, size, address required" });
  if (!token) return res.status(401).send({ errorMsg: "unauthenticated" });
  let decoded;
  try {
    const decoded = jwt.verify(token, config.get("jwtSecret"));
    const namespace = await database.getNamespace("users");
    const productNamespace = await database.getNamespace("products");
    let user = await database.findOne(namespace, { _id: new ObjectID(decoded.id) });
    if (user) {
      const products = await database.findOne(productNamespace, { _id: new ObjectID(id) });
      if (products) {
        const address = await database.findOne(namespace, { _id: new ObjectID(decoded.id), "addresses.zipCode": address });
        if (address) {
          await namespace.updateOne({ _id: new ObjectID(decoded.id) }, { $pull: { cart: { id } } });
          await namespace.updateOne({ _id: new ObjectID(decoded.id) }, { $push: { cart: { $each: [{ id, size, zipCode: address }], $position: 0 } } });
          const cart = (await database.findOne(namespace, { _id: new ObjectID(decoded.id) })).cart;
          return res.status(200).send({ products: cart });
        } else {
          return res.status(401).send({ errorMsg: "Address Unavailable" });
        }
      } else {
        return res.status(401).send({ errorMsg: "Product Unavailable" });
      }
    } else {
      return res.status(401).send({ errorMsg: "unauthenticated" });
    }
  } catch (e) {
    console.log(e);
    return res.status(500).send({ errorMsg: "Something went wrong" });
  }
};

module.exports = {
  saveProduct,
  signup,
  login,
  recover,
  address,
  addCart,
};
