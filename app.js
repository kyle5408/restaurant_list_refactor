// ------------- 基本設定-------------
const express = require('express')
const app = express()
const port = 3000
const exhbs = require('express-handlebars')
const bodyParser = require('body-parser')
const routes = require('./routes')
const session = require('express-session')
const usePassport = require('./config/passport')
const flash = require('connect-flash')
require('./config/mongoose')

// ------------ 設定使用-------------
app.engine('handlebars', exhbs({
  defaultLayout: 'main'
}))
app.set('view engine', 'handlebars')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(session({
  secret: 'ThisiSmYSecret',
  resave: false,
  saveUninitialized: true
}))
usePassport(app)
app.use(flash())
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  res.locals.success_msg = req.flash('success_msg')
  res.locals.warning_msg = req.flash('warning_msg')
  next()
})

// ------------- 路由&回應-------------
app.use(routes)

//--------------啟動並監聽伺服器-------------
app.listen(port, () => {
  console.log(`The server is running in http://localhost:${port}`)
})