const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/restaurant')
const ObjectId = require('mongoose').Types.ObjectId
const methodOverride = require('method-override')

router.use(methodOverride('_method'))

//create
router.get('/new', (req, res) => {
  return res.render('new')
})

router.post('/', (req, res) => {
  const { name, name_en, category, image, location, phone, google_map, rating, description } = req.body
  return Restaurant.create({ name, name_en, category, image, location, phone, google_map, rating, description })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})


//search
router.get('/searches', (req, res) => {
  //使用mongoose內reg模糊查詢功能
  const keyword = RegExp(req.query.keyword, 'i') //i為不分大小寫
  return Restaurant.find({ $or: [{ 'name': { $regex: keyword } }, { 'category': { $regex: keyword } }] })
    .lean()
    .then(restaurant => {
      if (restaurant.length === 0) {
        res.render('index', { restaurants: restaurant, errorMsg: '無符合搜尋結果' })
        return
      }
      res.render('index', { restaurants: restaurant, keyword: req.query.keyword })
    })
    .catch(error => console.log(error))
})

//detail
router.get('/:id', (req, res) => {
  const id = req.params.id
  if (!ObjectId.isValid(id)) {
    return res.render('index', {
      errorMsg: '讀取失敗:Not a valid id'
    })
  }
  return Restaurant.findById(id)
    .lean()
    .then(restaurant => {
      res.render('show', { restaurant: restaurant })
    })
    .catch(error => console.log(error))
})


//edit
router.get('/:id/edit', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then(restaurant => res.render('edit', { restaurant: restaurant }))
    .catch(error => console.log(error))
})

router.put('/:id', (req, res) => {
  const id = req.params.id
  const { name, name_en, category, image, location, phone, google_map, rating, description } = req.body

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



//delete
router.delete('/:id', (req, res) => {
  const id = req.params.id
  if (!ObjectId.isValid(id)) {
    return res.render('index', {
      errorMsg: '刪除失敗:Not a valid id'
    })
  }
  return Restaurant.findById(id)
    .then(restaurant => { restaurant.remove() })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})



module.exports = router