import express from 'express'
import cors from 'cors'
const app = express()
const port = 3000

app.use(cors())
// 解析 text/plain 请求体
app.use(express.text({ type: 'text/plain' }))

app.post('/report', (req, res) => {
  const data = JSON.parse(req.body) // 将文本数据解析为 JSON 对象
  // console.log(req)
  console.log('¬∆¬ data', data)
  res.send('Hello World!')
})

app.get('/report', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
