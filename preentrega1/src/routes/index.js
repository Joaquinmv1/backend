const productsApi = require('../components/products')
const cartsApi = require('../components/cart')

module.exports = (app) => {
  productsApi(app)
  cartsApi(app)
  app.get('/', (req, res) => res.send('Hello world!'));
}