var express = require('express');
var router = express.Router();
var multer = require('multer');
var path = require('path');

var empProfileimage = require('../models/db');

var ctrlProduct = require('../controllers/product.controller');
const ctrlCart = require('../controllers/carts.controller');


//file handling

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.toLowerCase().split(' ').join('-');
    cb(null, fileName)
  }
});


// Multer Mime Type Validation
var upload = multer({
  storage: storage,
  fileFilter: function (req, file, callback) { //file filter
    empProfileimage.fileservice.fileurl = file.originalname
    if (['csv'].indexOf(file.originalname.split('.')[file.originalname.split('.').length - 1]) === -1) {
      return callback(new Error('Wrong extension type'));
    }
    callback(null, true);
  }
});

//products
router.post('/addproduct', upload.single('file'), ctrlProduct.addProducts);

// add products
router.post('/getproducts', ctrlProduct.getProducts);
router.get('/getproductbyid/:id', ctrlProduct.getProductsById);


//cart create and update 
router.post('/createcart', ctrlCart.create);
router.post('/updatecart/:id', ctrlCart.updateCartItemQty);
router.get('/cart/:id', ctrlCart.findOne);
router.post('/deletecart/:id', ctrlCart.deleteCartItem);

module.exports = router;



