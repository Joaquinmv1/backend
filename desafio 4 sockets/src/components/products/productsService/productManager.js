const fs = require('fs');
const FILE = './productos.json';

class ProductManager {
  static id = 0;

  constructor() {
    this.props = ['title', 'description', 'price', 'code', 'stock'];
    this.path = FILE;
    try {
      this.products = JSON.parse(fs.readFileSync(this.path, 'utf-8'));
    } catch (error) {
      this.products = [];
    }
    ProductManager.id = this.products.reduce((prev, curr) => (
      curr.id >= prev ? curr.id : prev
    ), 0);
  }

  async getProducts() {
    try {
      return this.products;
    } catch (error) {
      console.log(error);
    }
  }

  isValidateCode(product) {
    return this.products.some(item => item.code === product.code);
  }

  async addProduct(product) {
    try {
      for (let prop of this.props) {
        if (!product.hasOwnProperty(prop) || this.isValidateCode(product)) {
          return 'Producto inválido!';
        }
      }

      const id = ++ProductManager.id;
      const newProduct = {
        id,
        status: true,
        thumbnails: [],
        ...product
      };

      this.products.push(newProduct);
      await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, 2));
    } catch (error) {
      console.log(error);
    }
  }

  async getProductById(id) {
    try {
      const product = this.products.find(product => product.id === id);
      return product ?? 'Producto no encontrado';
    } catch (error) {
      console.log(error);
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

const productManager = new ProductManager();

module.exports = productManager;

(async () => {
  await productManager.addProduct({
    title: 'pen',
    description: 'this is a pen',
    price: 200,
    code: '1800',
    stock: 5,
    thumbnails: ['imagen.jpg']
  });

  await productManager.addProduct({
    title: 'pencil',
    description: 'this is a pencil',
    price: 200,
    code: '1850',
    stock: 5,
    thumbnails: ['imagen.jpg']
  });

  await productManager.addProduct({
    title: 'stencil',
    description: 'this is a stencil',
    price: 200,
    code: '1500',
    stock: 5,
    thumbnails: ['imagen.jpg']
  });
})();
