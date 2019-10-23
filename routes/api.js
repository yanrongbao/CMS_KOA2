const router = require('koa-router')()

const DB = require('../module/DB')

router.get('/', async ctx => {
  ctx.body = 'api接口'
})

router.get('/catelist', async ctx => {
  let result = await DB.find('articlecate', {})
  ctx.body = {
    result
  }
})
module.exports = router.routes()
