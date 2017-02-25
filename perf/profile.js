const crawl = require('../dist/tree-crawl')
const tree = require('./helpers/tree')

const root = tree(2, 16)

const orders = ['pre', 'post', 'bfs']
const order = process.argv[2]

const filterOrder = o => !order || o === order

let nodesCount = 0
const iteratee = node => nodesCount++
const getChildren = node => node.c

orders.filter(filterOrder).forEach(order => {
  console.profile(order)
  for (let i = 0; i < 5; i++) {
    crawl(root, iteratee, { order, getChildren })
  }
  console.profileEnd(order)
})
