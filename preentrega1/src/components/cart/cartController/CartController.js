const fs = require('fs');

class CartController {
  static id = 0;

  constructor(path) {
    this.path = path
    try {
      this.carts = JSON.parse(fs.readFileSync(this.path, 'utf-8'))
    } catch (error) {
      this.carts = []
    }

    CartController.id = this.carts.reduce((prev, curr) => (
      curr.id >= prev ? curr.id : prev
    ), 0)
  }

  getAllCarts(req, res) {
    try {
      return res.send(this.carts);
    } catch (error) {
      return res.status(500).send('Error al obtener los carritos.');
    }
  }

  createNewCart(req, res) {
    try {
      const newCart = {
        id: ++CartController.id,
        products: []
      }

      this.carts = [...this.carts, newCart]
      fs.writeFileSync(this.path, JSON.stringify(this.carts, null, 2), 'utf-8');
      return res.send(this.carts);
    } catch (error) {
      return res.status(500).send('Error al crear un nuevo carrito.');
    }
  }

  getCartById(req, res) {
    try {
      let cid = parseInt(req.params.cid);
      const findCart = this.carts.find(cart => cart.id === cid)
      if (findCart) {
        return res.send(findCart);
      } else {
        return res.status(404).send(`No se encontró ningún carrito con el ID proporcionado.`);
      }
    } catch (error) {
      return res.status(500).send('Error al obtener el carrito por ID.');
    }
  }

  updateCartWithProduct(req, res) {
    try {
      const cartId = parseInt(req.params.cid);
      const productId = parseInt(req.params.pid)

      if (isNaN(productId)) {
        return res.status(400).send('Dato invalido');
      }

      const selectedCartIndex = this.carts.findIndex(cart => parseInt(cart.id) === cartId);

      if (selectedCartIndex === -1) {
        return res.status(404).send(`No se encontró ningún carrito con el ID proporcionado.`);
      }

      const selectedCart = this.carts[selectedCartIndex];
      const selectedProduct = selectedCart.products.find(cart => cart.product === productId);

      if (selectedProduct) {
        selectedProduct.quantity += 1;
      } else {
        selectedCart.products.push({ product: productId, quantity: 1 });
      }

      this.carts[selectedCartIndex] = selectedCart;
      fs.writeFileSync(this.path, JSON.stringify(this.carts, null, 2), 'utf-8');
      return res.send(selectedCart);
    } catch (error) {
      return res.status(500).send('Error al actualizar el carrito con el producto.');
    }
  }
}

module.exports = CartController;
