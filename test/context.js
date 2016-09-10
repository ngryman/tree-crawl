import test from 'ava'
import crawl from '../'
import tree from './helpers/tree'

test('provide current node path', t => {
  t.plan(4)

  crawl(tree, (node, context) => {
    if (6 === node.value) {
      t.true(Array.isArray(context.path))
      t.is(context.path.length, 2)
      t.is(context.path[0], tree)
      t.is(context.path[1], tree.children[1])
    }
  })
})

test('provide current node parent', t => {
  t.plan(1)

  crawl(tree, (node, context) => {
    if (6 === node.value) {
      t.is(context.parent, tree.children[1])
    }
  })
})

test('provide current node index', t => {
  const indices = []
  crawl(tree, (node, context) => indices.push(context.index))

  t.deepEqual(indices, [-1, 0, 0, 1, 1, 0])
})

test('provide up-to-date index when a node is removed', t => {
  const tree = {
    value: 1,
    children: [
      { value: 2 },
      { value: 3 }
    ]
  }

  const indices = []

  crawl(tree, (node, context) => {
    indices.push(context.index)
    if (2 === node.value) {
      tree.children.splice(0, 1)
      context.remove()
    }
  })

  t.deepEqual(indices, [-1, 0, 0])
})

test('provide current node depth', t => {
  t.plan(6)

  crawl(tree, (node, context) => {
    if (1 === node.value) {
      t.is(context.depth, 0)
    }
    else if (2 === node.value || 5 === node.value) {
      t.is(context.depth, 1)
    }
    else {
      t.is(context.depth, 2)
    }
  })
})

test('provide current node level', t => {
  t.plan(6)

  crawl(tree, (node, context) => {
    if (1 === node.value) {
      t.is(context.level, 1)
    }
    else if (2 === node.value || 5 === node.value) {
      t.is(context.level, 2)
    }
    else {
      t.is(context.level, 3)
    }
  })
})

test('break a pre-order walk', t => {
  const values = []

  crawl(tree, (node, context) => {
    values.push(node.value)
    if (2 === node.value) {
      context.break()
    }
  })

  t.deepEqual(values, [1, 2])
})

test('skip current node children in a pre-order walk', t => {
  const values = []

  crawl(tree, (node, context) => {
    values.push(node.value)
    if (2 === node.value) {
      context.skip()
    }
  })

  t.deepEqual(values, [1, 2, 5, 6])
})

test('remove current node in a pre-order walk', t => {
  const tree = {
    value: 1,
    children: [
      { value: 2 },
      { value: 3 }
    ]
  }

  const values = []

  crawl(tree, (node, context) => {
    values.push(node.value)
    if (2 === node.value) {
      tree.children.splice(0, 1)
      context.remove()
    }
  })

  t.deepEqual(values, [1, 2, 3])
})

test('remove also skip current node children in a pre-order walk', t => {
  const tree = {
    value: 1,
    children: [
      {
        value: 2,
        children: [
          { value: 3 }
        ]
      }
    ]
  }

  const values = []

  crawl(tree, (node, context) => {
    values.push(node.value)
    if (2 === node.value) {
      tree.children.splice(0, 1)
      context.remove()
    }
  })

  t.deepEqual(values, [1, 2])
})

test('break a post-order walk', t => {
  const values = []

  crawl(tree, (node, context) => {
    values.push(node.value)
    if (2 === node.value) {
      context.break()
    }
  }, { order: 'post' })

  t.deepEqual(values, [3, 4, 2])
})

test('ignore skipping current node children in a post-order walk', t => {
  const values = []

  crawl(tree, (node, context) => {
    values.push(node.value)
    if (2 === node.value) {
      context.skip()
    }
  }, { order: 'post' })

  t.deepEqual(values, [3, 4, 2, 6, 5, 1])
})

test('remove current node in a post-order walk', t => {
  const tree = {
    value: 1,
    children: [
      { value: 2 },
      { value: 3 }
    ]
  }

  const values = []

  crawl(tree, (node, context) => {
    values.push(node.value)
    if (2 === node.value) {
      tree.children.splice(0, 1)
      context.remove()
    }
  }, { order: 'post' })

  t.deepEqual(values, [2, 3, 1])
})
