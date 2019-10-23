const router = require('koa-router')()

const DB = require('../../module/DB')

const tools = require('../../module/toolist')

router.get('/', async ctx => {
  let result = await DB.find('nav', {})

  await ctx.render('admin/nav/list', {
    list: result
  })
})

router.get('/add', async ctx => {
  await ctx.render('admin/nav/add')
})

router.post('/doAdd', tools.multer().single('pic'), async ctx => {
  let { title, url, sort, status } = ctx.req.body
  let add_time = tools.getTime()
  await DB.insert('nav', {
    title,
    url,
    sort,
    status,
    add_time
  })
  ctx.redirect(ctx.state.__HOST__ + '/admin/nav')
})

router.get('/edit', async ctx => {
  let { id } = ctx.query

  let result = await DB.find('nav', { _id: DB.getObjectID(id) })

  ctx.render('admin/nav/edit', {
    list: result[0],
    prevPage: ctx.state.G.prevPage
  })
})

router.post('/doEdit', tools.multer().single('pic'), async ctx => {
  let { id, title, url, sort, status, prevPage } = ctx.req.body
  let add_time = tools.getTime()
  let json = { title, url, sort, status, prevPage }

  await DB.update('nav', { _id: DB.getObjectID(id) }, json)
  //跳转
  if (prevPage) {
    ctx.redirect(prevPage)
  } else {
    ctx.redirect(ctx.state.__HOST__ + '/admin/nav')
  }
})

router.get('/delete', async ctx => {
  ctx.body = '增加用户'
})

module.exports = router.routes()
