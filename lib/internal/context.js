/**
 * A traversal context.
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
   */
  skip() {
    this.flags.skip = true
  },

  /**
   * Stop traversal now.
   */
  break() {
    this.flags.break = true
  },

  /**
   * Notifies that the current node has been removed, children won't be visited.
   */
  remove() {
    this.flags.remove = true
  },

  /**
   * Notifies that the current node has been replaced, the new node's children will be visited
   * instead.
   *
   * @param {Object} node Replacement node.
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
