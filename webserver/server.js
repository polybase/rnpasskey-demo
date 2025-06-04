// This is the webserver serving out apple-app-site-association and assetlnks.json

const express = require('express')
const app = express()
const path = require('path')

app.use('/.well-known', express.static(path.join(__dirname, '../.well-known'), {
  setHeaders(res, path) {
    if (path.endsWith('apple-app-site-association')) {
      res.setHeader('Content-Type', 'application/json')
    }
  }
}))

app.listen(9000, () => {
  console.log('Domain webserver running on localhost:9000')
})



