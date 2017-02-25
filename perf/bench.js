const Benchmark = require('benchmark')
const crawl = require('../dist/tree-crawl')
const tree = require('./helpers/tree')

const root = tree(2, 16)

const orders = ['pre', 'post', 'bfs']
const order = process.argv[2]

const filterOrder = o => !order || o === order

let nodesCount = 0
const iteratee = node => nodesCount++
const getChildren = node => node.c

const suite = Benchmark.Suite()

orders.filter(filterOrder).forEach(order => {
  suite.add(`${order}`, () => {
    crawl(root, iteratee, { order, getChildren })
  })
})

suite.on('cycle', function(event) {
  console.log(String(event.target))
}).on('complete', function() {
  console.log()
})
.run()
