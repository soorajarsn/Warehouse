const database = require('../models/database');
const client = database.client;
const dbName = database.dbName;
const assert = require('assert');
const path = require('path');
const saveProduct = (req,res) => {
    const {name,stocks,price,color,
        productClass,category,subCategory,brand,sizes,
        sStocks,mStocks,lStocks,xlStocks} = req.body;
    const reviews = [],rating = 5;
    const imageAddresses = [];
    if(req.files){
        const images = {...req.files};
        for (const img in images){
            const file = images[img];
            const mimetype = file.mimetype;
            if(mimetype === 'image/png' || mimetype === 'image/jpeg'){
                console.log(file);
                imgFile = file.name;
                imageAddresses.push(`../assets/${imgFile}`);
                file.mv(path.join(__dirname,`../../client/views/public/assets/${imgFile}`),function(err){
                    if(err){
                        console.log('Error occured while saving the file : ',err);
                        return res.status(501).json({msg:"Couldn't save the product, Error while saving the image"});
                    }
                });
            }
            else{
                return res.status(400).json({msg:"Bad file uploaded as image"});
            }
        }
        let sizeWiseStocks = null;
        sizes.split(',').forEach(size => {
            if(!sizeWiseStocks)
                sizeWiseStocks = [];
            sizeWiseStocks.push({
                size,
                stocks:parseInt(eval(size.toLowerCase()+'Stocks'))
            });
        });
        doc = {
            name,stocks:parseInt(stocks),price:parseInt(price),color,productClass,
            category,subCategory,brand,rating,reviews,
            sizes:sizes.split(','),
            sizeWiseStocks:[
                {size:'S',stocks:parseInt(sStocks)},
                {size:'M',stocks:parseInt(mStocks)},
                {size:'L',stocks:parseInt(lStocks)},
                {size:'XL',stocks:parseInt(xlStocks)}
            ],
            imageAddresses
        }
        console.log(doc);
        client.connect(function(err,client){
            assert.equal(null,err);
            const namespace = client.db(dbName).collection('products');
            database.insertOne(namespace,doc);
            return res.status(200).json({msg:"Passed"});
        });
    }
    else{
        console.log('no files in request');
    }
}

const signup = (req,res) => {

}

const login = (req,res) => {

}

module.exports = {
    saveProduct,
    signup,
    login
}