const database = require("../models/database");
const config = require("config");
const jwt = require("jsonwebtoken");
const ObjectID = require("mongodb").ObjectID;
const path = require("path");
const getProducts = async (req, res) => {
  const { productClass, category, subCategory, page, sortBy, price, size } = req.query;
  let databaseQuery = {};
  if (productClass) databaseQuery.productClass = productClass;
  databaseQuery.category = { $regex: `.*${category.toLowerCase()}.*` };
  databaseQuery.subCategory = { $regex: `.*${subCategory.toLowerCase()}.*` };
  if (price) {
    priceQuery = eval(price).map(priceFilter => ({ $gt: priceFilter.from, $lt: priceFilter.to }));
    databaseQuery.$or = priceQuery;
  }
  let products = await database.findMany(await database.getNamespace("products"), databaseQuery);
  products = products.slice(0, 20).map(products => ({ ...products, imgsrc: products.imageAddresses[0] }));
  let responce = {
    products,
    appliedSizes: size,
    appliedPrices: price,
    sortBy,
    productsRemaining: true,
  };
  res.set("Cache-Control", "no-store");
  return res.status(200).send(responce);
};
const user = async (req, res) => {
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send({ errorMsg: "No token, authorization denied" });
  try {
    const decoded = jwt.verify(token, config.get("jwtSecret"));
    let user = await database.findOne(await database.getNamespace("users"), { _id: new ObjectID(decoded.id) });
    let userData = {
      userName: user.firstName + " " + user.lastName,
      userId: user._id,
    };
    res.set("Cache-Control", "no-store");
    return res.status(200).send({ ...userData });
  } catch (e) {
    console.log("Token Expired");
    return res.status(400).send({ errorMsg: "Invalid Token" });
  }
};
const addresses = async (req, res) => {
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send({ errorMsg: "unauthenticated" });
  let decoded;
  try {
    decoded = jwt.verify(token, config.get("jwtSecret"));
  } catch (e) {
    return res.status(401).send({ errorMsg: "unauthenticated" });
  }

  let addresses = (await database.findOne(await database.getNamespace("users", { _id: new ObjectID(decoded.id) }))).addresses;
  addresses = addresses || [];
  res.set("Cache-Control", "no-store");
  return res.status(200).send({ addresses });
};

const getCartProducts = async decoded => {
  const userNamespace = await database.getNamespace("users");
  const cart = (await database.findOne(userNamespace, { _id: new ObjectID(decoded.id) })).cart;
  if (cart.length > 0) {
    const cartProducts = [];
    cart.forEach(c => {
      cartProducts.push({ _id: new ObjectID(c.productId) });
    });
    const productNamespace = await database.getNamespace("products");
    let products = await database.findMany(productNamespace, { $or: cartProducts });
    products.forEach(prdct => {
      for (var i = 0; i < cart.length; i++) {
        if (prdct._id == cart[i].productId) {
          cart[i].img = prdct.imageAddresses[0];
          cart[i].title = prdct.name;
          cart[i].price = prdct.price;
          let stocks = 0;
          prdct.sizeWiseStocks.forEach(sizeStocks => {
            //need to change sizeWiseStocks to size after db update;
            if (sizeStocks.size === cart[i].size) stocks = sizeStocks.stocks;
          });
          cart[i].maxQty = stocks;
          cart[i].availableSizes = prdct.sizeWiseStocks; //need to change sizeWiseStocks to size after db update;
        }
      }
    });
  }
  return cart;
};
const cart = async (req, res) => {
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send({ errorMsg: "unauthenticated" });
  let decoded;
  try {
    decoded = jwt.verify(token, config.get("jwtSecret"));
  } catch (e) {
    return res.status(401).send({ errorMsg: "Unauthenticated" });
  }
  const cart = await getCartProducts(decoded);
  return res.status(200).send({ products: cart });
};
const product = async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).send({ errorMsg: "Id Required" });
  const namespace = await database.getNamespace("products");
  const prdct = await database.findOne(namespace, { _id: new ObjectID(id) });
  if (!prdct) return res.status(400).send({ errorMsg: "Invalid Product Id" });
  return res.status(200).send({ product: prdct });
};
const logo = (req, res) => {
  res.status(200).sendFile(path.join(__dirname + "../../client/views/public/assets/logo_4031f3e7-60f6-44da-98f7-3e8b9320ef7f_175x@2x.webp"));
};
const orders = async (req, res) => {
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send({ errorMsg: "Unauthenticated" });
  let decoded;
  try {
    decoded = jwt.verify(token, config.get("jwtSecret"));
  } catch (err) {
    return res.status(401).send({ errorMsg: "Unauthenticated" });
  }
  const userNamespace = await database.getNamespace("users");
  const productNamespace = await database.getNamespace("products");
  const user = await database.findOne(userNamespace, { _id: new ObjectID(decoded.id), "orders.paid": true });
  const orders = (user && user.orders) || [];
  const addresses = (user && user.addresses) || [];
  if (orders.length > 0) {
    let orderProducts = [];
    orders.forEach(order => {
      orderProducts.push({ _id: new ObjectID(order.productId) });
    });
    const products = await database.findMany(productNamespace, { $or: orderProducts });
    const ordersWithProductImages = orders.map(order => {
      let orderWithExtraDetails;
      products.forEach(product => {
        if (product._id == order.productId) orderWithExtraDetails = { ...order, img: product.imageAddresses[0], title: product.name };
      });
      addresses.forEach(address => {
        if (address.zipCode == order.zipCode) orderWithExtraDetails = { ...orderWithExtraDetails, address: address };
      });
      return orderWithExtraDetails;
    });
    return res.status(200).send({ products: ordersWithProductImages });
  }
  else{
    res.status(200).send({products:[]});
  }
};
module.exports = {
  getProducts,
  user,
  addresses,
  cart,
  product,
  getCartProducts,
  logo,
  orders,
};
