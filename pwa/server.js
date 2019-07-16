const express = require('express')
const next = require('next')
const path = require('path')
const fs = require('fs')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare()
.then(() => {
  const server = express()
  const router = express.Router({ strict: true })

  // server.use(express.static('static'))
  
  server.set('view engine', 'pug')

  router.get('/a/:id/', (req, res) => {
    res.render('app', { title: 'Hey', message: 'Hello there!' })
  })

  router.get('/a/:id/pwa.js', (req, res) => {
    const filePath = path.resolve('.', 'static', 'js', 'pwa.js')
    res.type('application/javascript')
    return res.sendFile(filePath)
  })

  router.get('/a/:id/sw.js', (req, res) => {
    const filePath = path.resolve('.', 'static', 'js', 'sw.js')
    res.type('application/javascript')
    return res.sendFile(filePath)
  })

  router.get('/a/:id/manifest.json', (req, res) => {
    const filePath = path.resolve('.', 'catalog', req.params.id, 'app.json')
    if (fs.existsSync(filePath)) {
      const appObj = JSON.parse(fs.readFileSync(filePath, 'utf8'))
      const manifestObj = {
        short_name: appObj.short_name,
        name: appObj.name,
        icons: [
          {
            src: 'icon-192.png',
            type: 'image/png',
            sizes: '192x192'
          },
          {
            src: 'icon-512.png',
            type: 'image/png',
            sizes: '512x512'
          }
        ],
        start_url: '/a/facebook-messenger/?source=standalone',
        background_color: appObj.background_color,
        display: 'standalone',
        theme_color: appObj.theme_color,
      }
      res.json(manifestObj)
    }
  })

  router.get('/a/:id/icon-192.png', (req, res) => {
    const filePath = path.resolve('.', 'catalog', req.params.id, 'icon-192.png')
    return res.sendFile(filePath)
  })

  router.get('/a/:id/icon-512.png', (req, res) => {
    const filePath = path.resolve('.', 'catalog', req.params.id, 'icon-512.png')
    return res.sendFile(filePath)
  })

  server.use(router)

  /*
  server.get('*', (req, res) => {
    return handle(req, res)
  })
  */

  server.listen(3000, (err) => {
    if (err) throw err
    console.log('> Ready on http://localhost:3000')
  })
})
.catch((ex) => {
  console.error(ex.stack)
  process.exit(1)
})