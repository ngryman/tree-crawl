import test from 'ava'
import dfsPre from '../lib/dfs-pre'

test.beforeEach(t => {
  t.context.traverse = (treeName, iteratee, getChildren = node => node.children) => {
    const root = t.context.root = fixtures(treeName)
    dfsPre(root, iteratee, getChildren)
  }
})

test('traverse a tree', t => {
  const values = []
  t.context.traverse('deep', node => values.push(node.value))
  t.deepEqual(values, [1, 2, 3, 4, 5, 6])
})

test('accept a custom getChildren function', t => {
  const values = []
  t.context.traverse('custom-children', node => values.push(node.value), node => node.childNodes)
  t.deepEqual(values, [1, 2, 3])
})

test.todo('traverse a tree without cursor')

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
  t.deepEqual(indices, [-1, 0, 0, 1, 1, 0])
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
  t.deepEqual(values, [1, 2])
})

test('skip current node children', t => {
  const values = []
  t.context.traverse('deep', (node, context) => {
    values.push(node.value)
    if (2 === node.value) {
      context.skip()
    }
  })
  t.deepEqual(values, [1, 2, 5, 6])
})

test('remove current node', t => {
  const values = []
  t.context.traverse('deep', (node, context) => {
    values.push(node.value)
    if (2 === node.value) {
      t.context.root.children.splice(0, 1)
      context.remove()
    }
  })
  t.deepEqual(values, [1, 2, 5, 6])
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
  t.deepEqual(indices, [-1, 0, 0, 0])
})

test('replace current node', t => {
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
  t.deepEqual(values, [1, 2, 1337, 5, 6])
})
