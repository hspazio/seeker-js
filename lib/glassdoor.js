const fetch = require('node-fetch')
const companyRepo = require('./db').companies

function query(job, callback) {
  const id = process.env.GLASSDOOR_ID
  const key = process.env.GLASSDOOR_KEY
  const host = 'http://api.glassdoor.com/api/api.htm'
  const ip = '192.168.43.42'
  const userAgent = 'Mozilla/%2F4.0'
  const company = job.company

  fetch(url())
    .then(res => res.json())
    .then(extractResult)
    .then(job => callback(null, job))
    .catch(err => callback(err))

  function extractResult(json) {
    if (json.success) {
      const company = findExactCompany(json)
      if (company) {
        job.company_stats = companyStats(company)
        companyRepo.update({ name: company.name, website: company.website }, company, {upsert: true})
      }
    } else {
      console.error(`Error received from ${url()}`)
    }
    return job
  }

  function url() {
    return encodeURI(`${host}?v=1&format=json&t.p=${id}&t.k=${key}&action=employers&q=${company}&userip=${ip}&useragent=${userAgent}`)
  }

  function findExactCompany(json) {
    return json.response.employers.find(emp => emp.exactMatch)
  }

  function companyStats(company) {
    return {
      name: company.name,
      website: company.website,
      reviews: company.numberOfRatings,
      rating: company.overallRating,
      recommendation: company.recommendToFriendRating
    }
  }
}

module.exports = query
