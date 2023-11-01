import dumpster from '../src/index.js'

let opts = {
  input: '/Volumes/4TB/wikipedia/frwiki-latest-pages-articles.xml',
  output: './results/people.jsonl',
  redirects: false,
  disambiguation: true,
  doPage: function (doc) {
    let res = doc.classify()
    console.log(res.type, doc.title().padEnd(20))
    return true//res.root === 'Person'
  },
  parse: function (doc) {
    return { _id: doc.title(), desc: doc.summary(), type: doc.classify().type }
  }
}
dumpster(opts)
