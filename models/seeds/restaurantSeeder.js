const bcrypt = require('bcryptjs')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const Restaurant = require('../restaurant')
const User = require('../user')
const seedList = require('../restaurant.json')
const seed = seedList.results
const db = require('../../config/mongoose')

const SEED_USERS = [{
  name: 'user1',
  email: 'user1@example.com',
  password: '12345678',
  restaurant: seed.slice(0, 3)
},
{
  name: 'user2',
  email: 'user2@example.com',
  password: '12345678',
  restaurant: seed.slice(3, 6)
},
]

db.once('open', () => {
  Promise.all(
    Array.from(SEED_USERS, (SEED_USER, i) => {
      return bcrypt
        .genSalt(10)
        .then(salt => bcrypt.hash(SEED_USER.password, salt))
        .then(hash =>
          User.create({
            name: SEED_USER.name,
            email: SEED_USER.email,
            password: hash
          })
        )
        .then(user => {
          const restaurantList = SEED_USER.restaurant
          return Promise.all(Array.from(restaurantList, (restaurant, i) => {
            const { name, name_en, category, image, location, phone, google_map, rating, description } = restaurant
            const userId = user._id
            return Restaurant.create({ name, name_en, category, image, location, phone, google_map, rating, description, userId })
          }))
        })
    })
  )
    .then(() => {
      console.log('Restaurant update successful!')
      process.exit()
    })
    .catch(err => console.log(err))
})
