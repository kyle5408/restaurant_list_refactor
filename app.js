// ------------- 基本設定-------------
const express = require('express')
const restaurants = require('./restaurant.json')
const app = express()
const port = 3000
const exhbs = require('express-handlebars')
app.engine('handlebars', exhbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(express.static('public'))


// ------------- 回應-------------
app.get('/', (req, res) => {
  const restaurant = restaurants.results
  res.render('index', { restaurants: restaurant })
})
app.get('/restaurants/:restaurant_id', (req, res) => {
  const restaurant_id = req.params.restaurant_id
  const showRestaurant = restaurants.results.find(restaurant => restaurant.id === Number(restaurant_id))
  res.render('show', { showRestaurant: showRestaurant })
})
app.get('/search', (req, res) => {
  const keyword = req.query.keyword
  const searchResult = restaurants.results.filter(restaurant =>
    restaurant.name.toUpperCase().includes(keyword.toUpperCase())
    || restaurant.category.toUpperCase().includes(keyword.toUpperCase())
  )
  res.render('index', { restaurants: searchResult, keyword: keyword })
})



//--------------啟動並監聽伺服器-------------
app.listen(port, () => {
  console.log(`The server is running in http://localhost:${port}`)
})