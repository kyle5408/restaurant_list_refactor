const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/restaurant')
const ObjectId = require('mongoose').Types.ObjectId
const methodOverride = require('method-override')
const { buildCheckFunction } = require('express-validator')
const checkParams = buildCheckFunction(['body', 'query', 'params'])
const validationResult = require('express-validator').validationResult

router.use(methodOverride('_method'))


//create
router.get('/new', (req, res) => {
  return res.render('new')
})

router.post('/', [
  checkParams('phone', '請輸入正確電話格式').isIMEI('## #### ####'),
  checkParams('rating', '評分須介於1~5').isFloat({ min: 1, max: 5.0 }), checkParams('name', '餐廳名稱最短需輸入3碼').isLength({ min: 3 }),
], (req, res) => {
  const errorsResult = validationResult(req)
  const { name, name_en, category, image, location, phone, google_map, rating, description } = req.body
  if (!errorsResult.isEmpty()) {
    const errorMsg = []
    errorsResult.errors.forEach(error =>
      errorMsg.push(error.msg))
    res.render('index', {
      errorMsg: errorMsg
    })
    return
  } else {
    return Restaurant.create({ name, name_en, category, image, location, phone, google_map, rating, description })
      .then(() => res.redirect('/'))
      .catch(error =>
        console.log(error))
  }
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
    console.log(validationResult(req))
    res.render('index', {
      errorMsg: '讀取失敗:Not a valid id'
    })
  }
  return Restaurant.findById(id)
    .lean()
    .then(restaurant => {
      res.render('show', { restaurant: restaurant })
    })
    .catch(error => {
      console.log(error)
    })
})


//edit
router.get('/:id/edit', (req, res) => {
  const id = req.params.id
  if (!ObjectId.isValid(id)) {
    return res.render('index', {
      errorMsg: '讀取失敗:Not a valid id'
    })
  }
  return Restaurant.findById(id)
    .lean()
    .then(restaurant => res.render('edit', { restaurant: restaurant }))
    .catch(error => console.log(error))
})


router.put('/:id', [
  checkParams('phone', '請輸入正確電話格式').isIMEI('## #### ####'),
  checkParams('rating', '評分須介於1~5').isFloat({ min: 1, max: 5.0 }), checkParams('name', '餐廳名稱最短需輸入3碼').isLength({ min: 3 }),
]
  , (req, res) => {
    const errorsResult = validationResult(req)
    const id = req.params.id
    const { name, name_en, category, image, location, phone, google_map, rating, description } = req.body

    if (!ObjectId.isValid(id)) {
      return res.render('index', { errorMsg: '讀取失敗:Not a valid id' })
    } else if (!errorsResult.isEmpty()) {
      const errorMsg = []
      errorsResult.errors.forEach(error =>
        errorMsg.push(error.msg))
      res.render('index', {
        errorMsg: errorMsg
      })
      return
    } else {
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
        .catch(error => {
          console.log(error)
        })

    }
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