const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/restaurant')
// const sort = require('../../public/javascript/index.js')

router.get('/', (req, res) => {
  Restaurant.find()
    .lean()
    // .then(() => {
    //   if (sort.value = 'asc') {
    //     console.log('正序')
    //   }
    // })
    .sort({ _id: 'asc' })
    .then(restaurant => res.render('index', { restaurants: restaurant }))
    .catch(error => console.log(error))
})

module.exports = router