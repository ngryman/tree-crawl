'use strict';

/**
 * Enum of context flags.
 *
 * @private
 * @enum
 */
const FLAGS = {
  siblings: 0x0001,
  children: 0x0010,
  remove: 0x0100,
  replace: 0x1000,
  walk: 0x0011,
  break: 0x0000
}

/**
 * Hold data and state during a walk. A context reference is passed each time
 * the `iteratee` function is invoked.
 *
 * The user can then interact with it in order to control how to walk the tree
 * by setting/unsetting flags to it. Those flags will alter the walking process
 * by bypassing some parts of the tree or adjusting the algorithm in reaction of
 * some tree mutations (i.e removing a node).
 *
 * He also can use it to hold his own persistent data between each invocation.
 */
class Context {
  /**
   * Create a context.
   */
  constructor() {
    this._path = []
    this._index = -1
    this.walk()
  }

  /**
   * Walk normally. It's the default flag.
   */
  walk() {
    this._flags = FLAGS.walk
  }

  /**
   * Break the walk, any further nodes won't be visited.
   */
  break() {
    this._flags = FLAGS.break
  }

  /**
   * Skip current node, any children won't be visited.
   */
  skip() {
    this._flags = FLAGS.siblings
  }

  /**
   * Remove current node, any children won't be visited and walk will visit
   * the next siblings correctly.
   */
  remove() {
    this._flags = FLAGS.siblings | FLAGS.remove
  }

  /**
   * Replace current node with given one, walk will only visit the new node
   * children.
   *
   * @param {Object} node Replacement node.
   */
  replace(node) {
    this._replace = node
    this._flags = FLAGS.walk | FLAGS.replace
  }

  /**
   * Set a flag, keeping other flags already set.
   *
   * @private
   * @param {FLAGS} flag Flag to set.
   */
  set(flag) {
    this._flags |= FLAGS[flag]
  }

  /**
   * Unset a flag, keeping other flags already set.
   *
   * @private
   * @param {FLAGS} flag Flag to unset.
   */
  unset(flag) {
    this._flags &= ~FLAGS[flag]
  }

  /**
   * Check if context has the given flag set.
   *
   * @private
   * @param {FLAGS} flag Flag to check.
   * @return {boolean} `true` if it has the flag, otherwize `false`.
   */
  has(flag) {
    return (0 !== (this._flags & FLAGS[flag]))
  }

  /**
   * Check if context only has the given flag set.
   *
   * @private
   * @param {FLAGS} flag Flag to check.
   * @return {boolean} `true` if it is the only flag set, otherwize `false`.
   */
  is(flag) {
    return (this._flags === FLAGS[flag])
  }

  /**
   * Get the **path** of the current node. The path is an array of nodes to
   * traverse from the root included to the current node.
   *
   * @return {Array} Array of nodes.
   */
  get path() {
    return this._path
  }

  /**
   * Get the parent of the current node.
   *
   * @return {Object} Parent of the current node.
   */
  get parent() {
    return this._path[this._path.length - 1]
  }

  /**
   * Get the index of the current node.
   *
   * @return {number} Index of the current node.
   */
  get index() {
    return this._index
  }

  /**
   * Get the **depth** of the current node. The depth is the number of
   * ancestors the current node has.
   *
   * @return {number} Depth of current node.
   */
  get depth() {
    return this._path.length
  }

  /**
   * Get the **level** of current node. The level is the number of ancestors+1
   * the current node has.
   *
   * @return {number} Level of current node.
   */
  get level() {
    return (this._path.length + 1)
  }
}

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

  // early return if no children
  if (null == children || 0 === children.length) return

  // add parent node to the context path
  context.path.push(node)

  for (let i = 0; i < children.length; i++) {
    const child = children[i]
    context._index = i
    walker(child, iteratee, options, context)

    // break if context flags do not allow to continue
    if (!context.has('siblings')) break

    // a node was removed, decrement the index so we don't miss the next node
    if (context.has('remove')) {
      i--
      context.unset('remove')
    }
  }

  // set back `siblings` flag, if not breaking
  if (!context.is('break')) {
    context.set('siblings')
  }

  // remove parent node from the context path
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

  // replace node if context flags say it
  if (context.has('replace')) {
    node = context._replace
    context.unset('replace')
  }

  // iterate over children if context flags allow it
  if (context.has('children')) {
    eachChild(node, iteratee, options, context, walkPreorder)
  }
  // set back `children`, if not breaking
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
  // special case here, we ignore `skip` as it does not make sense in a
  // post-order walk to ignore children
  if (context.is('siblings')) {
    context.set('siblings')
  }

  // save current index
  const index = context.index

  // iterate over children
  eachChild(node, iteratee, options, context, walkPostorder)

  // if not breaking, set back `children`
  if (!context.is('break')) {
    context.set('children')
    context._index = index
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

  // merge options with defaults
  options = Object.assign({
    childrenKey: 'children',
    order: 'pre'
  }, options)

  // create a context for this walk
  const context = new Context()

  // walk in `pre`/`post` order
  if ('pre' === options.order) {
    walkPreorder(root, iteratee, options, context)
  }
  else {
    walkPostorder(root, iteratee, options, context)
  }
}

module.exports = crawl;