const express = require('express')
const router = express.Router()

module.exports = router

router.get('/add-product', (req, res) => {
    res.render('users/add-product')
})