'use strict'

const Context = require('./lib/context')

/**
 * Iterate over children of a given node.
 *
 * @private
 * @param {Object} node Node to be iterated.
 * @param {Function} iteratee Function invoked per child.
 * @param {Object} options Options customizing the iteration.
 * @param {Context} context Context of the iteration.
 * @param {Function} walker Function called to walk recursively.
 */
function eachChild(node, iteratee, options, context, walker) {
  const children = node[options.childrenKey]

  // Early return if no children.
  if (null == children || 0 === children.length) return

  // Add parent node to the context path.
  context.path.push(node)

  for (let i = 0; i < children.length; i++) {
    const child = children[i]
    walker(child, iteratee, options, context)

    // Break if context flags do not allow to continue.
    if (!context.has('siblings')) break

    // A node was removed, decrement the index so we don't miss the next node.
    if (context.has('remove')) {
      i--
      context.unset('remove')
    }
  }

  // Set back `siblings` flag, if not breaking
  if (!context.is('break')) {
    context.set('siblings')
  }
  // Remove parent node from the context path.
  context.path.pop()
}

/**
 * Walk recursively in pre-order.
 *
 * @private
 * @param {Object} node Node to be walked.
 * @param {Function} iteratee Function invoked per node.
 * @param {Object} options Options customizing the walk.
 * @param {Context} context Context of the iteration.
 */
function walkPreorder(node, iteratee, options, context) {
  iteratee(node, context)

  // Iterate over children if context flags allow it.
  if (context.has('children')) {
    eachChild(node, iteratee, options, context, walkPreorder)
  }
  // Set back `children`, if not breaking.
  else if (!context.is('break')) {
    context.set('children')
  }
}

/**
 * Walk recursively in post-order.
 *
 * @private
 * @param {Object} node Node to be walked.
 * @param {Function} iteratee Function invoked per node.
 * @param {Object} options Options customizing the walk.
 * @param {Context} context Context of the iteration.
 */
function walkPostorder(node, iteratee, options, context) {
  // Special case here, we ignore `skip` as it does not make sense in a
  // post-order walk to ignore children.
  if (context.is('siblings')) {
    context.walk()
  }

  // Iterate over children.
  eachChild(node, iteratee, options, context, walkPostorder)

  // Set back `walk`, and visit the node if not breaking.
  // We are ignoring `skip` here too.
  if (!context.is('break')) {
    context.set('children')
    iteratee(node, context)
  }
}

/**
 * Walk options.
 *
 * @typedef {Object} Options
 * @property {string} [childrenKey=children] Name of the node property holding
 * an array of children.
 * @property {'pre'|'post'} [order=pre] Order of the walk either in pre-order
 * or post-order.
 */

/**
 * Walk a tree recursively using either **pre-order** or **post-order**
 * specified in `options`.
 *
 * The only requirement for the tree structure is that
 * it must have a special property holding an array of its children.
 * By default `children` is used, but it can be customized via the
 * `childrenKey` option.
 *
 * @param {Object} root Root node of the tree to be walked.
 * @param {Function} iteratee Function invoked per node.
 * @param {Options} [options] Options customizing the walk.
 */
function crawl(root, iteratee, options) {
  if (null == root) return

  // Merge options with defaults.
  options = Object.assign({
    childrenKey: 'children',
    order: 'pre'
  }, options)

  // Create a context for this walk.
  const context = new Context()

  // Walk in `pre`/`post` order.
  if ('pre' === options.order) {
    walkPreorder(root, iteratee, options, context)
  }
  else {
    walkPostorder(root, iteratee, options, context)
  }
}

module.exports = crawl
