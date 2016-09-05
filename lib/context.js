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
 * He also can use it to hold his own persistant data between each invocation.
 */
class Context {
  /**
   * Create a context.
   */
  constructor() {
    this._path = []
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
    this._flags = FLAGS.walk | FLAGS.remove
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

module.exports = Context
