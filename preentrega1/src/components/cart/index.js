const Cart = require('./cartController/CartController');
const { Router } = require('express');
const bodyParser = require("body-parser");

const cartController = new Cart('./cart.json')

module.exports = (app) => {
  let router = new Router();
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use('/api/carts', router);
  router.get('/', cartController.getAllCarts.bind(cartController));
  router.post('/', cartController.createNewCart.bind(cartController));
  router.get('/:cid', cartController.getCartById.bind(cartController));
  router.post('/:cid/product/:pid', cartController.updateCartWithProduct.bind(cartController));
}
