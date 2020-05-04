const express = require('express')
const app  = express()
const mustacheExpress = require('mustache-express')
const bodyParser = require('body-parser')
const pgp = require('pg-promise')()
// const bcrypt = require('bcrypt')
// const PORT = 3000
const PORT = process.env.PORT || 8080 //assign heroku to assign the port
// const CONNECTION_STRING = "postgres://localhost:5432/newsdb"
//SET HEROKU-postgres db connection
const CONNECTION_STRING = "postgres://wkbhtjnjebgjzi:05621d5a071942d383d056ebd485464e4e342e555cef3cab0eb110fd95068358@ec2-54-165-36-134.compute-1.amazonaws.com:5432/d4e09bjbgkkpvh"
const session = require('express-session')
const path = require('path')
const checkAuthorization = require('./utils/checkAuthorization') //middleware

//set routes paths
const userRoutes = require('./routes/users')
const indexRoutes = require('./routes/index')

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

app.use((req,res,next) => {
    console.log(req.session.user)
    res.locals.authenticated = req.session.user == null ? false : true //will be available every single mustache page or any other template engine
    next()
})

//create db object
//const
db = pgp(CONNECTION_STRING) //will be visible everywhere

//setup routes(=middleware)
app.use('/users', checkAuthorization, userRoutes)
app.use('/', indexRoutes)

app.listen(PORT, () => {
    console.log(`Server has started on ${PORT}`)
})