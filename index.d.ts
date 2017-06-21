// Because this module exports a function `crawl` we have to define used types
// in a namespace with the same name.
// Found this workaround in DefinitelyTyped/DefinitelyTyped#12869.

declare namespace crawl {
  /**
   * Walk options.
   */
  export type Options<TreeNode> = {
    /**
     * Return node's children.
     *
     * By default, node's `children` property is used.
     */
    getChildren?(node: TreeNode): TreeNode[],
    /**
     * Order of the walk: either in DFS pre or post order, or BFS.
     */
    order?: 'pre' | 'post' | 'bfs'
  }

  /**
   * A traversal context.
   *
   * Four operations are available. Note that depending on the traversal order, some operations have no effects.
   */
  export type Context<TreeNode> = {
    /**
     * Skip current node, children won't be visited.
     */
    skip(): void,
    /**
     * Stop traversal now.
     */
    break(): void,
    /**
     * Notifies that the current node has been removed, children won't be visited.
     *
     * Because `tree-crawl` has no idea about the intrinsic structure of your tree, you have to remove the node yourself.
     * `Context#remove` only notifies the traversal code that the structure of the tree has changed.
     */
    remove(): void,
    /**
     * Notifies that the current node has been replaced, the new node's children will be visited instead.
     *
     * Because `tree-crawl` has no idea about the intrinsic structure of your tree, you have to replace the node yourself.
     * `Context#replace` notifies the traversal code that the structure of the tree has changed.
     *
     * @param node Replacement node.
     */
    replace(node: TreeNode): void,
    /**
     * Get the parent of the current node. `null` for the root node.
     */
    parent: TreeNode | null,
    /**
     * Get the depth of the current node. The depth is the number of ancestors the current node has.
     */
    depth: number,
    /**
     * Get the level of current node. The level is the number of ancestors+1 the current node has.
     */
    level: number,
    /**
     * Get the index of the current node.
     */
    index: number
  }
}

/**
 * Walk a tree recursively.
 *
 * @param root Root node of the tree to be walked.
 * @param iteratee Function invoked on each node.
 * @param options Options customizing the walk. By default `getChildren` will return the `children` property of a node.
 */
declare function crawl<TreeNode>(
  root: TreeNode,
  iteratee: (node: TreeNode, context: crawl.Context<TreeNode>) => void,
  options: crawl.Options<TreeNode>
): void

export = crawl
