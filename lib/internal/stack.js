function Stack(initial) {
  this.xs = [initial]
  this.top = 0
}

Stack.prototype = {
  push(x) {
    this.top++
    if (this.top < this.xs.length) {
      this.xs[this.top] = x
    }
    else {
      this.xs.push(x)
    }
  },

  pushArrayReverse(xs) {
    for (let i = xs.length - 1; i >= 0; i--) {
      this.push(xs[i])
    }
  },

  pop() {
    const x = this.peek()
    this.top--
    return x
  },

  peek() {
    return this.xs[this.top]
  },

  isEmpty() {
    return (-1 === this.top)
  }
}

export default function QueueFactory(initial) {
  return new Stack(initial)
}
