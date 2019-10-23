const Koa = require('koa')

const router = require('koa-router')()

const path = require('path')

const serve = require('koa-static') //配置静态资源

const render = require('koa-art-template') //加载模版引擎

const session = require('koa-session') //引入session

const bodyParser = require('koa-bodyparser')

const url = require('url')

const sd = require('silly-datetime')

const jsonp = require('koa-jsonp')

//实例化
const app = new Koa()

//配置jsonp中间件

render(app, {
  root: path.join(__dirname, 'views'),
  extname: '.html',
  debug: process.env.NODE_ENV !== 'production',
  dateFormat: (dateFormat = function(value) {
    return sd.format(value, 'YYYY-MM-DD HH:mm')
  })
})

app.keys = ['some secret hurr']

const CONFIG = {
  key: 'koa:sess',
  maxAge: 86400000,
  autoCommit: true /** (boolean) automatically commit headers (default true) */,
  overwrite: true /** (boolean) can overwrite or not (default true) */,
  httpOnly: true /** (boolean) httpOnly or not (default true) */,
  signed: true /** (boolean) signed or not (default true) */,
  rolling: true /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */,
  renew: false /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*/
}

app.use(session(CONFIG, app))

app.use(bodyParser()) //配置post中间件

app.use(serve(__dirname + '/public'))

// app.use(serve('.'))

//配置中间件  获取url地址
// router.use(async (ctx, next) => {
//   ctx.state.__HOST__ = 'http://' + ctx.request.header.host

//   let pathname = url.parse(ctx.request.url).pathname.substring(1)

//   let splitURL = pathname.split('/')

//   ctx.state.G = {
//     userinfo: ctx.session.userinfo,
//     url: splitURL,
//     prevPage: ctx.request.headers['referer']
//   }

//   //登录继续乡下匹配路由
//   if (ctx.session.userinfo) {
//     await next()
//   } else {
//     if (
//       pathname == 'admin/login' ||
//       pathname == 'admin/login/doLogin' ||
//       pathname == 'admin/login/code' ||
//       pathname == 'admin/login/logout'
//     ) {
//       await next()
//     } else {
//       ctx.redirect('admin/login')
//     }
//   }
// })

//引入模块
const index = require('./routes/index')

const admin = require('./routes/admin')

const api = require('./routes/api')

router.use('/admin', admin)

router.use('/api', api)

router.use(index)

app.use(router.routes()) //启动路由

app.use(router.allowedMethods())

app.listen(3000)
