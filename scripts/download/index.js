import pageviews from "./00-pageviews.js";
import download from "./01-download.js";
// import parse from "./02-parse.js";
// import cleanup from "./03-cleanup.js";

const parseWiki = async function (lang, dir) {
  // await pageviews(lang, dir)
  await download(lang, dir)
  // await parse(lang, dir)
  // cleanup(lang, dir)
}

export default parseWiki
parseWiki('en', '/Volumes/4TB/texts/web-text/wikipedia')