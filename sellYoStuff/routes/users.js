const express = require('express')
const router = express.Router()
const formidable = require('formidable')//allows to upload the file to the server
const uuidv1 = require('uuid/v1') //allows to create unique id

module.exports = router

router.get('/add-product', (req, res) => {
    res.render('users/add-product')
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