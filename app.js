const express = require('express')
const csv = require('csvtojson')
const NodeCache = require('node-cache')
const GetProducts = require('./Services/getProducts')
const FilterProducts = require('./Services/filterProducts')

const app = express()
const port = 3000
const Cache = new NodeCache({ stdTTL: 600 });

app.get('/products', async (req, res) => {

    let products = Cache.get('products') // Récupération des produits dans le cache
    if (products == null) {
        products = await GetProducts() // Si le cache est vide, on demande les produits au WS principal
        if (products == null) {
            res.status(500).send({ error: 'Une erreur est survenue lors de la récupération de la liste des produits' }) // Une erreur est retournée lors d'un problème avec le WS principal
            return
        }
        Cache.set('products', products, 60) // On stocke les nouveaux produits provenant du WS principal dans le cache, pour une durée de 60 secondes.
    }

    const StoreInventory = await csv({ delimiter: ';' }).fromFile('./Data/stock.csv') // Conversion du stock du format CSV en JSON

    const newProducts = await FilterProducts(StoreInventory, products)

    res.status(200).send(newProducts)

})

app.listen(port, () => {
    console.log(`API lancée sur le port ${port}`)
})

