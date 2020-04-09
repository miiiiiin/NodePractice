const express = require('express')
const app  = express()
const mustacheExpress = require('mustache-express')
const bodyParser = require('body-parser')
const pgp = require('pg-promise')()
const bcrypt = require('bcrypt')
const PORT = 3000
const CONNECTION_STRING = "postgres://localhost:5432/newsdb"
const SALT_ROUND = 10
const session = require('express-session')

//configuring view engine
app.engine('mustache', mustacheExpress())
app.set('views', './views')
app.set('view engine', 'mustache')

//bodyparser middleware
app.use(bodyParser.urlencoded({extended: false}))

app.use(session ({
    secret: 'sdafsd',
    resave: false, // if the session is changed choose saving or not 
    saveUninitialized: false //whether create a session if you don't put anything
}))

//create db object
const db = pgp(CONNECTION_STRING)

app.get('/users/articles', (req, res) => {
    res.render('articles',{username: req.session.user.username})
})

app.post('/login', (req, res) => {
    let username = req.body.username
    let password = req.body.password

    db.oneOrNone('SELECT userid,username,password FROM users WHERE username = $1', [username])
    .then((user) => {
        if(user) { //check for user's password
        bcrypt.compare(password.user.password,function(error, result) {
            //compare with the actual password(compare with stored hashed password in db)
            if (result) {
                //put username and userid in the session
                if(req.session) {
                    // req.session.username = username
                    // req.session.userId = user.userId

                    //put particular object in the session
                    req.session.user = {userId: use.userId, username: user.username}
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

app.get('/login', (req, res) => {
    res.render('login')
})

//create route
app.get('/register', (req, res) => {
    res.render('register') //render the register page
})

app.post('/register', (req, res) => {
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

app.listen(PORT, () => {
    console.log(`Server has started on ${PORT}`)
})