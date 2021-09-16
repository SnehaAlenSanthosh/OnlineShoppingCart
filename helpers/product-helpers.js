var db = require('../config/connection')
var collection = require('../config/collections')
var objectId = require('mongodb').ObjectID;
const { ObjectId } = require('mongodb');
module.exports = {
    addProduct: (product, callback) => {
        console.log(product);
        db.get().collection('product').insertOne(product).then((data) => {//insert product to db and goto admin.js
            //console.log(data);
            callback(data.ops[0]._id)

        })
    },
    getAllProducts: () => {
        return new Promise(async (resolve, reject) => {
            // let products=db.get().collection('product').find()
            let products = await db.get().collection(collection.PRODUCT_COLLECTION).find().toArray()//to move data to an array
            //We have to wait until product come from array,hence using await,async
            resolve(products)       //Return
        })
    },
    deleteProduct: (prodId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.PRODUCT_COLLECTION).removeOne({ _id: objectId(prodId) }).then((response) => {
                resolve(response)
            })
        })
    },
    getProductDetails: (proId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.PRODUCT_COLLECTION).findOne({ _id: objectId(proId) }).then((product) => {
                resolve(product)
            })

        })
    },
    updateProduct: (proId, proDetails) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.PRODUCT_COLLECTION).updateOne({ _id:objectId(proId)}, {
                $set: {
                    Name: proDetails.Name,
                    Category: proDetails.Category,
                    Description: proDetails.Description,
                    Price: proDetails.Price
                }
            }).then((response)=>{
                resolve()
            })
        })

    }
}
//if we want to use this file in admin.js
//go to admin.js--var require