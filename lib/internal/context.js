/**
 * A traversal context.
 *
 * Four operations are available. Note that depending on the traversal order, some operations have
 * no effects.
 *
 * @param {Flags} flags
 * @param {Cursor} cursor
 */
function Context(flags, cursor) {
  this.flags = flags
  this.cursor = cursor
}

Context.prototype = {
  /**
   * Skip current node, children won't be visited.
   *
   * @example
   * crawl(root, (node, context) => {
   *   if ('foo' === node.type) {
   *     context.skip()
   *   }
   * })
   */
  skip() {
    this.flags.skip = true
  },

  /**
   * Stop traversal now.
   *
   * @example
   * crawl(root, (node, context) => {
   *   if ('foo' === node.type) {
   *     context.break()
   *   }
   * })
   */
  break() {
    this.flags.break = true
  },

  /**
   * Notifies that the current node has been removed, children won't be visited.
   *
   * Because `tree-crawl` has no idea about the intrinsic structure of your tree, you have to
   * remove the node yourself. `Context#remove` only notifies the traversal code that the structure
   * of the tree has changed.
   *
   * @example
   * crawl(root, (node, context) => {
   *   if ('foo' === node.type) {
   *     context.parent.children.splice(context.index, 1)
   *     context.remove()
   *   }
   * })
   */
  remove() {
    this.flags.remove = true
  },

  /**
   * Notifies that the current node has been replaced, the new node's children will be visited
   * instead.
   *
   * Because `tree-crawl` has no idea about the intrinsic structure of your tree, you have to
   * replace the node yourself. `Context#replace` notifies the traversal code that the structure of
   * the tree has changed.
   *
   * @param {Object} node Replacement node.
   *
   * @example
   * crawl(root, (node, context) => {
   *   if ('foo' === node.type) {
   *     const node = {
   *       type: 'new node',
   *       children: [
   *         { type: 'new leaf' }
   *       ]
   *     }
   *     context.parent.children[context.index] = node
   *     context.replace(node)
   *   }
   * })
   */
  replace(node) {
    this.flags.replace = node
  },

  /**
   * Get the parent of the current node.
   *
   * @return {Object} Parent node.
   */
  get parent() {
    return this.cursor.parent
  },

  /**
   * Get the **depth** of the current node. The depth is the number of ancestors the current node
   * has.
   *
   * @return {Number} Depth.
   */
  get depth() {
    return this.cursor.depth
  },

  /**
   * Get the **level** of current node. The level is the number of ancestors+1 the current node has.
   *
   * @return {Number} Level.
   */
  get level() {
    return (this.cursor.depth + 1)
  },

  /**
   * Get the index of the current node.
   *
   * @return {Number} Node's index.
   */
  get index() {
    return this.cursor.index
  }
}

export default function ContextFactory(flags, cursor) {
  return new Context(flags, cursor)
}
