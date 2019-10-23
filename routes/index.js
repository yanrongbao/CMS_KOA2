const router = require('koa-router')()

const DB = require('../module/DB')

//引入模块
var url = require('url')

router.use(async (ctx, next) => {
  let pathname = url.parse(ctx.request.url).pathname

  let navResult = await DB.find(
    'nav',
    { $or: [{ status: '1' }, { status: 1 }] },
    {},
    { sort: { sort: 1 } }
  )
  let setting = await DB.find('setting', {})
  ctx.state.nav = navResult
  ctx.state.pathname = pathname
  ctx.state.setting = setting[0]
  await next()
})

router.get('/', async ctx => {
  let focusResult = await DB.find(
    'focus',
    { $or: [{ status: '1' }, { status: 1 }] },
    {},
    { sort: { sort: 1 }, pageSize: 3 }
  )
  let links = await DB.find(
    'link',
    { $or: [{ status: '1' }, { status: 1 }] },
    {},
    { sort: { sort: 1 }, pageSize: 3 }
  )
  ctx.render('default/index', {
    nav: ctx.state.nav,
    focus: focusResult,
    links: links
  })
})

router.get('/news', async ctx => {
  let { pid } = ctx.query
  let articleList,
    articleNum,
    page = ctx.query.page || 1,
    pageSize = 3

  let subCateIds = []
  let newsList = await DB.find('articlecate', {
    pid: '5d71bee09ac6fb2ca0a2cf53'
  })
  ctx.state.setting.site_title = 'xxx新闻页面'
  ctx.state.setting.site_keywords = 'xxx新闻页面'
  ctx.state.setting.site_description = 'xxx新闻页面'
  if (pid) {
    articleList = await DB.find(
      'article',
      { pid: pid },
      {},
      {
        page,
        pageSize
      }
    )
    articleNum = await DB.count('article', { pid: pid })
  } else {
    for (let i = 0; i < newsList.length; i++) {
      subCateIds.push(newsList[i]._id.toString())
    }
    articleList = await DB.find(
      'article',
      { pid: { $in: subCateIds } },
      {},
      {
        page,
        pageSize
      }
    )
    articleNum = await DB.count('article', { pid: { $in: subCateIds } })
  }

  ctx.render('default/news', {
    newsList: newsList,
    articleList: articleList,
    pid: pid,
    page,
    totalPages: Math.ceil(articleNum / pageSize)
  })
})

router.get('/service', async ctx => {
  let serviceList = await DB.find('article', {
    pid: '5d71bf219ac6fb2ca0a2cf56'
  })

  ctx.render('default/service', { serviceList })
})

router.get('/about', async ctx => {
  ctx.render('default/about')
})

router.get('/case', async ctx => {
  let { pid } = ctx.query
  let articleList,
    articleNum,
    page = ctx.query.page || 1,
    pageSize = 3
  let subCateIds = []
  let caseList = await DB.find('articlecate', {
    pid: '5d71bea29ac6fb2ca0a2cf4e'
  })

  if (pid) {
    articleList = await DB.find(
      'article',
      { pid: pid },
      {},
      {
        page,
        pageSize
      }
    )
    articleNum = await DB.count('article', { pid: pid })
  } else {
    for (let i = 0; i < caseList.length; i++) {
      subCateIds.push(caseList[i]._id.toString())
    }
    articleList = await DB.find(
      'article',
      { pid: { $in: subCateIds } },
      {},
      {
        page,
        pageSize
      }
    )
    articleNum = await DB.count('article', { pid: { $in: subCateIds } })
  }

  ctx.render('default/case', {
    caseList: caseList,
    articleList: articleList,
    pid: pid,
    page,
    totalPages: Math.ceil(articleNum / pageSize)
  })
})

router.get('/connect', async ctx => {
  ctx.render('default/connect')
})

router.get('/content/:id', async ctx => {
  let { id } = ctx.params
  let content = await DB.find('article', { _id: DB.getObjectID(id) })
  let catResult = await DB.find('articlecate', {
    _id: DB.getObjectID(content[0].pid)
  })
  if (catResult[0].pid != '0') {
    let parentCateResult = await DB.find('nav', {
      title: catResult[0].title
    })
    var navResult = await DB.find('nav', {
      $or: [{ title: catResult[0].title }, { title: parentCateResult[0].title }]
    })
  } else {
    var navResult = await DB.find('nav', {
      title: catResult[0].title
    })
  }
  if (navResult.length > 0) {
    ctx.state.pathname = navResult[0].url
  } else {
    ctx.state.pathname = '/'
  }

  ctx.render('default/content', { list: content[0] })
})

module.exports = router.routes()
