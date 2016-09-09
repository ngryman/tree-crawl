# tree-crawl

> Agnostic tree traversal library.

[![travis][travis-image]][travis-url] [![codecov][codecov-image]][codecov-url]

[travis-image]: https://img.shields.io/travis/ngryman/tree-crawl.svg?style=flat
[travis-url]: https://travis-ci.org/ngryman/tree-crawl
[codecov-image]: https://img.shields.io/codecov/c/github/ngryman/tree-crawl.svg
[codecov-url]: https://codecov.io/github/ngryman/tree-crawl


**tree-crawl** is a lightweight tree crawler, well, technically walker. But the name was already taken you know...

It lets your easily walk any tree in **pre-order** or **post-order**. It supports in-place mutation of the tree including structural ones and does not 💥 when you move nodes around.

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
  console.log(node)
})

// break the walk
crawl(tree, (node, context) => {
  if ('foo' === node.type) {
    console.log(node)
    context.break()
  }
})

// remove a node
crawl(tree, (node, context) => {
  if ('foo' === node.type) {
    const parentChildren = node.parent.children
    parentChildren.splice(parentChildren.indexOf(node))
    context.remove()
  }
})
```

## API

See the [api](docs/api.md) documentation.

## Related

 - [tree-mutate](https://github.com/ngryman/tree-mutate) Agnostic tree mutation library. Uses this module.
 - [tree-morph](https://github.com/ngryman/tree-morph) Agnostic tree morphing library. Uses this module.

## License

MIT © [Nicolas Gryman](http://ngryman.sh)
