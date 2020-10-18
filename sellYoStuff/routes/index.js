const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const models = require('../models')

const SALT_ROUNDS = 10

module.exports = router

router.get('/', async (req, res) => {
    //use promise function or await
    //so that we wait for the promise to get results
    let products = await models.Product.findAll() //get all the products which are available in db
    res.render('index', {products: products}) //pass in index.mustache as {{#products}}
    //dataValues : basically an object that constains all the different properties of the product
}) 

router.get('/products/:productId', async (req, res) => {
    const productId = req.params.productId
    const product = await models.Product.findByPk(productId)

    res.render('product-details', product.dataValues) //datavalue is a property of any object that is return from the sequelize object
})

router.get('/login', (req, res) => {
    res.render('login') //login mustache
})

router.get('/register', (req, res) => {
    res.render('register')//register mustache
})

//MARK: - async/await -
router.post('/register', async (req, res) => {
    try {
        let username = req.body.username
        let password = req.body.password
    
        //means it's going to wait for this promise to dissolve
        //when this promise is resolved it's going to give me which is the one User
        //which matches the username
        let persistedUser = await models.User.findOne({
            where: {
                username: username
            }
        })
        
        if (persistedUser == null) {
            bcrypt.hash(password, SALT_ROUNDS, async (error, hash) => {
                if (error) {
                    res.render('/register',{message: 'Error creating user!'})
                } else {
                    //user does not exist
                    let user = models.User.build({
                        username: username,
                        password: hash//password
                    })
                    let savedUser = await user.save()
    
                    if (savedUser != null) {
                        //user have been saved
                        res.redirect('/login')
                    } else {
                        res.render('/register', {message: 'User Already Exist!'})
                    }
                }
            })
        } else {
            //send the user to the register page
            res.render('/register', {message: 'User Already Exist!'})
         }
      } catch {
          console.log(err)
      }
    })


router.post("/login", async (req, res) => {
    try {
        let username = req.body.username
        let password = req.body.password
    
        let user = await models.User.findOne({
            where: {
                username: username
            }
        })
    
        if (user != null) {
            //compare input password & hash password in databse
            bcrypt.compare(password, user.password, (error, result) => {
                if (result) {
                    //create a session
    
                    if (req.session) {
                        req.session.user = { userId: user.id }
                        res.redirect('/users/products')
                    }
                } else {
                    res.render('login', {message: 'Incorrectd username or password!'})
                }
            })
    
        } else { //if the user is null
            res.render('login', {message: 'Incorrectd username or password!'})
        }
    } catch {
        console.log(err)
    }
})
