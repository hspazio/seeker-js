const db = require('monk')('localhost/seeker')

module.exports = {
  connection: db,
  jobs: db.get('jobs'),
  companies: db.get('companies')
}
