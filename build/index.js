const express = require('express')

const app = express()
const route =require('../noderoute/route')

app.use('/api', route)

app.listen(3002, function () {
  console.log("listening...");
})
