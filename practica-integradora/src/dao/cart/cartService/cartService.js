const cartModel = require('../../models/cart.model');

class CartService {
  constructor() {
  }

  async getAllCarts() {
    try {
      return await cartModel.find().lean();
    } catch (error) {
      console.log(error);
    }
  }

  async createCart() {
    try {
      const newCart = {
        id,
        products: []
      };

      await cartModel.create(newCart)
    } catch (error) {
      console.log(`[ERROR] -> ${error}`);
    }
  }

  async getProducts(cartId) {
    try {
      const cart = await cartModel.findOne({ id: cartId });

      if (!cart) {
        throw new Error('Carrito no encontrado');
      }

      return cart;
    } catch (error) {
      console.log(`[ERROR] -> ${error}`);
    }
  }

  async addProduct(cartId, productId) {
    try {
      const selectedCart = await cartModel.findOne({ id: cartId });

      if (!selectedCart) {
        throw new Error('Carrito no encontrado');
      }

      let selectedProduct = selectedCart.products.find(product => product.product === productId);

      if (selectedProduct) {
        selectedProduct.quantity += 1;
      } else {
        selectedCart.products.push({ product: productId, quantity: 1 });
      }

      await selectedCart.save();
      return selectedCart;
    } catch (error) {
      console.log(`[ERROR] -> ${error}`);
    }
  }
}

const cartService = new CartService();

module.exports = cartService;
