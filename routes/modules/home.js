const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/restaurant')
const sortList = require('../../config/sort.json')


router.get('/', (req, res) => {
  const sort = req.query.sort
  if (sort === "asc") {
    Restaurant.find()
      .lean()
      .sort({ name: 'asc' })
      .then(restaurant => {
        res.render('index', { restaurants: restaurant, sortList: sortList, asc: sort })
      })
      .catch(error => console.log(error))
    return
  }

  if (sort === "desc") {
    Restaurant.find()
      .lean()
      .sort({ name: 'desc' })
      .then(restaurant => {
        res.render('index', { restaurants: restaurant, sortList: sortList, desc: sort })
      })
      .catch(error => console.log(error))
    return
  }

  if (sort === "category") {
    Restaurant.find()
      .lean()
      .sort({ category: 'asc' })
      .then(restaurant => {
        res.render('index', { restaurants: restaurant, sortList: sortList, category: sort })
      })
      .catch(error => console.log(error))
    return
  }

  if (sort === "location") {
    Restaurant.find()
      .lean()
      .sort({ location: 'asc' })
      .then(restaurant => {
        res.render('index', { restaurants: restaurant, sortList: sortList, location: sort })
      })
      .catch(error => console.log(error))
    return
  }

  Restaurant.find()
    .lean()
    .sort({ _id: 'asc' })
    .then(restaurant => {
      res.render('index', { restaurants: restaurant, sortList: sortList, sort: sort })
    })
    .catch(error => console.log(error))
})

module.exports = router