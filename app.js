const express = require('express')
const app  = express()
const mustacheExpress = require('mustache-express')
const bodyParser = require('body-parser')
const pgp = require('pg-promise')()
const PORT = 3000
const CONNECTION_STRING = "postgres://localhost:5432/newsdb"

//configuring view engine
app.engine('mustache', mustacheExpress())
app.set('views', './views')
app.set('view engine', 'mustache')

//bodyparser middleware
app.use(bodyParser.urlencoded({extended: false}))

//create db object
const db = pgp(CONNECTION_STRING)


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
            db.none('INSERT INTO users(username, password) VALUES($1, $2)', [username, password])
            .then(() => {
                res.send('SUCCESS')

            })
        }
    })

})

app.listen(PORT, () => {
    console.log(`Server has started on ${PORT}`)
})