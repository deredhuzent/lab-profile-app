const router = require('express').Router();
const User = require('../models/User');
const passport = require('passport');
const {isLogged} = require('../handlers/middlewares');

/* no hay get porque no renderizamos pags nuevas */

router.get('/edit/:id', isLogged, (req, res, next) => {
    const {id} = req.params
    User.findById(id)
    .then(user => {res.status(200).json(user)})
    .catch(err => res.status(500).json(err))
})

/* SIGNUP */
router.post('/signup', (req, res, next) => {
    const username = req.body.username
    const password = req.body.password
  
    if(!username || !password) { /* este sirve */
      res.status(400).json({
        message: 'Plis provide username and password'
      })
    next()
    }
  
    if(password.length < 3) { /* funciona */
      res.status(400).json({
        message: 'Password too short, at least 3 characters'
      })
    next()
    }
  
    User.register({...req.body}, password)
    .then(user => res.status(200).json(user))
    .then(err=> res.status(500).json(err))
  
    req.login(User, (err) => {
      if(err) {
        res.status(500).json({
          message: 'Loggin went bad'
        })
        return
      }
  
      res.status(200).json(User)
    })
  })
  
  /* LOGIN */
  router.post('/login', (req, res, next) => {
  /* passport me da el authenticate */
  passport.authenticate('local', (err, user, infoErr) => {
  
    if (err) return res.status(500).json({ err, infoErr })
    if(!user) return res.status(401).json({
      message:'The user does NOT exist dude...'
    });
    req.logIn(user, err => {
        if (err) return res.status(500).json(err)
        res.status(200).json(user)
      })
    })(req, res, next)
  })
  
  /* LOGGED IN */
  router.post('/loggedin', isLogged, (req, res, next) => {
    res.status(200).json({
      message:'you are logged in'
    })
  })
  
  /* LOGOUT */
  router.get('/logout', isLogged, (req, rex, next) => {
    /* logout es de passport */
    req.logout()
    res.status(200)
    .clearCookie('connect.sid', {path: '/'}) /* para que no se guarde la sesión */
    .json({
      message: 'Logged out'
    })
  
  /*  
  ESTO LO VI POR AHÍ, NECESITO ENTENDER: 
  
  req.session.destroy(err => {
      if(!err) {
        res.status(200)
        CLEAR COOKIE
        .json({
          message: 'Logged out'
        })
      }
    }) */
  })
  
  module.exports = router;