const database = require('../models/database');
const client = database.client;
const dbName = database.dbName;
const assert = require('assert');
const getProducts = async (req,res) => {
    let products = await database.findMany(await database.getNamespace('products'),{productClass:'WOMEN'});
    return res.status(200).send(products);
}
module.exports = {
    getProducts
};