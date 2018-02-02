const express = require('express')
const app = express()

const Duration = require('js-joda').LocalTime.ofSecondOfDay

const elapsed = () => {
  let running = Math.floor(process.uptime() % 86400)
  return Duration(running).toString()
}

app.get('/', (req, res) => {
  let environment = process.env['BUILD_PROFILE']
  // environment = 'TEST'
  res.send(elapsed() + ' (' + environment + ')\n')
})

app.listen(3000, () =>
  console.log('Example app listening on port 3000')
)
