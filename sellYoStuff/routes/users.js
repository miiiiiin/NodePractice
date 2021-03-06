const express = require('express')
const router = express.Router()
const formidable = require('formidable')//allows to upload the file to the server
const uuidv1 = require('uuid/v1') //allows to create unique id
const models = require('../models') //import everything in the model directory

module.exports = router

let uniqueFileName = ''//global variable. whenever apply something it is assigned to the unique filename

//don't need '/users' part of it because that is going to be taken care of by the users's route from app.js
router.get('/add-product', (req, res) => {
    res.render('users/add-product')
})

router.get('/products/:productId', async (req, res) => { //get parameter id
    let productId = req.params.productId
    let product = await models.Product.findByPk(productId) //find by primary key
    res.render('users/edit', product.dataValues) //dataValues will be the object that contains all the properties with their values for the particular product
    //dataValues itself contain the title and description and the price, photo imageURL
})

router.post('/upload/edit/:productId', (req, res) => {
    uploadFile(req, async (photoURL) => {
        let productId = parseInt(req.params.productId)
        let product = await models.Product.findByPk(productId) //get product object values
       
        let response = product.dataValues
        response.imageURL = photoURL //will have the new url of the existing product
        res.render('users/edit', response) 
        //particular object will contain the title, description and price etc..
    })
})

router.post('/update-product', async (req, res) => {
    const productId = req.body.productId
    const title = req.body.title
    const description = req.body.description
    const price = parseFloat(req.body.price)

    const result = models.Product.update({
        title: title,
        description: description,
        price: price,
        imageURL: uniqueFileName
    }, {
        where: {
            id: productId
        }
    })
    res.redirect('/users/products')
})

//retrieve products
router.get('/products', async (req, res) => {
    let products = await models.Product.findAll({
        where: {
            userid: req.session.user.userId,
        }
    })
    res.render('users/products', {products: products})
})

router.post('/add-product', async (req, res) => {
    let title = req.body.title
    let description = req.body.descdription
    let price = parseFloat(req.body.price) 
    let userId = req.session.user.userId

    //creating product object like from product.js from models directory
    //should match the properties of our model that has been created by sequelize
    let product = models.Product.build({
        title: title,
        description: description,
        price: price,
        userid: userId,
        imageURL: uniqueFileName //stored in the unique file property
    })
    
    //awaiting for the promise to be resolved which is going to be give the persisted product
    let persistedProduct = await product.save()

    if (persistedProduct != null) {
        res.redirect('/users/products')
    } else {
        res.render('users/add-product', {message: 'Unable to add product'})
    }
})

//action setted from add-product.mustache's form action
router.post('/upload', (req, res) => {
    //uploading the file and then rendering the page
    uploadFile(req, (photoURL) => {
        photoURL = `/uploads/${photoURL}`
        res.render('users/add-product', {imageURL: photoURL, className: 'product-preview-image'})
    }) //the callback function going to give us photo url
})

function uploadFile(req, callback) {
    new formidable.IncomingForm().parse(req)
    .on('fileBegin', (name, file) => { //name of file, file object itself

        uniqueFileName = `${uuidv1()}.${file.name.split('.').pop()}` //going to the give the uuid
        //gives the uniqueFilename property or object
        file.name = uniqueFileName

        // __dirname -> this will give us the path of the current directory
        file.path = /*'basedir'*/ __basedir + '/uploads/' + file.name 
        //how do we get the basedir => defined on app.js as global

    })
    .on('file', (name, file) => {
        callback(file.name)
    })
}

router.post('/delete-product', async (req, res) => {
    let productId = parseInt(req.body.productId)
    
    let result = await models.Product.destroy({
        where: {
            id: productId
        }
    })
    
    res.redirect('/users/products')
})
