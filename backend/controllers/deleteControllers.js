const database = require("../models/database");
const ObjectID = require("mongodb").ObjectID;
const config = require("config");
const jwt = require("jsonwebtoken");
const getCartProducts = require('./getControllers').getCartProducts;

const address = async (req, res) => {
  const { addressId } = req.body;
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send({ errorMsg: "unauthenticated" });
  let decoded;
  try {
    decoded = jwt.verify(token, config.get("jwtSecret"));
  } catch (err) {
    return res.status(400).send({ errorMsg: "unauthenticated" });
  }
  const namespace = await database.getNamespace("users");
  const updateResult = await namespace.updateOne({ _id: new ObjectID(decoded.id) }, { $pull: { addresses: { zipCode: addressId } } });
  let addresses = (await database.findOne(namespace, { _id: new ObjectID(decoded.id) })).addresses;
  if (addresses[0] && !addresses[0].isDefault) {
    await namespace.updateOne({ _id: new ObjectID(decoded.id), "addresses.zipCode": addresses[0].zipCode }, { $set: { "addresses.$.isDefault": true } });
    addresses[0].isDefault = true; //for not making one more query for updated doc, where first address is default address;
  }
  addresses = addresses || [];
  let statusCode = 200;
  if (updateResult.modifiedCount === 0) statusCode = 304;
  return res.status(statusCode).send({ addresses });
};
const removeCart = async (req, res) => {
  const { id } = req.body;
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send({ errorMsg: "unauthenticated" });
  let decoded;
  try {
    decoded = jwt.verify(token, config.get("jwtSecret"));
  } catch (err) {
    return res.status(401).send({ errorMsg: "unauthenticated" });
  }
  const namespace = await database.getNamespace("users");
  const user = await database.findOne(namespace, { _id: new ObjectID(decoded.id) });
  if (user) {
    await namespace.updateOne({ _id: new ObjectID(decoded.id) }, { $pull: { cart: { productId:id } } });
    const cart = await getCartProducts(decoded);
    return res.status(200).send({ products: cart });
  } else {
    return res.status(401).send({ errorMsg: "unauthenticated" });
  }
};
module.exports = {
  address,
  removeCart,
};
