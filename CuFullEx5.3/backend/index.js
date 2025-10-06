const express = require('express')
const app = express()
const PORT = process.env.PORT || 4000

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from Backend (ECS Fargate)!' })
})

app.listen(PORT, ()=>{
  console.log('Backend listening on', PORT)
})
