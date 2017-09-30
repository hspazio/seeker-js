const db = require('monk')('localhost/seeker')

module.exports = {
  jobs: db.get('jobs'),
  companies: db.get('companies')
}
