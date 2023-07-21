const express = require('express');
const app = express();
const productManager = require('./ProductManager');

const PORT = 8080

app.get('/products', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit); // Se usa ParseInt para pasar de string a number, .Limit al comienzo es string
    const products = await productManager.getProducts();
    if (limit) { // si existe el query
      let productsArr = [...products]; // hago una copia del array para evitar usar el array original de products
      const limitProducts = productsArr.slice(0, limit); //se utiliza para obtener una porción específica de elementos de un array. va de 0 "la primera posicion" hasta el limit que seria lo que ponga el usuario
      return res.send(limitProducts);
    }
    return res.json(products); //si no existe ninguna query devuelve todo los productos
  }
  catch (error) {
    res.status(500).send('Ha ocurrido un error inesperado en el servidor');
  }
})

app.get('/products/:id', async (req, res) => {
  try {
    const idProduct = req.params.id // podria usar el parseInt pero no es necesario por que en el existProduct hago una comparacion == y no ===: esta compara su valor y su tipo, en cambio == : solo su valor
    const products = await productManager.getProducts();

    const existProduct = products.find(product => product.id == idProduct);
    const response = existProduct ? existProduct : { error: `No se encontro ningun producto con el id ${idProduct}` };
    res.status(existProduct ? 200 : 404).send(response);
  }
  catch (error) {
    res.status(500).send('Ha ocurrido un error inesperado en el servidor');
  }
})

app.listen(PORT, () => {
  console.log(`El servidor esta escuchando en el puerto ${PORT}...`);
})

