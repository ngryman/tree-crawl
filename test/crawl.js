import test from 'ava'
import clone from 'clone'
import crawl from '../index'
import tree from './helpers/tree'

test.beforeEach(t => {
  t.context.tree = clone(tree)
})

test('traverse a tree', t => {
  const values = []
  crawl(t.context.tree, node => values.push(node.value))

  t.deepEqual(values, [1, 2, 3, 4, 5, 6])
})

test('traverse a tree in pre-order', t => {
  const values = []
  crawl(t.context.tree, node => values.push(node.value), { order: 'pre' })

  t.deepEqual(values, [1, 2, 3, 4, 5, 6])
})

test('traverse a tree in post-order', t => {
  const values = []
  crawl(t.context.tree, node => values.push(node.value), { order: 'post' })

  t.deepEqual(values, [3, 4, 2, 6, 5, 1])
})

test('accept a custom children property', t => {
  const tree = {
    value: 1,
    childNodes: [
      { value: 2 }
    ]
  }

  const values = []
  crawl(tree, node => values.push(node.value), { childrenKey: 'childNodes' })

  t.deepEqual(values, [1, 2])
})

test('do not explode if root is nil', t => {
  t.notThrows(() => crawl())
})
