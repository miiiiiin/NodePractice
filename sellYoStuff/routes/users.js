const express = require('express')
const router = express.Router()
const formidable = require('formidable')

module.exports = router

router.get('/add-product', (req, res) => {
    res.render('users/add-product')
})

//action setted from add-product.mustache's form action
router.post('/upload', (req, res) => {
    //uploading the file and then rendering the page
    uploadFile(req, (photoURL) => {
        res.send('UPLOAD')
    }) //the callback function going to give us photo url
})

function uploadFile(req, callback) {
    new formidable.IncomingForm().parse(req)
    .on('fileBegin', (name, file) => { //name of file, file object itself

        // __dirname -> this will give us the path of the current directory
        file.path = /*'basedir'*/ __basedir + '/uploads/' + file.name 
        //how do we get the basedir => defined on app.js as global
    })
    .on('file', (name, file) => {
        callback(file.name)
    })
}