const fetch = require('node-fetch')
const async = require('async')
const glassdoor = require('./lib/glassdoor')
const parsers = require('./lib/parsers')
const jobsRepo = require('./lib/db').jobs

const sites = [
  { 
    url: 'https://remoteok.io/remote-dev-jobs',
    parser: parsers.remoteok
  },
  {
    url: 'https://weworkremotely.com/categories/2-programming/jobs#intro',
    parser: parsers.weworkremotely
  },
  {
    url: 'https://remote.co/remote-jobs/developer',
    parser: parsers.remoteco
  }
]

sites.forEach((site) => {
  fetch(site.url)
   .then(res => res.text())
   .then(site.parser)
   .then((jobs) => {
     jobs.forEach((job) => {
       jobLookup = {company: job.company, title: job.title, link: job.link}
       job.date = new Date()
       jobsRepo.update(jobLookup, job, { upsert: true})
     })
     async.map(jobs, glassdoor, (err, res) => {
       if (err) return console.error('error: ', err)
       console.log(res)
     })
   })
})

