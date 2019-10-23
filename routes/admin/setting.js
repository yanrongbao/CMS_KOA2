const router = require('koa-router')()

const DB = require('../../module/DB')

const tools = require('../../module/toolist')

router.get('/', async ctx => {
  let result = await DB.find('setting', {})
  await ctx.render('admin/setting/list', {
    list: result[0],
    prevPage: ctx.state.G.prevPage
  })
})

router.get('/add', async ctx => {
  await ctx.render('admin/nav/add')
})

router.post('/doEdit', tools.multer().single('site_logo'), async ctx => {
  let {
    id,
    site_title,
    site_keywords,
    site_description,
    prevPage,
    site_icp,
    site_qq,
    status
  } = ctx.req.body
  let site_logo = ctx.req.file ? ctx.req.file.path.substr(7) : ''
  console.log(site_logo)
  let add_time = tools.getTime()

  if (site_logo) {
    var json = {
      site_title,
      site_logo,
      site_keywords,
      site_description,
      prevPage,
      site_icp,
      site_qq,
      status,
      add_time
    }
  } else {
    var json = {
      site_title,
      site_keywords,
      site_description,
      prevPage,
      site_icp,
      site_qq,
      status,
      add_time
    }
  }
  await DB.update('setting', {}, json)
  //跳转
  ctx.redirect(ctx.state.__HOST__ + '/admin/setting')
})

router.get('/delete', async ctx => {
  ctx.body = '增加用户'
})

module.exports = router.routes()
