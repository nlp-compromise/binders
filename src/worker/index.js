import { workerData, parentPort } from 'worker_threads'
import { JSONfn } from 'jsonfn'
import wtfLib from 'wtf_wikipedia'
import reader from './01-reader.js'
import classify from 'wtf-plugin-classify'
import summary from 'wtf-plugin-summary'
import i18n from 'wtf-plugin-i18n'
import disambig from 'wtf-plugin-disambig'

const magenta = (str) => '\x1b[35m' + str + '\x1b[0m'

// use default wtf library
let wtf = wtfLib
wtf.extend(classify)
wtf.extend(i18n)
wtf.extend(disambig)
wtf.extend(summary)

let { input, index, workers, namespace, redirects, disambiguation, output } = workerData
let methods = JSONfn.parse(workerData.methods)

let status = {
  written: 0
}
const eachPage = function (meta) {
  // only process pages in a given namespace
  if (meta.namespace !== namespace && namespace !== null) {
    return null
  }
  // parse the wikitext
  let doc = wtf(meta.wiki, meta)
  // skip redirect pages
  if (redirects === false && doc.isRedirect()) {
    return null
  }
  // skip disambiguation pages
  if (disambiguation === false && doc.isDisambig()) {
    return null
  }
  if (!methods.doPage(doc)) {
    return null
  }
  // actually process the page
  let res = methods.parse(doc)
  status.written += 1
  return res
}

setTimeout(() => {
  // start off the worker!
  reader({ index, workers, file: input, output }, eachPage).then(() => {
    console.log(magenta(`worker #${index} finished`))
  })
}, 2000)

// log the status of this worker, when asked
parentPort.on('message', () => parentPort.postMessage({ status }))
