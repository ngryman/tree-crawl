## Classes

<dl>
<dt><a href="#Context">Context</a></dt>
<dd><p>Hold data and state during a walk. A context reference is passed each time
the <code>iteratee</code> function is invoked.</p>
<p>The user can then interact with it in order to control how to walk the tree
by setting/unsetting flags to it. Those flags will alter the walking process
by bypassing some parts of the tree or adjusting the algorithm in reaction of
some tree mutations (i.e removing a node).</p>
<p>He also can use it to hold his own persistent data between each invocation.</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#crawl">crawl(root, iteratee, [options])</a></dt>
<dd><p>Walk a tree recursively using either <strong>pre-order</strong> or <strong>post-order</strong>
specified in <code>options</code>.</p>
<p>The only requirement for the tree structure is that
it must have a special property holding an array of its children.
By default <code>children</code> is used, but it can be customized via the
<code>childrenKey</code> option.</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#Options">Options</a> : <code>Object</code></dt>
<dd><p>Walk options.</p>
</dd>
</dl>

<a name="Context"></a>

## Context
Hold data and state during a walk. A context reference is passed each time
the `iteratee` function is invoked.

The user can then interact with it in order to control how to walk the tree
by setting/unsetting flags to it. Those flags will alter the walking process
by bypassing some parts of the tree or adjusting the algorithm in reaction of
some tree mutations (i.e removing a node).

He also can use it to hold his own persistent data between each invocation.

**Kind**: global class  

* [Context](#Context)
    * [new Context()](#new_Context_new)
    * [.path](#Context+path) ⇒ <code>Array</code>
    * [.parent](#Context+parent) ⇒ <code>Object</code>
    * [.index](#Context+index) ⇒ <code>number</code>
    * [.depth](#Context+depth) ⇒ <code>number</code>
    * [.level](#Context+level) ⇒ <code>number</code>
    * [.walk()](#Context+walk)
    * [.break()](#Context+break)
    * [.skip()](#Context+skip)
    * [.remove()](#Context+remove)
    * [.replace(node)](#Context+replace)

<a name="new_Context_new"></a>

### new Context()
Create a context.

<a name="Context+path"></a>

### context.path ⇒ <code>Array</code>
Get the **path** of the current node. The path is an array of nodes to
traverse from the root included to the current node.

**Kind**: instance property of <code>[Context](#Context)</code>  
**Returns**: <code>Array</code> - Array of nodes.  
<a name="Context+parent"></a>

### context.parent ⇒ <code>Object</code>
Get the parent of the current node.

**Kind**: instance property of <code>[Context](#Context)</code>  
**Returns**: <code>Object</code> - Parent of the current node.  
<a name="Context+index"></a>

### context.index ⇒ <code>number</code>
Get the index of the current node.

**Kind**: instance property of <code>[Context](#Context)</code>  
**Returns**: <code>number</code> - Index of the current node.  
<a name="Context+depth"></a>

### context.depth ⇒ <code>number</code>
Get the **depth** of the current node. The depth is the number of
ancestors the current node has.

**Kind**: instance property of <code>[Context](#Context)</code>  
**Returns**: <code>number</code> - Depth of current node.  
<a name="Context+level"></a>

### context.level ⇒ <code>number</code>
Get the **level** of current node. The level is the number of ancestors+1
the current node has.

**Kind**: instance property of <code>[Context](#Context)</code>  
**Returns**: <code>number</code> - Level of current node.  
<a name="Context+walk"></a>

### context.walk()
Walk normally. It's the default flag.

**Kind**: instance method of <code>[Context](#Context)</code>  
<a name="Context+break"></a>

### context.break()
Break the walk, any further nodes won't be visited.

**Kind**: instance method of <code>[Context](#Context)</code>  
<a name="Context+skip"></a>

### context.skip()
Skip current node, any children won't be visited.

**Kind**: instance method of <code>[Context](#Context)</code>  
<a name="Context+remove"></a>

### context.remove()
Remove current node, any children won't be visited and walk will visit
the next siblings correctly.

**Kind**: instance method of <code>[Context](#Context)</code>  
<a name="Context+replace"></a>

### context.replace(node)
Replace current node with given one, walk will only visit the new node
children.

**Kind**: instance method of <code>[Context](#Context)</code>  

| Param | Type | Description |
| --- | --- | --- |
| node | <code>Object</code> | Replacement node. |

<a name="crawl"></a>

## crawl(root, iteratee, [options])
Walk a tree recursively using either **pre-order** or **post-order**
specified in `options`.

The only requirement for the tree structure is that
it must have a special property holding an array of its children.
By default `children` is used, but it can be customized via the
`childrenKey` option.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| root | <code>Object</code> | Root node of the tree to be walked. |
| iteratee | <code>function</code> | Function invoked per node. |
| [options] | <code>[Options](#Options)</code> | Options customizing the walk. |

<a name="Options"></a>

## Options : <code>Object</code>
Walk options.

**Kind**: global typedef  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| childrenKey | <code>string</code> | <code>&quot;children&quot;</code> | Name of the node property holding an array of children. |
| order | <code>&#x27;pre&#x27;</code> &#124; <code>&#x27;post&#x27;</code> | <code>pre</code> | Order of the walk either in pre-order or post-order. |

