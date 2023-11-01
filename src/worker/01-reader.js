/* eslint-disable no-console */
import parseXml from './02-xml.js'
import write from './03-write.js'
import sundayDriver from 'sunday-driver'
import { decode } from 'html-entities'

const red = str => '\x1b[31m' + str + '\x1b[0m'

const readWiki = function (opts, parsePage) {
  const { index, workers, file } = opts
  const percent = 100 / workers;
  const start = percent * index;
  const end = start + percent;
  const driver = {
    file: file,
    start: `${start}%`,
    end: `${end}%`,
    splitter: '</page>',
    each: (xml, resume) => {
      let pageTitle = "Unknown page"
      try {
        const meta = parseXml(xml);
        pageTitle = meta.title
        meta.wiki = decode(meta.wiki);
        let res = parsePage(meta)
        if (!res) {
          resume()
          return
        }
        write(res, opts)
      } catch (e) {
        console.log(red(`Worker ${opts.index} couldn't process ${pageTitle}: got error ${e}`));
        resume();
      }
    }
  };
  const p = sundayDriver(driver);
  p.catch(err => {
    console.log(red('\n\n========== Worker error!  ====='));
    console.log('🚨       worker #' + opts.index + '           🚨');
    console.log(err);
    console.log('\n\n');
  });
  return p;
}
export default readWiki
