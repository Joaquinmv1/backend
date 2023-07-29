const Product = require('./productController/productController');
const { Router } = require('express');
const bodyParser = require("body-parser");

const productController = new Product('./products.json')

module.exports = (app) => {
  let router = new Router();
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use('/api/products', router);
  router.get('/', productController.getAllProducts.bind(productController));
  router.get('/:pid', productController.getProductId.bind(productController));
  router.post('/', productController.addToCart.bind(productController));
  router.put('/:pid', productController.updateProduct.bind(productController));
  router.delete('/:pid', productController.deleteProduct.bind(productController));
}

