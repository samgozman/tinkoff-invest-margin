const express = require('express')
const path  = require('path')

const viewsPath = path.join(__dirname, '../../templates/views')
const router = new express.Router()

// root index page
router.get('', (req, res) => {
    res.sendFile(viewsPath + '/index.html')
})

module.exports = router