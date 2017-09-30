const parser = require('cheerio')

module.exports = {
  weworkremotely: (html) => {
    const jobs = []

    $ = parser.load(html)
    $('.jobs').find('li > a').each((i, job) => {
      jobs.push({
        company: $('.company', job).text().trim(),
        title: $('.title', job).text().trim(),
        link: $(job).prop('href').trim()
      })
    })

    return jobs
  },

  remoteok: (html) => {
    const jobs = []

    $ = parser.load(html)
    $('#jobsboard').find('.job').each((i, job) => {
      jobs.push({
        company: $(job).data('company').trim(),
        title: $(job).data('search').trim(),
        link: $(job).data('url').trim()
      })
    })

    return jobs
  },

  remoteco: (html) => {
    const jobs = []

    $ = parser.load(html)
    $('.job_listings').find('.job_listing').each((i, job) => {
      jobs.push({
        company: $('.company > strong', job).text().trim(),
        title: $('.position > h3', job).text().trim(),
        link: $('a', job).prop('href').trim()
      })
    })

    return jobs
  }
}
