import test from 'ava'
import clone from 'clone'
import crawl from '../index'
import tree from './helpers/tree'

test.beforeEach(t => {
  t.context.tree = clone(tree)
})

test('provide current node path', t => {
  t.plan(4)

  crawl(t.context.tree, (node, context) => {
    if (6 === node.value) {
      t.true(Array.isArray(context.path))
      t.is(context.path.length, 2)
      t.is(context.path[0], t.context.tree)
      t.is(context.path[1], t.context.tree.children[1])
    }
  })
})

test('provide current node parent', t => {
  t.plan(1)

  crawl(t.context.tree, (node, context) => {
    if (6 === node.value) {
      t.is(context.parent, t.context.tree.children[1])
    }
  })
})

test('provide current node index', t => {
  const indices = []
  crawl(t.context.tree, (node, context) => indices.push(context.index))

  t.deepEqual(indices, [-1, 0, 0, 1, 1, 0])
})

test('provide up-to-date index when a node is removed', t => {
  const indices = []
  crawl(t.context.tree, (node, context) => {
    indices.push(context.index)
    if (2 === node.value) {
      t.context.tree.children.splice(0, 1)
      context.remove()
    }
  })

  t.deepEqual(indices, [-1, 0, 0, 0])
})

test('provide up-to-date index when a node is removed (post-order)', t => {
  const indices = []
  crawl(t.context.tree, (node, context) => {
    indices.push(context.index)
    if (2 === node.value) {
      t.context.tree.children.splice(0, 1)
      context.remove()
    }
  }, { order: 'post' })

  t.deepEqual(indices, [0, 1, 0, 0, 0, -1])
})

test('provide current node depth', t => {
  t.plan(6)

  crawl(t.context.tree, (node, context) => {
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

test('provide current node depth (post-order)', t => {
  t.plan(6)

  crawl(t.context.tree, (node, context) => {
    if (1 === node.value) {
      t.is(context.depth, 0)
    }
    else if (2 === node.value || 5 === node.value) {
      t.is(context.depth, 1)
    }
    else {
      t.is(context.depth, 2)
    }
  }, { order: 'post' })
})

test('provide current node level', t => {
  t.plan(6)

  crawl(t.context.tree, (node, context) => {
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

test('provide current node level (post-order)', t => {
  t.plan(6)

  crawl(t.context.tree, (node, context) => {
    if (1 === node.value) {
      t.is(context.level, 1)
    }
    else if (2 === node.value || 5 === node.value) {
      t.is(context.level, 2)
    }
    else {
      t.is(context.level, 3)
    }
  }, { order: 'post' })
})

test('break walk', t => {
  const values = []
  crawl(t.context.tree, (node, context) => {
    values.push(node.value)
    if (2 === node.value) {
      context.break()
    }
  })

  t.deepEqual(values, [1, 2])
})

test('break walk (post-order)', t => {
  const values = []
  crawl(t.context.tree, (node, context) => {
    values.push(node.value)
    if (2 === node.value) {
      context.break()
    }
  }, { order: 'post' })

  t.deepEqual(values, [3, 4, 2])
})

test('skip current node children', t => {
  const values = []
  crawl(t.context.tree, (node, context) => {
    values.push(node.value)
    if (2 === node.value) {
      context.skip()
    }
  })

  t.deepEqual(values, [1, 2, 5, 6])
})

test('ignore skipping current node children (post-order)', t => {
  const values = []
  crawl(t.context.tree, (node, context) => {
    values.push(node.value)
    if (2 === node.value) {
      context.skip()
    }
  }, { order: 'post' })

  t.deepEqual(values, [3, 4, 2, 6, 5, 1])
})

test('remove current node', t => {
  const values = []
  crawl(t.context.tree, (node, context) => {
    values.push(node.value)
    if (2 === node.value) {
      t.context.tree.children.splice(0, 1)
      context.remove()
    }
  })

  t.deepEqual(values, [1, 2, 5, 6])
})

test('remove current node (post-order)', t => {
  const values = []
  crawl(t.context.tree, (node, context) => {
    values.push(node.value)
    if (2 === node.value) {
      t.context.tree.children.splice(context.index, 1)
      context.remove()
    }
  }, { order: 'post' })

  t.deepEqual(values, [3, 4, 2, 6, 5, 1])
})

test('remove current node after hoisting (post-order)', t => {
  const values = []
  crawl(t.context.tree, (node, context) => {
    values.push(node.value)
    if (2 === node.value) {
      for (let i = node.children.length - 1; i >= 0; i--) {
        const child = node.children[i]
        t.context.tree.children.splice(context.index + 1, 0, child)
      }
      t.context.tree.children.splice(context.index, 1)
      context.remove()
    }
  }, { order: 'post' })

  t.deepEqual(values, [3, 4, 2, 3, 4, 6, 5, 1])
})

test('replace current node', t => {
  const values = []
  const newNode = {
    value: 2,
    children: [
      { value: 1337 }
    ]
  }
  crawl(t.context.tree, (node, context) => {
    values.push(node.value)
    if (2 === node.value) {
      context.replace(newNode)
    }
  })

  t.deepEqual(values, [1, 2, 1337, 5, 6])
})

test('replace current node and do not visit its children (post-order)', t => {
  const values = []
  const newNode = {
    value: 2,
    children: [
      { value: 42 },
      { value: 1337 }
    ]
  }
  crawl(t.context.tree, (node, context) => {
    values.push(node.value)
    if (2 === node.value) {
      t.context.tree.children.splice(context.index, 1)
      t.context.tree.children.unshift(newNode)
      context.replace(newNode)
    }
  }, { order: 'post' })

  t.deepEqual(values, [3, 4, 2, 6, 5, 1])
  t.is(t.context.tree.children[0], newNode)
})
