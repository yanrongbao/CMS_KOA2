const router = require('koa-router')()

const DB = require('../../module/DB')

const tools = require('../../module/toolist')

router.get('/', async ctx => {
  let result = await DB.find('articlecate', {})
  await ctx.render('admin/articlecate/list', {
    list: tools.cateToList(result)
  })
})

router.get('/add', async ctx => {
  let result = await DB.find('articlecate', { pid: '0' })
  await ctx.render('admin/articlecate/add', { list: result })
})

router.post('/doAdd', async ctx => {
  let addData = ctx.request.body
  let data = await DB.insert('articlecate', addData)
  if (data.result.ok)
    await ctx.redirect(ctx.state.__HOST__ + '/admin/articlecate')
})

router.get('/edit', async ctx => {
  let { id } = ctx.query
  let result = await DB.find('articlecate', { _id: DB.getObjectID(id) })
  let catelist = await DB.find('articlecate', { pid: '0' })
  ctx.render('admin/articlecate/edit', {
    list: result[0],
    catelist: catelist
  })
})

router.post('/doEdit', async ctx => {
  let { id, title, pid, keywords, status, description } = ctx.request.body
  let data = await DB.update(
    'articlecate',
    { _id: DB.getObjectID(id) },
    { title, pid, status, keywords, description }
  )
  console.log(data)
  if (data.result.ok)
    await ctx.redirect(ctx.state.__HOST__ + '/admin/articlecate')
})

router.get('/delete', async ctx => {
  ctx.body = '增加用户'
})

module.exports = router.routes()
