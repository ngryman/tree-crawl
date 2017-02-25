const THRESHOLD = 65536

function Queue(initial) {
  this.xs = [initial]
  this.top = 0
}

Queue.prototype = {
  enqueue(x) {
    this.xs.push(x)
  },

  enqueueMultiple(xs) {
    for (let i = 0, len = xs.length; i < len; i++) {
      this.enqueue(xs[i])
    }
  },

  dequeue() {
    const x = this.peek()
    this.top++
    // if (0 === this.length) {
    //   this.top = 0
    // }
    if (this.top * 2 >= this.xs.length || this.top >= THRESHOLD) {
      this.xs = this.xs.slice(this.top)
      this.top = 0
    }
    return x
  },

  peek() {
    return this.xs[this.top]
  },

  isEmpty() {
    return (this.top === this.xs.length)
  }
}

module.exports = function QueueFactory(initial) {
  return new Queue(initial)
}
