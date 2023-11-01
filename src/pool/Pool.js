/* eslint-disable no-console */
import path from 'path'
import fs from 'fs'
import EventEmitter from 'events'
import { Worker } from 'worker_threads'
import { fileURLToPath } from 'url'
import { JSONfn } from 'jsonfn'
const dir = path.dirname(fileURLToPath(import.meta.url))

const blue = str => '\x1b[34m' + str + '\x1b[0m'
const magenta = str => '\x1b[35m' + str + '\x1b[0m'
const grey = str => '\x1b[37m' + str + '\x1b[0m'
const yellow = str => '\x1b[33m' + str + '\x1b[0m'

class Pool extends EventEmitter {
  constructor(opts) {
    super(opts)
    this.opts = opts
    this.workers = []
    this.methods = JSONfn.stringify(opts)
    // start the logger
    this.heartbeat = setInterval(() => this.beat(), this.opts.heartbeat)
    this.status = [{}]
  }
  // kick off each worker, on a part of the file
  start() {
    let bytes = fs.statSync(this.opts.input)['size']
    const mb = Math.round(bytes / 1048576) + 'mb';
    console.log(`\n\nstarting ${blue(this.opts.workers)} workers on the ${yellow(mb)} file`)

    for (let i = 0; i < this.opts.workers; i += 1) {
      // Create each worker.
      let info = {
        workerData: {
          index: i,
          input: this.opts.input,
          outputDir: this.opts.outputDir,
          outputMode: this.opts.outputMode,
          namespace: this.opts.namespace,
          redirects: this.opts.redirects,
          disambiguation: this.opts.disambiguation,
          wtfPath: this.opts.wtfPath,
          workers: this.opts.workers,
          methods: this.methods,
        }
      }
      const file = path.join(dir, '../worker/index.js')
      const worker = new Worker(file, info)
      // receive status of each worker, when requested
      worker.on('message', (msg) => {
        this.status[msg.status.index] = msg.status
      })
      worker.on('error', (err) => console.error(err))
      worker.on('exit', (code) => {
        console.log('worker done', code)
      })
      this.workers.push(worker)
    }
    let header = this.workers.map((_, i) => ` #${i + 1}`.padStart('8')).join('   ')
    console.log('\n' + magenta(header))
  }
  stop() {
    console.log('cleaning up...')
    clearInterval(this.heartbeat)
    // this.workers.forEach(w => w.emit('exit'))
    // this.emit('exit');
    this.emit('end');
    this.removeAllListeners();
    setTimeout(() => {
      // todo: figure out how to exit naturally
      process.exit()
    }, 500)
  }
  // heartbeat status logger
  beat() {
    this.workers.forEach(w => w.postMessage('thump'))
    setTimeout(() => {
      let row = this.status.map(o => o.written !== undefined ? o.written.toLocaleString().padStart('8') : "???").join('   ')
      console.log(grey(row))
      let allDone = this.status.every(obj => obj.finished === true)
      if (allDone === true) {
        console.log(`Final worker states: ${JSON.stringify(this.status)}`);
        this.stop()
      }
    }, 500);
  }
}

export default Pool