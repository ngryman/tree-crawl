import dfsPre from './lib/dfs-pre'
import dfsPost from './lib/dfs-post'
import bfs from './lib/bfs'

const defaultGetChildren = (node) => node.children

/**
 * Walk options.
 *
 * @typedef {Object} Options
 * @property {string} [childrenKey=children] Name of the node property holding
 * an array of children.
 * @property {'pre'|'post'|'bfs'} [order=pre] Order of the walk either in dfs pre-order,
 * dfs post-order or bfs.
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
 * @param {Function} iteratee Function invoked on each node.
 * @param {Options} [options] Options customizing the walk.
 */
export default function crawl(root, iteratee, options) {
  if (null == root) return

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
