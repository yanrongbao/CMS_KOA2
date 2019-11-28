const router = require('koa-router')()

const tools = require('../../module/toolist')

const DB = require('../../module/DB')

const svgCaptcha = require('svg-captcha')

router.get('/', async ctx => {
    await ctx.render('admin/login')
})

router.post('/doLogin', async ctx => {
    let { username, password, code } = ctx.request.body

    if (code.toLocaleLowerCase() == ctx.session.code.toLocaleLowerCase()) {
        //2.去数据库匹配
        let result = await DB.find('admin', {
            username: username,
            password: tools.md5(password)
        })
        if (result.length > 0) {
            //更新用户表 改变用户登录时间
            DB.update(
                'admin',
                { _id: DB.getObjectID(result[0]._id) },
                {
                    last_time: new Date()
                }
            )

            ctx.session.userinfo = result[0]
            ctx.redirect(ctx.state.__HOST__ + '/admin')
        } else {
            await ctx.render('admin/error', {
                message: '用户名或者密码错误',
                redirect: ctx.state.__HOST__ + '/admin/login'
            })
        }
    } else {
        await ctx.render('admin/error', {
            message: '验证码错误',
            redirect: ctx.state.__HOST__ + '/admin/login'
        })
    }
})

router.get('/logout', async ctx => {
    ctx.session.userinfo = null
    ctx.redirect(ctx.state.__HOST__ + '/admin/login')
})

//验证码
router.get('/code', async ctx => {
    let captcha = svgCaptcha.create({
        size: 4,
        fontSize: 50,
        width: 120,
        height: 34,
        background: '#cc9966'
    })
    ctx.body = captcha.data
    ctx.session.code = captcha.text
    ctx.response.type = 'image/svg+xml'
})

module.exports = router.routes()
