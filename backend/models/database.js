const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const ObjectID = require('mongodb').ObjectID;
const url = 'mongodb://localhost:27017';
const dbName = 'warehouse';
const client = new MongoClient(url,{useUnifiedTopology:true});

const getNamespace = async function(collection){
    try{
        const clnt = await client.connect();
        return clnt.db(dbName).collection(collection);
    }
    catch(err){
        throw(err);
    }
}
const insertOne = function(namespace,doc){
    namespace.insertOne(
      doc, 
      function(err, r) {
          assert.equal(null, err);
          assert.equal(1, r.insertedCount);
        });
  }
const updateOne = function(namespace,query,dc){
    namespace.updateOne(query,{
        $set:dc
    },function(err,r){
        assert.equal(null,err);
        assert.equal(1,r.matchedCount);
    });
}
const findOne = async function(namespace,query){
    let data = await namespace.findOne(query);
    return data;
}
const findMany = function(namespace,query){
    let data =  namespace.find(query).toArray();
    return data;
}
const deleteDoc = function(namespace,query){
    namespace.deleteMany(query,function(err,r){
        assert.equal(null,err);
        console.log("deleted successfully");
        client.close();
    });
}
module.exports = {
    dbName,
    client,
    getNamespace,
    insertOne,
    updateOne,
    deleteDoc,
    findOne,
    findMany
}