const express = require('express')
const app = express()
const mustacheExpress = require('mustache-express')
const path = require('path')
const PORT = 3000
const VIEWS_PATH = path.join(__dirname, '/views') //passing in dirname which always going to return you the location where this file is actually running from
//the 'views' folder will be in my current directory

app.engine('mustache', mustacheExpress(VIEWS_PATH + '/partials', '.mustache'))
//pass in the path of the views folder to the root dir, and attach it to the partials 
//partials will be extension mustache
app.set('views', VIEWS_PATH)
app.set('view engine', 'mustache')

app.listen(PORT, () => console.log('server is running...'))