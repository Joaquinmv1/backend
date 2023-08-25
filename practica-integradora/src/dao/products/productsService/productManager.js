const productModel = require('../../models/product.model');

class ProductManager {
  static id = 0;

  constructor() {
    this.props = ['title', 'description', 'price', 'code', 'stock'];
  }

  async getProducts() {
    try {
      return await productModel.find().lean();
    } catch (error) {
      console.log(error);
    }
  }

  async isValidateCode(code) {
    const products = await productModel.find({ code })
    return products.length > 0;
  }

  async addProduct(product) {
    try {
      for (let prop of this.props) {
        if (!product.hasOwnProperty(prop) || await this.isValidateCode(product.code)) {
          return 'Producto inválido!';
        }
      }

      const newProduct = {
        id,
        status: true,
        thumbnails: [],
        ...product
      };

      await productModel.create(newProduct)
    } catch (error) {
      console.log(error);
    }
  }


  async getProductById(id) {
    try {
      return await productModel.find({ id: id }).lean()
    } catch (error) {
      console.log(error);
    }
  }

  async updateProduct(id, product) {
    try {
      return await productModel.updateOne({ id: id }, product)
    } catch (error) {
      console.log(error);
    }
  }


  async deleteProduct(id) {
    try {
      return await productModel.deleteOne({ id: id })
    } catch (error) {
      console.log(error);
    }
  }
}

const productManager = new ProductManager();

module.exports = productManager;
