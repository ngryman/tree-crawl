# tree-crawl [![travis][travis-image]][travis-url] [![codecov][codecov-image]][codecov-url]

> Agnostic tree traversal library.

[travis-image]: https://img.shields.io/travis/ngryman/tree-crawl.svg?style=flat

[travis-url]: https://travis-ci.org/ngryman/tree-crawl

[codecov-image]: https://img.shields.io/codecov/c/github/ngryman/tree-crawl.svg

[codecov-url]: https://codecov.io/github/ngryman/tree-crawl

-   **Agnostic**: Supports any kind of tree. You provide a way to access a node's children, that's it.
-   **Fast**: Crafted to be optimizer-friendly. See [optimization] for more details.
-   **Mutations friendly**: Does not 💥 when you mutate the tree.
-   **Multiple orders**: Supports DFS pre and post order and BFS traversals.

## Quickstart

### Installation

You can install `tree-crawl` with `yarn`:

```sh
$ yarn add tree-crawl
```

Alternatively using `npm`:

```sh
$ npm install --save tree-crawl
```

### Usage

```js
import crawl from 'tree-crawl'

// traverse the tree in pre-order
crawl(tree, console.log)
crawl(tree, console.log, { order: 'pre' })

// traverse the tree in post-order
crawl(tree, console.log, { order: 'post' })

// traverse the tree using `childNodes` as the children key
crawl(tree, console.log, { getChildren: node => node.childNodes })

// skip a node and its children
crawl(tree, (node, context) => {
  if ('foo' === node.type) {
    context.skip()
  }
})

// stop the walk
crawl(tree, (node, context) => {
  if ('foo' === node.type) {
    context.break()
  }
})

// remove a node
crawl(tree, (node, context) => {
  if ('foo' === node.type) {
    context.parent.children.splice(context.index, 1)
    context.remove()
  }
})

// replace a node
crawl(tree, (node, context) => {
  if ('foo' === node.type) {
    const node = {
      type: 'new node',
      children: [
        { type: 'new leaf' }
      ]
    }
    context.parent.children[context.index] = node
    context.replace(node)
  }
})
```

## API

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

### Options

Walk options.

Type: [Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

**Parameters**

-   `node`  

**Properties**

-   `getChildren` **[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)?** Return a node's children.
-   `order` **(`"pre"` \| `"post"` \| `"bfs"`)?** Order of the walk either in DFS pre or post order, or
    BFS.

**Examples**

_Traverse a DOM tree._

```javascript
crawl(document.body, doSomeStuff, { getChildren: node => node.childNodes })
```

_BFS traversal_

```javascript
crawl(root, doSomeStuff, { order: 'bfs' })
```

### Iteratee

-   **See: [Traversal context](https://github.com/ngryman/tree-crawl/tree/master#traversal-context).**

Called on each node of the tree.

Type: [Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)

**Parameters**

-   `node` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** Node being visited.
-   `context` **Context** Traversal context

### crawl

Walk a tree recursively.

By default `getChildren` will return the `children` property of a node.

**Parameters**

-   `root` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** Root node of the tree to be walked.
-   `iteratee` **[Iteratee](#iteratee)** Function invoked on each node.
-   `options` **[Options](#options)?** Options customizing the walk.

## Traversal context

In order to alter the traversal, a context object is passed as 2nd parameter. Four operations are available. Note that depending on the traversal order, some operations have no effects.

### Skip

The current node's children will not be visited.

```js
crawl(root, (node, context) => {
  if ('foo' === node.type) {
    context.skip()
  }
})
```

### Break

Stop the traversal now.

```js
crawl(root, (node, context) => {
  if ('foo' === node.type) {
    context.break()
  }
})
```

### Remove

Tell `tree-crawl` that the current node has been removed. Its children won't be visited.

Because `tree-crawl` has no idea about the intrinsic structure of your tree, you have to remove the node yourself. `Context#remove` only notifies the traversal code that the structure of the tree has changed.

```js
crawl(root, (node, context) => {
  if ('foo' === node.type) {
    context.parent.children.splice(context.index, 1)
    context.remove()
  }
})
```

### Replace

Tell `tree-crawl` that the current node has been replaced. The new node's children will be visited instead.

Because `tree-crawl` has no idea about the intrinsic structure of your tree, you have to replace the node yourself. `Context#replace` notifies the traversal code that the structure of the tree has changed.

```js
crawl(root, (node, context) => {
  if ('foo' === node.type) {
    const node = {
      type: 'new node',
      children: [
        { type: 'new leaf' }
      ]
    }
    context.parent.children[context.index] = node
    context.replace(node)
  }
})
```

## Related

-   [arbre](https://github.com/arbrejs/arbre) n-ary tree library.
-   [tree-mutate](https://github.com/ngryman/tree-mutate) n-ary tree mutation library.
-   [tree-morph](https://github.com/ngryman/tree-morph) n-ary tree morphing library.

## License

MIT © [Nicolas Gryman](http://ngryman.sh)
