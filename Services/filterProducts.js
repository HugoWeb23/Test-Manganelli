const fns = require('date-fns')

const FilterProducts = async (StoreInventory, products) => {

    const currentDate = new Date()
    let featuredProducts = []
    let standardProducts = []

    products = products
        .map(product => {
            const { stock } = StoreInventory.find(prod => prod.IdProduct == product.id) // On récupère le stock pour le produit courant
            return { ...product, stock: parseInt(stock) } // On ajoute la propriété "stock" à l'objet
        })
        .filter(product => {
            return product.stock > 0 // Le produit reste dans le tableau si son stock est supérieur à 0
        })
        .forEach(product => {
            const DLC = new Date(product.dlc)
            const DLCAfterThreeDays = fns.addDays(DLC, 3) // On ajoute 3 jours à la date limite de consommation
            if (fns.isAfter(currentDate, DLCAfterThreeDays)) { // Est-ce que la date du jour est supérieure à la DLC + 3 ? Si oui, on ajoute le produit dans     les produits mis en avant
                const discount = product.price - (parseFloat(product.price) * 30 / 100) // Prix après réduction de 30%
                product.price = discount // Affectation du nouveau prix
                featuredProducts.push(product)
            } else { // Si non, on l'ajoute dans les produits standards
                standardProducts.push(product)
            }
        })

    featuredProducts = featuredProducts.sort((a, b) => { // Tri décroissant
        if (parseFloat(a.price) > parseFloat(b.price)) {
            return -1
        } else if (parseFloat(a.price) < parseFloat(b.price)) {
            return 1
        } else {
            return 0
        }
    })

    standardProducts = standardProducts.sort((a, b) => { // Tri décroissant
        if (parseFloat(a.price) > parseFloat(b.price)) {
            return -1
        } else if (parseFloat(a.price) < parseFloat(b.price)) {
            return 1
        } else {
            return 0
        }
    })

    return { featuredProducts, standardProducts }

}

module.exports = FilterProducts