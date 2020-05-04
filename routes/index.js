const express = require('express')
const bcrypt = require('bcrypt')
const router = express.Router()

const SALT_ROUND = 10

module.exports = router

/*
router.get('/', (req,res) => {
    db.any('SELECT articleid, title, body FROM articles')
    .then((articles) => {
        res.render('index', {artlcles: articles})
    })
})
*/

//async-await function
router.get('/', async (req,res) => {
    //if your func marked as async can await for the promise to be resolved
    //await means 'then'
    let articles = await db.any('SELECT articleid, title, body FROM articles')
    res.render('index', {artlcles: articles})
})

//deploy test
router.get('/hello', (req,res,next) => {
    res.send('Hello World!')
})

router.get('/logout', (req,res,next) => {
    if (req.session) {
        req.session.destroy((error) => {
            if (error) {
                next(error)
            } else {
                res.redirect('/login')
            }
        })
    }
})

router.get('/register', (req, res) => {
    res.render('register') //render the register page
})

router.get('/login', (req, res) => {
    res.render('login')
})

router.post('/login', (req, res) => {
    let username = req.body.username
    let password = req.body.password

    db.oneOrNone('SELECT userid,username,password FROM users WHERE username = $1', [username])
    .then((user) => {
        if(user) { //check for user's password
        bcrypt.compare(password, user.password,function(error, result) {
            //compare with the actual password(compare with stored hashed password in db)
            if (result) {
                //put username and userid in the session
                if(req.session) {
                    // req.session.username = username
                    // req.session.userId = user.userId

                    //put particular object in the session
                    req.session.user = {userId: user.userId, username: user.username}
                }

                res.redirect('/users/articles')

            } else {
                res.render('login', {message: "Invalid username or password"})
            }
        })
        

        } else { //if user is doesn't exist
            res.render('login', {message: "Invalid username or password"})
        }
    }).catch((e) => {
        console.log('handle error here: ', e.message)
     })
})

router.post('/register', (req, res) => {
    let username = req.body.username
    let password = req.body.password

    //return you either 1 record or none
    db.oneOrNone('SELECT userid FROM users WHERE username = $1', [username])
    .then((user) => {
        if (user) {//if it's exist
            res.render('register', {message: "User name already exist"})
        } else {
            //insert user into the users table
            bcrypt.hash(password,SALT_ROUND,function(error, hash) {
                if (error == null) {
                    db.none('INSERT INTO users(username, password) VALUES($1, $2)', [username, hash]) //password -> hash
                    .then(() => {
                        res.send('SUCCESS')
                    }).catch((e) => {
                          console.log('handle error here: ', e.message)
                    })
                }
            })
        }
    })
})