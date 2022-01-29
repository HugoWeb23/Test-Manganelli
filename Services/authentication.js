const fs = require('fs')
const axios = require('axios')
require('dotenv').config()

const Authentication = async () => {
    try {
        const login = await axios.post('https://ppcms.zebrix.net/exam-api/login', {
            name: process.env.name,
            resto: process.env.resto,
            pwd: process.env.pwd
        })
        return login.data.token
    } catch (e) {
        return null
    }

}

module.exports = Authentication