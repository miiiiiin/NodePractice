const express = require('express')
const app = express()
const mustacheExpress = require('mustache-express')
const path = require('path')
const bodyParser = require('body-parser')
const models = require('./models')
const bcrypt = require('bcrypt')
const session = require('express-session')
const indexRoutes = require('./routes/index')
const userRoutes = require('./routes/users')

const PORT = 3000
const VIEWS_PATH = path.join(__dirname, '/views') //passing in dirname which always going to return you the location where this file is actually running from
//the 'views' folder will be in my current directory

// GLOBAL BASE DIRECTORY
global.__basedir = __dirname 

//STATIC FOLDER
app.use('/uploads', express.static('uploads')) //the upload folder can be accessed if you go to the upload url

app.use(session({
    secret: 'somesecret',
    resave: true,
    saveUninitialized: false //only going to save the session if there is something in the session to be saved otehrwise not going to save the session
}))
app.use(bodyParser.urlencoded({extended: false}))//bodyparser will be looking for urlencoded values which will be submitted by the form

app.engine('mustache', mustacheExpress(VIEWS_PATH + '/partials', '.mustache'))
//pass in the path of the views folder to the root dir, and attach it to the partials 
//partials will be extension mustache
app.set('views', VIEWS_PATH)
app.set('view engine', 'mustache')

app.use('/', indexRoutes)
app.use('/users', userRoutes)
app.listen(PORT, () => console.log('server is running...'))