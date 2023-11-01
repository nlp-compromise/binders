import dumpster from '../src/index.js'

let opts = {
  input: '/Volumes/4TB/wikipedia/afwiki-latest-pages-articles.xml',
  output: './results/test.jsonl',
  redirects: false,
  disambiguation: true,
  doPage: function (doc) {
    return true//res.root === 'Person'
  },
  parse: function (doc) {
    console.log(doc.title())
    return { _id: doc.title() }
  }
}
dumpster(opts)
