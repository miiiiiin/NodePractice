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
const path = require('path')

const VIEWS_PATH = path.join(__dirname,'/views')

//configuring view engine
app.engine('mustache', mustacheExpress(VIEWS_PATH + '/partials', '.mustache')) //path to partials as first arg
// app.set('views', './views')
app.set('views', VIEWS_PATH)
app.set('view engine', 'mustache')
app.use('/css',express.static('css')) //define static resourcer(localhost:3000/css/site.css)
//everything inside the foler will be available at the root level

//bodyparser middleware
app.use(bodyParser.urlencoded({extended: false}))

app.use(session ({
    secret: 'dgadfasfsdfs',
    resave: false, // if the session is changed choose saving or not 
    saveUninitialized: false //whether create a session if you don't put anything
}))

//create db object
const db = pgp(CONNECTION_STRING)

app.get('/', (req,res) => {
    db.any('SELECT articleid, title, body FROM articles')
    .then((articles) => {
        res.render('index', {artlcles: articles})
    })
})

app.post('/users/delete-article', (req,res) => {
    let articleId = req.body.articleId
    db.none('DELETE FROM articles where articleid = $1', [articleId])
    .then(() => {
        res.redirect('/users/articles')
    })
})

app.get('/users/add-article', (req, res) => {
    res.render('add-article')
})

app.get('/users/articles/edit/:articleId', (req, res) => {
    let articleId = req.params.articleId
    db.one('SELECT articleid,title,body FROM articles WHERE articleid = $1', [articleId])
    .then((article) => {
        res.render('edit-article', article)
    })
})

app.post('/users/add-article', (req,res) => {
    let title = req.body.title
    let description = req.body.description
    let userId = req.session.user.userId

    db.none('INSERT INTO articles(title, body, userid) VALUES($1,$2,$3)',[title,description,userId])
    .then(() => {
        res.send("SUCCESS")
    })
})

app.get('/users/articles', (req, res) => { //route
    let userId = 5//req.session.user.userId
    db.any('SELECT articleid,title,body FROM articles WHERE userid = $1', [userId])
    .then((articles) => {
        res.render('articles', {articles: articles})
    })
})

app.post('/users/update-article', (req, res) => {
    let title = req.body.title
    let description = req.body.description
    let articleId = req.body.articleId

    db.none('UPDATE articles SET title = $1, body = $2 WHERE articleid = $3',[title,description,articleId])
    .then(() => {
        res.redirect('/users/articles')
    }).catch((e) => {
        console.log('handle error here: ', e.message)
  })
})

app.post('/login', (req, res) => {
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