function Flags() {
  // perf: explicit hidden class, do not call reset
  this.break = false
  this.skip = false
  this.remove = false
  this.replace = null
}

Flags.prototype = {
  reset() {
    this.break = false
    this.skip = false
    this.remove = false
    this.replace = null
  }
}

export default function FlagsFactory() {
  return new Flags()
}
