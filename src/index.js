import Pool from './pool/Pool.js'
import os from 'os'
const cpuCount = os.cpus().length

const doit = function (given) {
  let opts = {
    input: '/Volumes/4TB/texts/web-text/wikipedia/afwiki-latest-pages-articles.xml',
    // which wikipedia namespaces to handle (null will do all)
    namespace: 0, //(default article namespace)
    // whether to include pages that are redirects
    redirects: false,
    // whether to include disambiguiation pages
    disambiguation: false,
    // define how many concurrent workers to run
    workers: cpuCount, // default is cpu count
    //interval to log status
    heartbeat: 5000, //every 5 seconds
    // what do return, for every page
    parse: function (doc) {
      return { _id: doc.title(), textLen: doc.text().length, cats: doc.json().categories }
    }, // (default)
    // should we return anything for this page?
    doPage: function () {
      return true
    } // (default)
  }
  opts = Object.assign({}, opts, given)

  // ok guess we're gonna do this...
  let pool = new Pool(opts)
  pool.on('end', () => {
    console.log('done')
  })
  pool.on('error', (e) => {
    console.log('error', e)
  })
  pool.start()
}

export default doit
