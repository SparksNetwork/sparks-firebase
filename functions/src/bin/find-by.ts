import { database } from '../environment'

function booleanFromString(value) {
  if (value === 'true') { return true }
  if (value === 'false') { return false }
  return value
}

const [coll, field, val] = [process.argv[2], process.argv[3], process.argv[4]]

database.child(coll).orderByChild(field).equalTo(booleanFromString(val))
  .once('value')
  .then(s => console.log(JSON.stringify(s.val(), null, 2)))
  .then(s => process.exit())

