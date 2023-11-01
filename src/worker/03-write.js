/* eslint-disable no-console */
import fs from 'fs'


const write = async function (obj, opts) {
  let file = opts.output || './out.txt'
  fs.writeFileSync(file, JSON.stringify(obj) + '\n', { flag: 'a' })
}
export default write