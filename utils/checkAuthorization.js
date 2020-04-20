function checkAuthorization(req, res, next) {
   if (req.session) {
        if (req.session.user) {
            res.locals.authenticated = true

            next() //have session & session does contain user
        } else {
            res.redirect('/login') 
        }
   } else {
       res.redirect('/login')
   }
}

module.exports = checkAuthorization