const { promisify } = require('util');
const GitHub = require('@octokit/rest');
const axios = require('axios');
const validator = require('validator');


/**
 * GET /api
 * List of API examples.
 */
exports.getApi = (req, res) => {
  res.render('api/index', {
    title: 'API Examples'
  });
};


/**
 * GET /api/scraping
 * Web scraping example using Cheerio library.
 */
exports.getScraping = (req, res, next) => {
  axios.get('https://news.ycombinator.com/')
    .then((response) => {
      const $ = cheerio.load(response.data);
      const links = [];
      $('.title a[href^="http"], a[href^="https"]').slice(1).each((index, element) => {
        links.push($(element));
      });
      res.render('api/scraping', {
        title: 'Web Scraping',
        links
      });
    })
    .catch((error) => next(error));
};

/**
 * GET /api/github
 * GitHub API Example.
 */
exports.getGithub = async (req, res, next) => {
  const github = new GitHub();
  try {
    res.send(github)
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/lob
 * Lob API example.
 */
exports.getLob = async (req, res, next) => {
  let recipientName;
  if (req.user) { recipientName = req.user.profile.name; } else { recipientName = 'John Doe'; }
  const addressTo = {
    name: recipientName,
    address_line1: '123 Main Street',
    address_city: 'New York',
    address_state: 'NY',
    address_zip: '94107'
  };
  const addressFrom = {
    name: 'Hackathon Starter',
    address_line1: '123 Test Street',
    address_line2: 'Unit 200',
    address_city: 'Chicago',
    address_state: 'IL',
    address_zip: '60012',
    address_country: 'US'
  };

  const lookupZip = () => lob.usZipLookups.lookup({ zip_code: '94107' })
    .then((zipdetails) => (zipdetails))
    .catch((error) => Promise.reject(new Error(`Could not get zip code details: ${error}`)));

  const createAndMailLetter = () => lob.letters.create({
    description: 'My First Class Letter',
    to: addressTo,
    from: addressFrom,
    // file: minified version of https://github.com/lob/lob-node/blob/master/examples/html/letter.html with slight changes as an example
    file: `<html><head><meta charset="UTF-8"><style>body{width:8.5in;height:11in;margin:0;padding:0}.page{page-break-after:always;position:relative;width:8.5in;height:11in}.page-content{position:absolute;width:8.125in;height:10.625in;left:1in;top:1in}.text{position:relative;left:20px;top:3in;width:6in;font-size:14px}</style></head>
          <body><div class="page"><div class="page-content"><div class="text">
          Hello ${addressTo.name}, <p> We would like to welcome you to the community! Thanks for being a part of the team! <p><p> Cheer,<br>${addressFrom.name}
          </div></div></div></body></html>`,
    color: false
  })
    .then((letter) => (letter))
    .catch((error) => Promise.reject(new Error(`Could not create and send letter: ${error}`)));

  try {
    const uspsLetter = await createAndMailLetter();
    const zipDetails = await lookupZip();
    res.render('api/lob', {
      title: 'Lob API',
      zipDetails,
      uspsLetter,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/upload
 * File Upload API example.
 */

exports.getFileUpload = (req, res) => {
  res.render('api/upload', {
    title: 'File Upload'
  });
};

exports.postFileUpload = (req, res) => {
  req.flash('success', { msg: 'File was uploaded successfully.' });
  res.redirect('/api/upload');
};

