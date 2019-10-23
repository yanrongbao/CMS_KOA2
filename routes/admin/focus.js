const router = require('koa-router')()

const DB = require('../../module/DB')

const tools = require('../../module/toolist')

router.get('/', async ctx => {
  let pageSize = 3
  let page = ctx.query.page || 1
  let result = await DB.find('focus', {}, {}, { page, pageSize })
  let count = await DB.count('focus', {})

  await ctx.render('admin/focus/list', {
    list: result,
    page: page,
    totalPages: Math.ceil(count / pageSize)
  })
})

router.get('/add', async ctx => {
  await ctx.render('admin/focus/add')
})

router.post('/doAdd', tools.multer().single('pic'), async ctx => {
  let { title, url, sort, status } = ctx.req.body
  let pic = ctx.req.file ? ctx.req.file.path.substr(7) : ''
  let add_time = tools.getTime()
  await DB.insert('focus', {
    title,
    pic,
    url,
    sort,
    status,
    add_time
  })
  ctx.redirect(ctx.state.__HOST__ + '/admin/focus')
})

router.get('/edit', async ctx => {
  let { id } = ctx.query

  let result = await DB.find('focus', { _id: DB.getObjectID(id) })

  ctx.render('admin/focus/edit', {
    list: result[0],
    prevPage: ctx.state.G.prevPage
  })
})

router.post('/doEdit', tools.multer().single('pic'), async ctx => {
  let { id, title, url, sort, status, prevPage } = ctx.req.body
  let pic = ctx.req.file ? ctx.req.file.path.substr(7) : ''
  let add_time = tools.getTime()
  if (pic) {
    var json = { title, url, sort, status, prevPage, pic }
  } else {
    var json = { title, url, sort, status, prevPage }
  }

  await DB.update('focus', { _id: DB.getObjectID(id) }, json)
  //跳转
  if (prevPage) {
    ctx.redirect(prevPage)
  } else {
    ctx.redirect(ctx.state.__HOST__ + '/admin/focus')
  }
})

router.get('/delete', async ctx => {
  ctx.body = '增加用户'
})

module.exports = router.routes()
