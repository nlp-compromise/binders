import dumpster from '../src/index.js'

let opts = {
  input: '/Volumes/4TB/wikipedia/enwiki-latest-pages-articles.xml',
  output: './results/people.tsv',
  redirects: false,
  disambiguation: true,
  doPage: function (doc) {
    let res = doc.classify()
    // console.log(res.type, doc.title().padEnd(20))
    return res.root === 'Person'
  },
  parse: function (doc) {
    return doc.title().replace(/\(.*?\)/, '').trim()
    // return { _id: doc.title(), desc: doc.summary(), type: doc.classify().type }
  }
}
dumpster(opts)
