var {
  error500,
  error402,
  error404,
  error422
} = require("../lib/error");
var {
  response,
  createResponse,
  getOneResponse
} = require("../lib/response");

var Cart = require("../models/cart.model");
var Products = require("../models/product.model");

//create a cart on first 
module.exports.create = (req, res, next) => {
  try {
    var cart = new Cart();
    cart.ProductIds = req.body.data
    cart.save((err, doc) => {
        if (err) {
          error500(res, err.message);
        }
        createResponse(res, cart, 'Cart created successfully.');
      })
  }
  catch (ex) {
    error402(res, ex.message);
  }

};

//update cart  
module.exports.updateCartItemQty = (req, res, next) => {
  try {
    const id = req.params.id;
    const data = req.body;
    Cart.findById(id).exec((err, cart) => {
      if (err) {
        error500(res, err.message);
      }
      if (!cart) error404(res, "Cart not found");
      Cart.findOneAndUpdate({ _id: id, 'ProductIds.ProductId': data.ProductId }, { $set: { 'ProductIds.$.Quantity': data.Quantity } })
        .exec((err, cart) => {
          if (err) {
            error500(res, err.message);
          }
          response(res, 'Cart item updated');
        });
    }
    )
  }
  catch (ex) {
    error402(res, ex.message);
  }

};

//get a cart by id 
module.exports.findOne = (req, res, next) => {
  try {
    Cart.findById(req.params.id)
      .select({ 'ProductIds._id': 0 })
      .exec((err, cartOne) => {
        if (err) {
          error500(res, err.message);
        }
        if (!cartOne) error404(res, "Cart not found");
        const cart = cartOne;
        const ids = cart.ProductIds.map(m => m.ProductId);
        const filter = { '_id': { '$in': ids } };
        Products.find().where(filter).exec((err, products) => {
          
          if (err) {
            error500(res, err.message);
          }

          if (!products) error404(res, "Products not found");
            const data = {
              _id: cart._id,
              ProductIds: cart.ProductIds,
              products: products
            }
            getOneResponse(res, data);
        })
      })
  }
  catch (ex) {
    error402(res, ex.message);
  }

};

//clear cart
module.exports.deleteCartItem = (req, res, next) => {
  try {
    const id = req.params.id;
    const data = req.body;
    Cart.findById(id).exec((err, cart) => {
      if (err) {
        error500(res, err.message);
      }
      if (!cart) error404(res, "Cart not found");
      Cart.findOneAndUpdate({ _id: id }, { $pull: { 'ProductIds': { 'ProductId': data.ProductId } } })
      .exec((err, cart) => {
        if (err) {
          error500(res, err.message);
        }
          response(res, 'Cart item deleted');
        });
    }
    )
  }
  catch (ex) {
    error402(res, ex.message);
  }

};