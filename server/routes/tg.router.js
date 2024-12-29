const Router = require('express')
const router = new Router()
const tgController = require('../controllers/tg/tg.controller')

router.post('/getInvoiceLink', tgController.getInvoiceLink)
router.post('/getInvoiceLink2', tgController.getInvoiceLink2)


module.exports = router