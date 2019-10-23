const md5 = require('md5')

const multer = require('koa-multer')

const tools = {
  md5(str) {
    return md5(str)
  },
  multer() {
    const storage = multer.diskStorage({
      destination: function(req, file, cb) {
        cb(
          null,
          'public/upload'
        ) /*配置图片上传的目录     注意：图片上传的目录必须存在*/
      },
      filename: function(req, file, cb) {
        /*图片上传完成重命名*/
        let fileFormat = file.originalname.split('.') /*获取后缀名  分割数组*/
        cb(null, Date.now() + '.' + fileFormat[fileFormat.length - 1])
      }
    })
    const upload = multer({ storage: storage })
    return upload
  },
  cateToList(data) {
    let filter = []
    for (let i = 0; i < data.length; i++) {
      if (data[i].pid == 0) {
        filter.push(data[i])
      }
    }
    for (let i = 0; i < filter.length; i++) {
      filter[i].list = []
      for (let j = 0; j < data.length; j++) {
        if (data[j].pid == filter[i]._id) {
          filter[i].list.push(data[j])
        }
      }
    }
    return filter
  },
  getTime() {
    return new Date()
  }
}
module.exports = tools
