const database = require("../models/database");
const config = require("config");
const jwt = require("jsonwebtoken");
const ObjectID = require("mongodb").ObjectID;
const getProducts = async (req, res) => {
  const { productClass, category, subCategory, page, sortBy, price, size } = req.query;
  let databaseQuery = {};
  if (productClass) databaseQuery.productClass = productClass;
  databaseQuery.category = { $regex: `.*${category.toLowerCase()}.*` };
  databaseQuery.subCategory = { $regex: `.*${subCategory.toLowerCase()}.*` };
  console.log({ category: category.toLowerCase(), subCategory: subCategory.toLowerCase() });
  if (price) {
    priceQuery = eval(price).map(priceFilter => ({ $gt: priceFilter.from, $lt: priceFilter.to }));
    databaseQuery.$or = priceQuery;
  }
  let products = await database.findMany(await database.getNamespace("products"), databaseQuery);
  console.log(products);
  products = products.slice(0, 20).map(products => ({ ...products, imgsrc: products.imageAddresses[0] }));
  console.log(products);
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
    console.log(e);
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

const cart = async (req, res) => {
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send({ errorMsg: "unauthenticated" });
  let decoded;
  try {
    decoded = jwt.verify(token, config.get("jwtSecret"));
  } catch (e) {
    return res.status(401).send({ errorMsg: "Unauthenticated" });
  }
  const userNamespace = await database.getNamespace("users");
  const productNamespace = await database.getNamespace("products");
  const cart = (await database.findOne(userNamespace, { _id: new ObjectID(decoded.id) })).cart;
  const cartProducts = [];
  cart.forEach(c => {
    cartProducts.push({ _id: new ObjectID(c.id) });
  });
  console.log(cartProducts);
  let products = await database.findMany(productNamespace, { $or: cartProducts });
  console.log(products);
  products.forEach(prdct => {
    for (var i = 0; i < cart.length; i++){
      if (prdct._id == cart[i].id) {
        cart[i].img = prdct.imageAddresses[0];
        cart[i].title = prdct.name;
        cart[i].price = prdct.price;
        let stocks = 0;
        prdct.sizeWiseStocks.forEach(sizeStocks => {
          if (sizeStocks.size === cart[i].size) stocks = sizeStocks.stocks;
        });
        cart[i].stocks = stocks;
      }
    }
  });
  console.log(cart);
  return res.status(200).send({products:cart});
};
module.exports = {
  getProducts,
  user,
  addresses,
  cart
};
