const mongoose = require('mongoose')
const Restaurant = require('../restaurant') 
// const restaurants = require('../../restaurant.json')

mongoose.connect('mongodb://localhost/restaurant-list', { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
db.on('error', () => {
  console.log('mongodb error!')
})
db.once('open', () => {
  console.log('mongodb connected!')


  // // 用restaurant.json匯入資料
  // for (i = 0; i < restaurants.results.length; i++) {
  //   Restaurant.create({
  //     id: `${restaurants.results[i].id}`,
  //     name: `${restaurants.results[i].name}`,
  //     name_en: `${restaurants.results[i].name_en}`,
  //     category: `${restaurants.results[i].category}`,
  //     image: `${restaurants.results[i].image}`,
  //     location: `${restaurants.results[i].location}`,
  //     phone: `${restaurants.results[i].phone}`,
  //     google_map: `${restaurants.results[i].google_map}`,
  //     rating: `${restaurants.results[i].rating}`,
  //     description: `${restaurants.results[i].description}`
  //   }
  //   )
  // }



  console.log(restaurants.results.length)
})