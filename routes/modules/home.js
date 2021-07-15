const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/restaurant')


router.get('/', (req, res) => {
  const sort = req.query.sort
  if (sort === "asc") {
    Restaurant.find()
      .lean()
      .sort({ name: 'asc' })
      .then(restaurant => {
        res.render('index', { restaurants: restaurant, asc: sort })
      })
      .catch(error => console.log(error))
    return
  }

  if (sort === "desc") {
    Restaurant.find()
      .lean()
      .sort({ name: 'desc' })
      .then(restaurant => {
        res.render('index', { restaurants: restaurant, desc: sort })
      })
      .catch(error => console.log(error))
    return
  }

  if (sort === "category") {
    Restaurant.find()
      .lean()
      .sort({ category: 'asc' })
      .then(restaurant => {
        res.render('index', { restaurants: restaurant, category: sort })
      })
      .catch(error => console.log(error))
    return
  }

  if (sort === "location") {
    Restaurant.find()
      .lean()
      .sort({ location: 'asc' })
      .then(restaurant => {
        res.render('index', { restaurants: restaurant, location: sort })
      })
      .catch(error => console.log(error))
    return
  }

  Restaurant.find()
    .lean()
    .sort({ _id: 'asc' })
    .then(restaurant => {
      res.render('index', { restaurants: restaurant, sort: sort })
    })
    .catch(error => console.log(error))
})

module.exports = router