const Config = require('./config')

const MongoClient = require('mongodb').MongoClient

const ObjectID = require('mongodb').ObjectID

class DB {
  static getInstance() {
    if (!DB.instance) {
      DB.instance = new DB()
    }
    return DB.instance
  }
  constructor() {
    this.dbClient = null
  }
  connect() {
    return new Promise((resolve, reject) => {
      if (!this.dbClient) {
        MongoClient.connect(
          Config.dbUri,
          { useNewUrlParser: true, useUnifiedTopology: true },
          (err, client) => {
            if (err) {
              reject(err)
            } else {
              this.dbClient = client.db(Config.dbName)
              resolve(this.dbClient)
            }
          }
        )
      } else {
        resolve(this.dbClient)
      }
    })
  }
  find(collectionName, json1, json2, json3) {
    let attr = {}
    let slipNum = 0
    let pageSize = 0
    let page = 1
    if (arguments.length === 2) {
      attr = {}
      slipNum = 0
      pageSize = 0
    } else if (arguments.length === 3) {
      attr = json2
      slipNum = 0
      pageSize = 0
    } else {
      attr = json2
      page = json3.page || 1
      pageSize = json3.pageSize || 20
      slipNum = (page - 1) * pageSize
      if (json3.sort) {
        var sort = json3.sort
      } else {
        var sort = {}
      }
    }
    return new Promise((resolve, reject) => {
      this.connect().then(db => {
        let result = db
          .collection(collectionName)
          .find(json1, attr)
          .skip(slipNum)
          .limit(pageSize)
          .sort(sort)
        result.toArray((err, docs) => {
          if (err) {
            reject(err)
          }
          resolve(docs)
        })
      })
    })
  }

  update(collectionName, json1, json2) {
    return new Promise((resolve, reject) => {
      this.connect().then(db => {
        db.collection(collectionName).updateOne(
          json1,
          {
            $set: json2
          },
          (err, result) => {
            if (err) {
              reject(err)
            } else {
            }
            resolve(result)
          }
        )
      })
    })
  }
  insert(collectionName, json) {
    return new Promise((resolve, reject) => {
      this.connect().then(db => {
        db.collection(collectionName).insertOne(json, (err, result) => {
          if (err) {
            reject(err)
          } else {
          }
          resolve(result)
        })
      })
    })
  }
  remove(collectionName, json) {
    return new Promise((resolve, reject) => {
      this.connect().then(db => {
        db.collection(collectionName).removeOne(json, (err, result) => {
          if (err) {
            reject(err)
          } else {
          }
          resolve(result)
        })
      })
    })
  }
  count(collectionName, json) {
    return new Promise((resolve, reject) => {
      this.connect().then(db => {
        let result = db.collection(collectionName).countDocuments(json)
        result.then(data => {
          resolve(data)
        })
      })
    })
  }

  getObjectID(id) {
    return new ObjectID(id)
  }
}

// const myDb = DB.getInstance()
// setTimeout(() => {
//   console.time('start')
//   myDb.find('user', {}).then(data => {
//     // console.log(data)
//     console.timeEnd('start')
//   })
// }, 100)

// setTimeout(() => {
//   console.time('start1')
//   myDb.find('user', {}).then(data => {
//     // console.log(data)
//     console.timeEnd('start1')
//   })
// }, 3000)

// const myDb2 = DB.getInstance()
// setTimeout(() => {
//   console.time('start2')
//   myDb2.find('user', {}).then(data => {
//     // console.log(data)
//     console.timeEnd('start2')
//   })
// }, 5000)

// setTimeout(() => {
//   console.time('start3')
//   myDb2.find('user', {}).then(data => {
//     // console.log(data)
//     console.timeEnd('start3')
//   })
// }, 7000)

module.exports = DB.getInstance()
