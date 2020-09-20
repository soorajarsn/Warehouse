const database = require("../models/database");
const ObjectID = require("mongodb").ObjectID;
const jwt = require("jsonwebtoken");
const config = require("config");

const address = async (req, res) => {
  const token = req.header("x-auth-token");
  const { addressId, ...address } = req.body;
  console.log(req.body);
  let addresses = [];
  if (!token) return res.status(401).send({ errorMsg: "unauthenticated" });
  try {
    const decoded = jwt.verify(token, config.get("jwtSecret"));
    const namespace = await database.getNamespace("users");
    let user = await database.findOne(namespace, { _id: new ObjectID(decoded.id) });
    if (user) {
      let addressByThisZipcode = await database.findOne(namespace, { _id: new ObjectID(decoded.id), "addresses.zipCode": addressId });
      if (!addressByThisZipcode) { console.log('dont find any address'); return res.status(500).send({ errorMsg: "Something went wrong" });}
      else {
        let addressByNewZipCode = await database.findOne(namespace, { _id: new ObjectID(decoded.id), "addresses.zipCode": address.zipCode });
        if (address.zipCode !== addressId && addressByNewZipCode) return res.status(400).send({ errorMsg: "This zipCode already exists" });
        //was updating zipcode too, but this zipcode already exist for some other address
        else {
          if (user.addresses && user.addresses.length > 0 && address.isDefault) {
            await namespace.updateOne({ _id: new ObjectID(decoded.id), "addresses.isDefault": true }, { $set: { "addresses.$.isDefault": false } });
            await namespace.updateOne({ _id: new ObjectID(decoded.id) }, { $pull: { addresses: { zipCode: addressId } } }); //deleting the previous
            await namespace.updateOne({ _id: new ObjectID(decoded.id) }, { $push: { addresses: { $each: [address], $position: 0 } } }); //adding new updated at 0th position, since isDefault
            addresses = (await database.findOne(namespace, { _id: new ObjectID(decoded.id) })).addresses;
            addresses = addresses || [];
            return res.status(200).send({ addresses });
          } else {
            let updatingDefaultAddress = database.findOne(namespace,{_id:new ObjectID(decoded.id),"addresses.zipCode":addressId, "addresses.isDefault":true});
            if (updatingDefaultAddress) address.isDefault = true;
            console.log(address)
            console.log("going to update address ");
            const updateResult = await namespace.updateOne(
              { _id: new ObjectID(decoded.id), "addresses.zipCode": addressId },
              {
                $set: {
                  "addresses.$.firstName": address.firstName,
                  "addresses.$.lastName": address.lastName,
                  "addresses.$.locality": address.locality,
                  "addresses.$.phone": address.phone,
                  "addresses.$.city": address.city,
                  "addresses.$.zipCode": address.zipCode,
                  "addresses.$.country": address.country,
                  "addresses.$.isDefault": address.isDefault,
                  "addresses.$.state": address.state,
                },
              }
            );
            user = await database.findOne(namespace, { _id: new ObjectID(decoded.id) });
            
            let statusCode = 200;
            if(updateResult.modifiedCount === 0)
              statusCode = 304;
            
            addresses = user.addresses;
            addresses = addresses || [];

            return res.status(statusCode).send({ addresses });
          }
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
const updateCart = async (req, res) => {
  const token = req.header("x-auth-token");
  const { id, size ,qty } = req.body;
  if (!id || (!size && !qty)) return res.status(401).send({ errorMsg: "id and atleast one of size, qty required" });
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
          // await namespace.updateOne({ _id: new ObjectID(decoded.id) }, { $pull: { cart: { id } } });
          let updateTo = {};
          if(size)
            updateTo = {"cart.$.size":size};
          if(qty)
            updateTo = {...updateTo,"cart.$.qty":parseInt(qty)};
          await namespace.updateOne({ _id: new ObjectID(decoded.id),"cart.productId":id }, {$set:updateTo});
          let cart = (await database.findOne(namespace, { _id: new ObjectID(decoded.id) })).cart;
          const cartProducts = [];
          cart.forEach(c => {
            cartProducts.push({_id:new ObjectID(c.productId)});
          });
          let products = await database.findMany(productNamespace,{$or:cartProducts});
          products.forEach(prdct => {
            for(var i = 0; i < cart.length; i++)
              if(prdct._id == cart[i].productId){
                cart[i].img = prdct.imageAddresses[0];
                cart[i].title = prdct.name;
                cart[i].price = prdct.price;
                let stocks = 0;
                prdct.sizeWiseStocks.forEach(sizeStocks=>{
                  if(sizeStocks.size === cart[i].size)
                    stocks = sizeStocks.stocks;
                })
                cart[i].maxQty = stocks;
              }
          });
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
  address,
  updateCart
};
