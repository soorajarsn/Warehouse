const database = require("../models/database");
const config = require('config');
const jwt = require('jsonwebtoken');
const ObjectID = require('mongodb').ObjectID;
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
  res.set('Cache-Control','no-store');
  return res.status(200).send(responce);
};
const user = async (req,res) => {
    const token = req.header('x-auth-token');
    if(!token)return res.status(401).send({errorMsg:'No token, authorization denied'});
    try{
        const decoded = jwt.verify(token,config.get('jwtSecret'));
        let user = await database.findOne(await database.getNamespace('users'),{_id:new ObjectID(decoded.id)});
        let userData = {
            userName:user.firstName+" "+user.lastName,
            userId:user._id
        }
        res.set('Cache-Control','no-store');
        return res.status(200).send({...userData});
    }
    catch(e){
        console.log(e);
        return res.status(400).send({errorMsg:'Invalid Token'});
    }

} 
const addresses = async (req,res) => {

  const token = req.header('x-auth-token');
  if(!token)return res.status(401).send({errorMsg:'unauthenticated'});
  let decoded ;
  try{
    decoded  = jwt.verify(token,config.get('jwtSecret'));
  }
  catch(e){
    return res.status(401).send({errorMsg:"unauthenticated"});
  }

  let addresses = (await database.findOne(await database.getNamespace('users',{_id:new ObjectID(decoded.id)}))).addresses;
  addresses = addresses || [];
  res.set('Cache-Control','no-store');
  return res.status(200).send({addresses});
  
}
module.exports = {
  getProducts,
  user,
  addresses
};
// /api/getProducts?productClass=${productClass}&category=${category}&subCategory=${subCategory}&page=${page}&sortBy=${sortBy}&price=${price}&size=${size}
