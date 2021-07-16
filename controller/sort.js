const express = require('express')
const router = express.Router()
const Restaurant = require('../models/restaurant')

function sort(sortValue) {
  const sortArray = {
    default: { _id: 'asc' },
    asc: { name: 'asc' },
    desc: { name: 'desc' },
    category: { category: 'asc' },
    location: { location: 'asc' },
    rating: { rating: 'desc' }
  }

  return sortArray[sortValue]
}

module.exports = sort