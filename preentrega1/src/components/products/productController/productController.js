const fs = require('fs');

class Product {
  static id = 0;

  constructor(path) {
    this.path = path;
    this.props = ['title', 'description', 'price', 'thumbnail', 'code', 'stock'];
    try {
      this.products = JSON.parse(fs.readFileSync(path, 'utf-8'));
    } catch (error) {
      this.products = [];
    }
    Product.id = this.products.reduce((prev, curr) => (
      curr.id >= prev ? curr.id : prev
    ), 0);
  }

  getAllProducts(req, res) {
    try {
      let { limit } = req.query;
      if (limit) {
        let productsWithLimit = this.products.slice(0, limit);
        res.send(productsWithLimit);
      }
      return res.send(this.products);
    } catch (error) {
      return res.status(500).send('Internal Server Error');
    }
  }

  getProductId(req, res) {
    try {
      let paramId = req.params.pid;
      let productFound = this.products.find(product => product.id == paramId);
      const response = productFound ? productFound : { error: `No se encontró ningún producto con el id ${paramId}` };
      return res.send(response);
    } catch (error) {
      return res.status(500).send('Internal Server Error');
    }
  }

  isValidateCode(product) {
    return this.products.some(item => item.code === product.code);
  }

  addToCart(req, res) {
    try {
      let newProduct = req.body;
      for (let prop of this.props) {
        if (!newProduct.hasOwnProperty(prop) || this.isValidateCode(newProduct)) {
          return res.status(400).send('Producto Invalido!');
        }
      }

      this.products = [...this.products, { id: ++Product.id, ...newProduct }];
      fs.writeFileSync(this.path, JSON.stringify(this.products, null, 2));
      return res.send(this.products);
    } catch (error) {
      return res.status(500).send('Internal Server Error');
    }
  }

  updateProduct(req, res) {
    try {
      let param = parseInt(req.params.pid);
      let updatedFields = req.body;

      const updateProductIndex = this.products.findIndex(product => product.id === param);
      if (updateProductIndex !== -1) {
        const fieldsToUpdate = Object.keys(updatedFields)
          .filter(field => this.props.includes(field))
          .reduce((obj, field) => {
            obj[field] = updatedFields[field];
            return obj;
          }, {});

        Object.assign(this.products[updateProductIndex], fieldsToUpdate);
        fs.writeFileSync(this.path, JSON.stringify(this.products, null, 2));
        return res.send(this.products);
      } else {
        return res.status(404).send('Product not found');
      }
    } catch (error) {
      return res.status(500).send('Internal Server Error');
    }
  }

  deleteProduct(req, res) {
    try {
      const id = parseInt(req.params.pid);
      const filterProducts = this.products.filter(product => product.id !== id);
      fs.writeFileSync(this.path, JSON.stringify(filterProducts, null, 2));
      return res.send(filterProducts);
    } catch (error) {
      return res.status(500).send('Internal Server Error');
    }
  }
}

module.exports = Product;
