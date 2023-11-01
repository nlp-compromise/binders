import dumpster from '../src/index.js'

let opts = {
  output: './results/template-redirects.jsonl',
  namespace: 10, //template
  redirects: true,
  disambiguation: true,
  doPage: function (doc) {
    return doc.isRedirect()
  },
  parse: function (doc) {
    return { _id: doc.title(), redirect: doc.redirectTo().page }
  }
}
dumpster(opts)
