const Authentication = require("./authentication")
const axios = require('axios')
require('dotenv').config()

const GetProducts = async () => {
    const token = await Authentication()
    if (token != null) {
        try {
            const products = await axios.get('https://ppcms.zebrix.net/exam-api/products', {
                headers: {
                    Authorization: token,
                    apiKey: process.env.apiKey
                }
            })
            return products.data
        } catch (error) {
            return null
        }
    } else {
        return null
    }
}

module.exports = GetProducts