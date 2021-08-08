const express = require('express')
const router = express.Router()
const User = require('../../models/user')
const passport = require('passport')
const bcrtpt = require('bcryptjs')


router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login'
}))

router.get('/logout', (req, res) => {
  req.logOut()
  req.flash('success_msg', '你已經成功登出')
  res.redirect('/users/login')
})

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  const errors = []
  if ( !email || !password || !confirmPassword ){
    errors.push({ message: '請填入所有必填欄位' })
  }
  if ( password !== confirmPassword) {
    errors.push({ message: '密碼與確認密碼不相符' })
  }
  if (errors.length) {
    return res.render('register', {
      errors,
      name, 
      email, 
      password, 
      confirmPassword
    })
  }
  User.findOne({ email })
    .then(user => {
      if (user) {
        errors.push({ message: '此Mail已被註冊' })
        res.render('register', {
          errors,
          name,
          email,
          password,
          confirmPassword
        })
      } else {
        return bcrypt
        .genSalt(10)
          .then(salt => bcrypt(password, salt))
          .then(hash => User.create({
            name,
            email,
            password: hash,
          }))
        
          .then(() => res.redirect('/'))
          .catch(err => console.log(err))
      }
    })
})

module.exports = router