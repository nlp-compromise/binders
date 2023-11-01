import dumpster from './src/index.js'

let opts = {
  input: '/Volumes/4TB/texts/web-text/wikipedia/enwiki-latest-pages-articles.xml',
  redirects: false,
  disambiguation: true,
  doPage: function (doc) {
    let res = doc.classify()
    return res.root === 'Person'
  },
  parse: function (doc) {
    return { _id: doc.title(), desc: doc.summary(), type: doc.classify().type }
  }
}
dumpster(opts)
