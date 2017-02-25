# tree-crawl

> n-ary tree traversal library.

[![travis][travis-image]][travis-url] [![codecov][codecov-image]][codecov-url]

[travis-image]: https://img.shields.io/travis/ngryman/tree-crawl.svg?style=flat
[travis-url]: https://travis-ci.org/ngryman/tree-crawl
[codecov-image]: https://img.shields.io/codecov/c/github/ngryman/tree-crawl.svg
[codecov-url]: https://codecov.io/github/ngryman/tree-crawl


**tree-crawl** is a super fast, lightweight tree traversal library.

* **Faaaaast**: It takes advantage of multiple optimizations.
* **Multiple orders**: It supports the 3 big ways of traversing a tree:
  * Depth first pre-order
  * Depth first post-order
  * Breadth first
* **Flexible**: You can basically manipulate any sort of tree, it's totally agnostic.
* **Mutation friendly**: It does not 💥 when you mutate the tree and allows to:
  * Break the walk
  * Remove a node
  * Skip a node
  * Replace a node

## Install

```bash
npm install --save tree-crawl
```

## Usage

```javascript
import crawl from 'tree-crawl'

// traverse the tree in pre-order
crawl(tree, console.log)
crawl(tree, console.log, { order: 'pre' })

// traverse the tree in post-order
crawl(tree, console.log, { order: 'post' })

// traverse the tree using `childNodes` as the children key
crawl(tree, console.log, { childrenKey: 'childNodes' }

// skip a node and its children
crawl(tree, (node, context) => {
  if ('foo' === node.type) {
    context.skip()
  }
})

// break the walk
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

See the [api](docs/api.md) documentation.

## Related

 - [tree-mutate](https://github.com/ngryman/tree-mutate) n-ary tree mutation library.
 - [tree-morph](https://github.com/ngryman/tree-morph) n-ary tree morphing library.

## License

MIT © [Nicolas Gryman](http://ngryman.sh)
