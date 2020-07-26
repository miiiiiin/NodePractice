const express = require('express')
const app = express()
const mustacheExpress = require('mustache-express')
const path = require('path')
const bodyParser = require('body-parser')
const models = require('./models')
const bcrypt = require('bcrypt')

const SALT_ROUNDS = 10
const PORT = 3000
const VIEWS_PATH = path.join(__dirname, '/views') //passing in dirname which always going to return you the location where this file is actually running from
//the 'views' folder will be in my current directory

app.use(bodyParser.urlencoded({extended: false}))//bodyparser will be looking for urlencoded values which will be submitted by the form

app.engine('mustache', mustacheExpress(VIEWS_PATH + '/partials', '.mustache'))
//pass in the path of the views folder to the root dir, and attach it to the partials 
//partials will be extension mustache
app.set('views', VIEWS_PATH)
app.set('view engine', 'mustache')


app.get('/register', (req, res) => {
    res.render('register')//register mustache
})

app.get('/login', (req, res) => {
    res.render('login') //login mustache
})

//MARK: - async/await -
app.post('/register', async (req, res) => {
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
                    res.render('/register', {message: "User Already Exist!"})
                }
            }
        })
    } else {
        //send the user to the register page
        res.render('/register', {message: "User Already Exist!"})
    }
  } catch {
      console.log(err)
  }
})

app.listen(PORT, () => console.log('server is running...'))