var express = require('express')
var router = express.Router()

/* GET home page. */
router.post('/user', function (req, res, next) {
  console.log(req.body.username)
  res.json({
    message: 'user added'
  })
})

module.exports = router
