const router = require('koa-router')()

const DB = require('../../module/DB')

const tools = require('../../module/toolist')

router.get('/', async ctx => {
  let result = await DB.find('admin', {})
  await ctx.render('admin/manager/list', { list: result })
})

router.get('/add', async ctx => {
  await ctx.render('admin/manager/add')
})

router.post('/doAdd', async ctx => {
  let { username, password, rpassword } = ctx.request.body

  if (!/^\w{4,20}/.test(username)) {
    ctx.render('admin/error', {
      message: '用户名不合法',
      redirect: ctx.state.__HOST__ + '/admin/manager/add'
    })
  } else if (password !== rpassword || password.length < 6) {
    ctx.render('admin/error', {
      message: '密码不合法',
      redirect: ctx.state.__HOST__ + '/admin/manager/add'
    })
  } else {
    let result = await DB.find('admin', { username })
    if (result.length > 0) {
      ctx.render('admin/error', {
        message: '管理员存在',
        redirect: ctx.state.__HOST__ + '/admin/manager/add'
      })
    } else {
      let addResult = await DB.insert('admin', {
        username: username,
        password: tools.md5(password),
        status: 1,
        last_time: ''
      })
      ctx.redirect(ctx.state.__HOST__ + '/admin/manager')
    }
  }
})

router.get('/edit', async ctx => {
  let { id } = ctx.query

  let result = await DB.find('admin', { _id: DB.getObjectID(id) })

  ctx.render('admin/manager/edit', { list: result })
})

router.post('/doEdit', async ctx => {
  let { username, password, rpassword, id } = ctx.request.body
  if (password != '') {
    if (password !== rpassword || password.length < 6) {
      ctx.render('admin/error', {
        message: '密码不合法',
        redirect: ctx.state.__HOST__ + '/admin/manager/edit?id' + id
      })
    } else {
      console.log(DB.getObjectID(id), tools.md5(password))
      let updateResult = await DB.update(
        'admin',
        { _id: DB.getObjectID(id) },
        { password: tools.md5(password) }
      )

      ctx.redirect(ctx.state.__HOST__ + '/admin/manager')
    }
  } else {
    ctx.redirect(ctx.state.__HOST__ + '/admin/manager')
  }
})

router.get('/delete', async ctx => {
  ctx.body = '增加用户'
})

module.exports = router.routes()
