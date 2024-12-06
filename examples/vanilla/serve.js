import express from 'express'
const app = express()
const port = 3000

// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })
app.all('*', function (res, req, next) {
  req.header('Access-Control-Allow-Origin', '*')
  req.header('Access-Control-Allow-Headers', 'Content-Type')
  req.header('Access-Control-Allow-Methods', '*')
  req.header('Content-Type', 'application/json;charset=utf-8')
  next()
})

app.post('/report', (req, res) => {
  console.log(req)
  res.send('Hello World!')
})

app.get('/report', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
