const express = require('express')
const bodyParser = require('body-parser')

const app = express()
const route =require('../noderoute/route')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/api', route)

app.listen(3002, function () {
  console.log("listening...");
})
