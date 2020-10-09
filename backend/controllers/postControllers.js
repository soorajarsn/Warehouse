const database = require("../models/database");
const ObjectID = require("mongodb").ObjectID;
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const shortid = require("shortid");
const getCartProducts = require("./getControllers").getCartProducts;
const Razorpay = require("razorpay");
const razorpay = new Razorpay({
  key_id: "rzp_test_k5HUtJbT6gifJp",
  key_secret: "0uFMQQZthJOQopSED1HUCZTw",
});
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
        imgFile = file.name;
        imageAddresses.push(`../assets/${imgFile}`);
        file.mv(path.join(__dirname, `../../client/views/public/assets/${imgFile}`), function (err) {
          if (err) {
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
    database.insertOne(await database.getNamespace("products"), doc);
    return res.status(200).json({ errorMsg: "Passed" });
  } else {
    return res.status(400).send({ errorMsg: "Product Image required" });
  }
};

const signup = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
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
    console.log("Invalid Token");
    return res.status(401).send({ errorMsg: "Unauthenticated" });
  }
};

const addCart = async (req, res) => {
  const token = req.header("x-auth-token");
  const { id, size, address, qty } = req.body;
  if (!id || !size || !address) return res.status(401).send({ errorMsg: "id, size, address required" });
  if (!token) return res.status(401).send({ errorMsg: "unauthenticated" });
  let decoded;
  try {
    decoded = jwt.verify(token, config.get("jwtSecret"));
    const namespace = await database.getNamespace("users");
    const productNamespace = await database.getNamespace("products");
    let user = await database.findOne(namespace, { _id: new ObjectID(decoded.id) });
    if (user) {
      const product = await database.findOne(productNamespace, { _id: new ObjectID(id) });
      if (product) {
        const addrs = await database.findOne(namespace, { _id: new ObjectID(decoded.id), "addresses.zipCode": address });
        if (addrs) {
          await namespace.updateOne({ _id: new ObjectID(decoded.id) }, { $pull: { cart: { productId: id } } });
          await namespace.updateOne(
            { _id: new ObjectID(decoded.id) },
            { $push: { cart: { $each: [{ productId: id, size, zipCode: address, qty: parseInt(qty || 1) }], $position: 0 } } }
          );
          const cart = await getCartProducts(decoded);
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
    console.log("Inavalid Token");
    return res.status(401).send({ errorMsg: "Unauthenticated" });
  }
};
const createRazorpayOrder = async (req, res) => {
  const { amount, type } = req.body;
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send({ errorMsg: "Unauthenticated" });
  console.log(token);
  let decoded;
  try {
    decoded = jwt.verify(token, config.get("jwtSecret"));
  } catch (err) {
    console.log(err);
    return res.status(401).send({ errorMsg: "Unauthenticated" });
  }
  const payment_capture = 1;
  const currency = "INR";
  const options = {
    amount: amount * 100,
    currency,
    receipt: shortid.generate(),
    payment_capture,
  };

  try {
    const response = await razorpay.orders.create(options);
    console.log(response);
    const userNamespace = await database.getNamespace("users");
    const productNamespace = await database.getNamespace("products");
    let product;
    if (type == "cart") {
      const cart = (await database.findOne(userNamespace, { _id: new ObjectID(decoded.id) })).cart;
      cart.forEach(async cartProduct => {
        product = await productNamespace.findOne({ _id: new ObjectID(cartProduct.productId) });
        let order = {
          orderId: response.id,
          orderPrice: product.price,
          maxPrice: product.maxPrice || product.price, //need to update after db update
          ...cartProduct,
          paid: false,
          orderCreatedAt:new Date(response.created_at*1000)
        };
        userNamespace.updateOne({ _id: new ObjectID(decoded.id) }, { $push: { orders: order } });
      });
    } else {
      const id = req.body.id;
      const qty = req.body.qty;
      const size = req.body.size;
      const zipCode = req.body.zipCode;
      product = await productNamespace.findOne({ _id: new ObjectID(id) });
      if (id != product._id) return res.status(400).send("bad request");
      const order = {
        orderId: response.id,
        productId: id,
        qty,
        orderPrice: amount,
        maxPrice: product.maxPrice || amount, //need to update after db update;
        size,
        zipCode,
        paid: false,
        orderCreatedAt:new Date(response.created_at*1000)
      };
      userNamespace.updateOne({ _id: new ObjectID(decoded.id) }, { $push: { orders: order } });
    }
    res.status(200).send({
      id: response.id,
      currency: response.currency,
      amount: response.amount,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ errorMsg: "Something went wrong" });
  }
};
const paymentVerification = async (req, res) => {
  const secret = config.get("razorpayPaymentVerificationSecret");
  console.log("body start " + req.body + " body over");
  const crypto = require("crypto");
  const shasum = crypto.createHmac("sha256", secret);
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest("hex");

  console.log(digest, req.headers["x-razorpay-signature"]);

  if (digest === req.headers["x-razorpay-signature"]) {
    const entity = req.body.payload.payment.entity;
    if (entity.captured) {
      const orderId = entity.order_id;
      const paymentId = entity.id;
      const namespace = await database.getNamespace("users");
      const updateRes = await namespace.updateOne(
        { "orders.orderId": orderId },
        { $set: { "orders.$[order].paid": true, "orders.$[order].paymentId": paymentId,"orders.$[order].paymentCreatedAt": entity.created_at*1000} },
        { arrayFilters: [{ "order.orderId": orderId }] }
      );
      console.log("update result was ", updateRes.result);
      console.log(entity, orderId, paymentId);
    }
    res.status(200).send({ status: "ok" });
  } else {
    res.status(400).send({ status: "Bad Request" });
  }
};
module.exports = {
  saveProduct,
  signup,
  login,
  recover,
  address,
  addCart,
  createRazorpayOrder,
  paymentVerification,
};
