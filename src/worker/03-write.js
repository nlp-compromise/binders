/* eslint-disable no-console */
import fs from 'fs'


const write = async function (obj, opts) {
  let file = opts.output || './out.txt'
  let out = JSON.stringify(obj)
  if (typeof obj === 'string') {
    out = obj
  }
  fs.writeFileSync(file, out + '\n', { flag: 'a' })
}
export default write