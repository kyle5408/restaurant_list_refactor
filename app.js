// ------------- 基本設定-------------
const express = require('express')
// const restaurants = require('./restaurant.json')
const Restaurant = require('./models/restaurant')
const app = express()
const port = 3001
const bodyParser = require('body-parser')
const exhbs = require('express-handlebars')
const mongoose = require('mongoose')
const restaurant = require('./models/restaurant')
mongoose.connect('mongodb://localhost/restaurant-list', { useNewUrlParser: true, useUnifiedTopology: true })
app.engine('handlebars', exhbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(express.static('public'))

// ------------ 設定db-------------
const db = mongoose.connection
db.on('error', () => {
  console.log('mongodb error!')
})

db.once('open', () => {
  console.log('mongodb connected!')
})

// ------------ 設定使用-------------
app.use(bodyParser.urlencoded({ extended: true }))



// ------------- 路由&回應-------------
app.get('/', (req, res) => {
  Restaurant.find()
    .lean()
    .then(restaurant => res.render('index', { restaurants: restaurant }))

    .catch(error => console.log(error))
})

//index
app.get('/restaurants/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then(restaurant => res.render('show', { restaurant: restaurant }))
    .catch(error => console.log(error))
})

//search
app.get('/search', (req, res) => {
  //使用mongoose內reg模糊查詢功能
  const keyword = RegExp(req.query.keyword, 'i') //i為不分大小寫
  return Restaurant.find({ $or: [{ 'name': { $regex: keyword } }, { 'category': { $regex: keyword } }] })
    .lean()
    .then(restaurant =>
      res.render('index', { restaurants: restaurant, keyword: req.query.keyword }))
    .catch(error => console.log(error))
})

//edit
app.get('/restaurants/:id/edit', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then(restaurant => res.render('edit', { restaurant: restaurant }))
    .catch(error => console.log(error))
})

app.post('/restaurants/:id/edit', (req, res) => {
  const id = req.params.id
  const name = req.body.name
  const name_en = req.body.name_en
  const category = req.body.category
  const image = req.body.image
  const location = req.body.location
  const phone = req.body.phone
  const google_map = req.body.google_map
  const rating = req.body.rating
  const description = req.body.description


  return Restaurant.findById(id)
    .then(restaurant => {
      restaurant.name = name
      restaurant.name_en = name_en
      restaurant.category = category
      restaurant.image = image
      restaurant.location = location
      restaurant.phone = phone
      restaurant.google_map = google_map
      restaurant.rating = rating
      restaurant.description = description
      return restaurant.save()
    })
    .then(() => res.redirect(`/restaurants/${id}`))
    .catch(error => console.log(error))
})

//create
app.get('/restaurants/new', (req, res) => {
  return res.render('new')
})

app.post('/restaurants', (req, res) => {
  const name = req.body.name
  const name_en = req.body.name_en
  const category = req.body.category
  const image = req.body.image
  const location = req.body.location
  const phone = req.body.phone
  const google_map = req.body.google_map
  const rating = req.body.rating
  const description = req.body.description
  return Restaurant.create({ name, name_en, category, image, location, phone, google_map, rating, description })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

//delete
app.post('/restaurants/:id/delete', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .then(restaurant => estaurant.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})



//--------------啟動並監聽伺服器-------------
app.listen(port, () => {
  console.log(`The server is running in http://localhost:${port}`)
})