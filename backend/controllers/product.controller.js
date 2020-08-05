const {
  error500,
  error404,
  error402
} = require("../lib/error");
const {
  getAllResponse,
  getOneResponse
} = require("../lib/response");


var csv = require('csvtojson');


var empProfileimageurl = require('../models/db');
// var Items = mongoose.model('Products');
var Items = require("../models/product.model");


//Create the item
module.exports.addProducts = (req, res, next) => {
  try {
    csv()
      .fromFile('./uploads/' + empProfileimageurl.fileservice.fileurl)
      .then((jsonObj) => {
        
        for (var x = 0; x < jsonObj.length; x++) {
          var Item = new Items();
          temp = jsonObj[x].pId
          Item.PId = temp;

          temp = jsonObj[x].ProductName
          Item.ProductName = temp;
        
          temp = jsonObj[x].ProductShortCode
          Item.ProductShortCode = temp;

          temp = jsonObj[x].Category
          Item.Category = temp;

          temp = jsonObj[x].Price
          Item.Price = temp;

          temp = jsonObj[x].Quantity
          Item.Quantity = temp;

          temp = jsonObj[x].Description
          Item.Description = temp;

          temp = jsonObj[x].ImageLink
          Item.ImageLink = temp;
         
          Items.updateOne(
            { PId: Item.PId },
            {
              $set: {
                ProductName: Item.ProductName,
                ProductShortCode: Item.ProductShortCode,
                Category: Item.Category,
                Price: Item.Price,
                Quantity: Item.Quantity,
                Description: Item.Description,
                ImageLink: Item.ImageLink
              }
            },
            { upsert: true }, (err, data) => {

              if (err) {
                res.send(err.message)
              }
              res.send()
              
            }
          )

        }
      })

  }
  catch (ex) {
    error402(res, ex.message);
  }
}

//get products for dashbaord
module.exports.getProducts = (req, res, next) => {
  try {
    const filter = req.body.filter || '';
    const sort = {
      [req.body.sortKey || "_id"]: req.body.sortOrder || 1
    };
    const pageOptions = {
      page: req.body.page || 0,
      limit: req.body.limit || 10
    }
    Items.find()
      .where(filter)
      .sort(sort)
      .skip(pageOptions.page * pageOptions.limit)
      .limit(pageOptions.limit)
      .exec((err, products) => {
        if (err) {
          error500(res, err.message);
        }
        if (!products) error404(res, "Products not found");
        getAllResponse(res, products);
      })

  }
  catch (ex) {
    error402(res, ex.message);
  }
}

//get product by id
module.exports.getProductsById = (req, res, next) => {
  try {
    Items.findById(req.params.id)
      .exec((err, product) => {
        if (err) {
          error500(res, err.message);
        }
        
        if (!product) error404(res, "Product not found ");
        getOneResponse(res, product);
      })
  }
  catch (ex) {
    error402(res, ex.message);
  }
}
