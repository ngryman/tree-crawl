# tree-crawl

> n-ary tree traversal library.

[![travis][travis-image]][travis-url] [![codecov][codecov-image]][codecov-url]

[travis-image]: https://img.shields.io/travis/ngryman/tree-crawl.svg?style=flat
[travis-url]: https://travis-ci.org/ngryman/tree-crawl
[codecov-image]: https://img.shields.io/codecov/c/github/ngryman/tree-crawl.svg
[codecov-url]: https://codecov.io/github/ngryman/tree-crawl


**tree-crawl** is a super fast, lightweight tree traversal library.

## Why?

* *Agnostic*: Supports any kind of tree.
* **Faaaaast**: It takes advantage of multiple optimizations.
* **Dependency free*: emptiness.
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

## Usage

### Installation

You can install `tree-crawl` with `yarn`:
```sh
$ yarn add tree-crawl
```

Alternatively using `npm`:
```sh
$ npm install --save tree-crawl
```

`tree-crawl` supports any kind of tree, the only thing it need is a way to access the children of a node. You can use default `getChildren` provided that basically return the `children` property of a node or define a custom one.

## Custom node children

The default `getChildren` is defined like so:
```js
const getChildren = (node) => node.children
```

If you want to provide your own and traverse a `dom` tree for example, you can do it like this:
```js
const getChildren = (node) => node.childNodes

crawl(document.body, doSomeStuff, { getChildren })
```

## Traversal context

### Skip

```js
crawl(root, (node, context) => {
  if ('foo' === node.type) {
    context.skip()
  }
})
```

### Break

```js
crawl(root, (node, context) => {
  if ('foo' === node.type) {
    context.break()
  }
})
```

### Remove

```js

Because `tree-crawl` has no idea about the intrinsic structure of your tree, you have to remove the node yourself. `Context#remove` notifies the traversal code that the structure of the tree has changed.

crawl(root, (node, context) => {
  if ('foo' === node.type) {
    context.parent.children.splice(context.index, 1)
    context.remove()
  }
})
```

### Replace

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

## Tree format

## Related

 - [arbre](https://github.com/arbrejs/arbre) n-ary tree library.
 - [tree-mutate](https://github.com/ngryman/tree-mutate) n-ary tree mutation library.
 - [tree-morph](https://github.com/ngryman/tree-morph) n-ary tree morphing library.

## License

MIT © [Nicolas Gryman](http://ngryman.sh)
