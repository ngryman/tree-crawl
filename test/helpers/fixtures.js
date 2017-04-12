import clone from 'clone'
import path from 'path'

global.fixtures = (name) => {
  return clone(require(path.resolve('test', 'fixtures', `${name}.json`)))
}
