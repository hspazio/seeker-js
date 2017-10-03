const fetch = require('node-fetch')
const async = require('async')
const glassdoor = require('./lib/glassdoor')
const parsers = require('./lib/parsers')
const db = require('./lib/db')
const jobsRepo = db.jobs

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

let sitesProcessed = 0

sites.forEach((site) => {
  fetch(site.url)
   .then(res => res.text())
   .then(site.parser)
   .then((jobs) => {
     jobs.forEach((job) => {
       jobsRepo.findOne({company: job.company, title: job.title, link: job.link})
         .then((job) => {
           if (job) {
             console.log('debug: job found', job)
           } else {
             jobs.date = new Date()
             jobsRepo.insert(job)
             console.log('new job saved. Sending email for', job)
             // send email async
           }
         })
     })
     async.map(jobs, glassdoor, (err, res) => {
       if (err) return console.error('error: ', err)
       console.log(`jobs from ${site.url} completed`)

       if (++sitesProcessed == sites.length) {
         console.log('closing connection')
         db.connection.close()
       }
     })
   })
})

