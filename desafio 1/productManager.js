class ProductManager {
  static id = 0

  constructor() {
    this.products = [];
    this.props = ['title', 'price', 'thumbnail', 'code', 'stock'];
  }

  getProducts() {
    return this.products;
  }

  isValidateCode(product) {
    return this.products.some(item => item.product.code === product.code);
  }

  addProduct(product) {
    for (let prop of this.props) {
      if (!product.hasOwnProperty(prop) || this.isValidateCode(product)) {
        return 'Producto invalido!';
      }
    }

    return this.products = [...this.products, { id: ++ProductManager.id, product }];
  }

  getProductById(id) {
    let productId = this.products.find(product => product.id === id);
    return productId ?? 'Not found';
  }
}

const product1 = {
  title: 'Product 1',
  price: 10,
  thumbnail: 'thumbnail-url',
  code: 'abc',
  stock: 10
}

const product2 = {
  title: 'Product 2',
  price: 10,
  thumbnail: 'ABC123',
  code: 'abc',
  stock: 2
}

const product3 = {
  title: 'Product 3',
  price: 2,
  thumbnail: 'thumbnail-url',
  code: '567',
  stock: 7
}


const productManager = new ProductManager();
const result = productManager.addProduct(product1);

const result2 = productManager.addProduct(product2);
const result3 = productManager.addProduct(product3);

const getProducts = productManager.getProducts();
const resultForId = productManager.getProductById(1);
console.log(getProducts);
console.log("producto por id", resultForId);

