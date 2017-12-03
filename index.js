import dfsPre from './lib/dfs-pre'
import dfsPost from './lib/dfs-post'
import bfs from './lib/bfs'

/**
 * Walk options.
 *
 * @typedef {Object} Options
 * @property {Function} [getChildren] Return a node's children.
 * @property {'pre'|'post'|'bfs'} [order=pre] Order of the walk either in DFS pre or post order, or
 * BFS.
 *
 * @example <caption>Traverse a DOM tree.</caption>
 * crawl(document.body, doSomeStuff, { getChildren: node => node.childNodes })
 *
 * @example <caption>BFS traversal</caption>
 * crawl(root, doSomeStuff, { order: 'bfs' })
 */

/**
 * Called on each node of the tree.
 * @callback Iteratee
 * @param {Object} node Node being visited.
 * @param {Context} context Traversal context
 * @see [Traversal context](#traversal-context).
 */

const defaultGetChildren = (node) => node.children

/**
 * Walk a tree recursively.
 *
 * By default `getChildren` will return the `children` property of a node.
 *
 * @param {Object} root Root node of the tree to be walked.
 * @param {Iteratee} iteratee Function invoked on each node.
 * @param {Options} [options] Options customizing the walk.
 */
export default function crawl(root, iteratee, options) {
  if (null == root) return

  options = options || {}

  // default options
  const order = options.order || 'pre'
  const getChildren = options.getChildren || defaultGetChildren

  // walk the tree!
  if ('pre' === order) {
    dfsPre(root, iteratee, getChildren)
  }
  else if ('post' === order) {
    dfsPost(root, iteratee, getChildren)
  }
  else if ('bfs' === order) {
    bfs(root, iteratee, getChildren)
  }
}
