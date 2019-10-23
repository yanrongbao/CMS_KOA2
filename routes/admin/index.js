const router = require('koa-router')()

const DB = require('../../module/DB')

router.get('/', async ctx => {
  await ctx.render('admin/user/list')
})

router.get('/changeStatus', async ctx => {
  let { collectionName, attr, id } = ctx.query
  let data = await DB.find(collectionName, { _id: DB.getObjectID(id) })

  if (data.length > 0) {
    if (data[0][attr] == 1) {
      var json = {
        /*es6 属性名表达式*/
        [attr]: 0
      }
    } else {
      var json = {
        [attr]: 1
      }
    }

    let updateResult = await DB.update(
      collectionName,
      { _id: DB.getObjectID(id) },
      json
    )

    if (updateResult) {
      ctx.body = { message: '更新成功', success: true }
    } else {
      ctx.body = { message: '更新失败', success: false }
    }
  } else {
    ctx.body = { message: '更新失败,参数错误', success: false }
  }
})

router.get('/remove', async ctx => {
  let { collectionName, id } = ctx.query
  let data = await DB.remove(collectionName, { _id: DB.getObjectID(id) })
  ctx.redirect(ctx.state.G.prevPage)
  //返回到哪里
})

router.get('/changeSort', async ctx => {
  let { collectionName, id, value } = ctx.query

  let json = {
    sort: value
  }

  let updateResult = await DB.update(
    collectionName,
    { _id: DB.getObjectID(id) },
    json
  )

  if (updateResult) {
    if (updateResult) {
      ctx.body = { message: '更新成功', success: true }
    } else {
      ctx.body = { message: '更新失败', success: false }
    }
  }
})

module.exports = router.routes()
