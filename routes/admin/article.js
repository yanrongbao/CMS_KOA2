const router = require('koa-router')()

const DB = require('../../module/DB')

const tools = require('../../module/toolist')

router.get('/', async ctx => {
  let { page } = ctx.query
  let pageSize = 20
  let count = await DB.count('article', {})
  let result = await DB.find(
    'article',
    {},
    {},
    { page: page, pageSize: pageSize, sort: { add_time: -1 } }
  )
  ctx.render('admin/article/list', {
    list: result,
    page: page || 1,
    totalPages: Math.ceil(count / pageSize)
  })
})

router.get('/add', async ctx => {
  let cateList = await DB.find('articlecate', {})
  await ctx.render('admin/article/add', {
    cateList: tools.cateToList(cateList)
  })
})

//post接收数据
router.post('/doAdd', tools.multer().single('img_url'), async ctx => {
  let pid = ctx.req.body.pid
  let catename = ctx.req.body.catename.trim()
  let title = ctx.req.body.title.trim()
  let author = ctx.req.body.author.trim()
  let pic = ctx.req.body.author
  let status = ctx.req.body.status
  let is_best = ctx.req.body.is_best
  let is_hot = ctx.req.body.is_hot
  let is_new = ctx.req.body.is_new
  let keywords = ctx.req.body.keywords
  let description = ctx.req.body.description || ''
  let content = ctx.req.body.content || ''
  let img_url = ctx.req.file ? ctx.req.file.path.substr(7) : ''
  let add_time = tools.getTime()
  let json = {
    pid,
    catename,
    title,
    author,
    status,
    is_best,
    is_hot,
    is_new,
    keywords,
    description,
    content,
    img_url,
    add_time
  }

  let result = DB.insert('article', json)

  //跳转
  ctx.redirect(ctx.state.__HOST__ + '/admin/article')
})

router.get('/edit', async ctx => {
  //查询分类数据
  let id = ctx.query.id
  //分类
  let cateList = await DB.find('articlecate', {})
  //当前要编辑的数据
  let articlelist = await DB.find('article', { _id: DB.getObjectID(id) })
  //   console.log(tools.cateToList(catelist))
  await ctx.render('admin/article/edit', {
    cateList: tools.cateToList(cateList),
    list: articlelist[0],
    prevPage: ctx.state.G.prevPage /*保存上一页的值*/
  })
})
//post接收数据
router.post('/doEdit', tools.multer().single('img_url'), async ctx => {
  let id = ctx.req.body.id
  let prevPage = ctx.req.body.prevPage || '' /*上一页的地址*/
  let pid = ctx.req.body.pid
  let catename = ctx.req.body.catename.trim()
  let title = ctx.req.body.title.trim()
  let author = ctx.req.body.author.trim()
  let pic = ctx.req.body.author
  let status = ctx.req.body.status
  let is_best = ctx.req.body.is_best
  let is_hot = ctx.req.body.is_hot
  let is_new = ctx.req.body.is_new
  let keywords = ctx.req.body.keywords
  let description = ctx.req.body.description || ''
  let content = ctx.req.body.content || ''
  let img_url = ctx.req.file ? ctx.req.file.path.substr(7) : ''
  let add_time = tools.getTime()
  var json = {
    pid,
    catename,
    title,
    author,
    status,
    is_best,
    is_hot,
    is_new,
    keywords,
    description,
    content,
    img_url,
    add_time
  }
  //属性的简写
  //注意是否修改了图片
  if (img_url) {
    var json = {
      pid,
      catename,
      title,
      author,
      status,
      is_best,
      is_hot,
      is_new,
      keywords,
      description,
      content,
      img_url
    }
  } else {
    var json = {
      pid,
      catename,
      title,
      author,
      status,
      is_best,
      is_hot,
      is_new,
      keywords,
      description,
      content
    }
  }
  console.log(json)
  DB.update('article', { _id: DB.getObjectID(id) }, json)

  //跳转
  if (prevPage) {
    ctx.redirect(prevPage)
  } else {
    ctx.redirect(ctx.state.__HOST__ + '/admin/article')
  }
})

module.exports = router.routes()
