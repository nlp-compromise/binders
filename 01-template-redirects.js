import dumpster from './src/index.js'

let opts = {
  input: '/Volumes/4TB/texts/web-text/wikipedia/enwiki-latest-pages-articles.xml',
  namespace: 10, //template
  redirects: true,
  disambiguation: true,
  doPage: function (doc) {
    return doc.isRedirect()
  },
  parse: function (doc) {
    return { _id: doc.title(), redirect: doc.redirectTo() }
  }
}
dumpster(opts)
