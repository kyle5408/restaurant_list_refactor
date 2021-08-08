const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/restaurant')
const sort = require('../../controller/sort')


router.get('/', (req, res) => {
  const sortValue = req.query.sort
  const sortWay = sort(sortValue)
  const userId = req.user._id
  Restaurant.find({ userId })
    .lean()
    .sort(sortWay)
    .then(restaurant => {
      res.render('index', { restaurants: restaurant, sortValue })
    })
    .catch(error => console.log(error))
  return
})

module.exports = router