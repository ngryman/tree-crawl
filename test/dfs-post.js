import test from 'ava'
import dfsPost from '../lib/dfs-post'

test.beforeEach(t => {
  t.context.traverse = (treeName, iteratee, getChildren = node => node.children) => {
    const root = t.context.root = fixtures(treeName)
    dfsPost(root, iteratee, getChildren)
  }
})

test('traverse a tree', t => {
  const values = []
  t.context.traverse('deep', node => values.push(node.value))
  t.deepEqual(values, [3, 4, 2, 6, 5, 1])
})

test('accept a custom getChildren function', t => {
  const values = []
  t.context.traverse('custom-children', node => values.push(node.value), node => node.childNodes)
  t.deepEqual(values, [2, 3, 1])
})

test('provide current node parent', t => {
  t.context.traverse('deep', (node, context) => {
    if (3 === node.value) {
      t.is(context.parent, t.context.root.children[0])
    }
    else if (6 === node.value) {
      t.is(context.parent, t.context.root.children[1])
    }
  })
})

test('provide current node index', t => {
  const indices = []
  t.context.traverse('deep', (node, context) => indices.push(context.index))
  t.deepEqual(indices, [0, 1, 0, 0, 1, -1])
})

test('provide current node depth', t => {
  t.context.traverse('deep', (node, context) => {
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
  t.context.traverse('deep', (node, context) => {
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

test('break walk', t => {
  const values = []
  t.context.traverse('deep', (node, context) => {
    values.push(node.value)
    if (2 === node.value) {
      context.break()
    }
  })
  t.deepEqual(values, [3, 4, 2])
})

test('ignore skipping current node', t => {
  const values = []
  t.context.traverse('deep', (node, context) => {
    values.push(node.value)
    if (2 === node.value) {
      context.skip()
    }
  })
  t.deepEqual(values, [3, 4, 2, 6, 5, 1])
})

test('ignore removing current node', t => {
  const values = []
  t.context.traverse('deep', (node, context) => {
    values.push(node.value)
    if (2 === node.value) {
      t.context.root.children.splice(0, 1)
      context.remove()
    }
  })
  t.deepEqual(values, [3, 4, 2, 6, 5, 1])
})

test('provide up-to-date index when a node is removed', t => {
  const indices = []
  t.context.traverse('deep', (node, context) => {
    indices.push(context.index)
    if (2 === node.value) {
      t.context.root.children.splice(0, 1)
      context.remove()
    }
  })
  t.deepEqual(indices, [0, 1, 0, 0, 0, -1])
})

test('ignore replacing current node', t => {
  const values = []
  const newNode = {
    value: 2,
    children: [
      { value: 1337, children: [] }
    ]
  }
  t.context.traverse('deep', (node, context) => {
    values.push(node.value)
    if (2 === node.value) {
      context.replace(newNode)
    }
  })
  t.deepEqual(values, [3, 4, 2, 6, 5, 1])
})
