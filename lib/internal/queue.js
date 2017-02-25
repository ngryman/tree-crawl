const THRESHOLD = 32768

function Queue(initial) {
  this.xs = [initial]
  this.top = 0
  this.maxLength = 0
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
    /* istanbul ignore next */
    if (this.top === THRESHOLD) {
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

export default function QueueFactory(initial) {
  return new Queue(initial)
}
