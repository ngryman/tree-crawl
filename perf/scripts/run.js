#!/usr/bin/env node

const execSync = require('child_process').execSync
const path = require('path')

const type = process.argv[2]
const order = process.argv[3] || 'all'
const filename = path.join(__dirname, '..', type)

let command = 'node'
let output = ''

if ('profile' === type) {
  command = 'devtool'
}
else if ('trace' === type) {
  command = 'node-irhydra'
  output = '🔗  http://mrale.ph/irhydra/2'
}

execSync(`${command} ${filename} ${order}`, { stdio: 'inherit' })
console.log(`\n${output}\n`)
