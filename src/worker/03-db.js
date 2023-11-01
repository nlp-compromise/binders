/* eslint-disable no-console */
import Nano from 'nano'
import 'dotenv/config'

let { COUCH_USER, COUCH_PASS, COUCH_URL, COUCH_DB } = process.env
let n = Nano(`http://${COUCH_USER}:${COUCH_PASS}@${COUCH_URL}`)
let db = n.db.use(COUCH_DB)


const writeDb = async function (obj) {
  console.log(obj._id)
  try {
    await db.insert(obj)
  } catch (e) {
    if (e.statusCode !== 409) {
      // console.log(obj._id, ' already exists')
      console.log(e.reason, obj)
    }
  }
}
export default writeDb