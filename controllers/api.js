const { promisify } = require('util');
const GitHub = require('@octokit/rest');
const axios = require('axios');
const passport = require('passport');
const validator = require('validator');
const User = require('../models/User');
const Set = require('../models/Set');
const Group = require('../models/Group');
var ObjectId = require('mongodb').ObjectID;





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


// iOS APP LOGIN

exports.postApiLogin = (req, res, next) => {
  const validationErrors = [];
  if (!validator.isEmail(req.body.email)) res.send({ msg: 'Please enter a valid email address.' });
  if (validator.isEmpty(req.body.password)) res.send({ msg: 'Password cannot be blank.' });

  if (validationErrors.length) {
    res.send({ msg: validationErrors, error: true });
  }
  req.body.email = validator.normalizeEmail(req.body.email, { gmail_remove_dots: false });

  passport.authenticate('local', (err, user, info) => {
    if (err) { return next(err); }
    if (!user) {
      res.send({ msg: info, error: true })
    }
    req.logIn(user, (err) => {
      if (err) { return next(err); }
      res.send(user);
    });
  })(req, res, next);
};



// iOS APP SIGN UP

exports.postApiSignUp = (req, res, next) => {
  const validationErrors = [];
  if (!validator.isEmail(req.body.email)) res.send({ msg: 'Please enter a valid email address.' });
  if (!validator.isLength(req.body.password, { min: 8 })) res.send({ msg: 'Password must be at least 8 characters long' });
  if (req.body.password !== req.body.confirmPassword) res.send({ msg: 'Passwords do not match' });

  if (validationErrors.length) {
    res.send({msg: validationErrors, error: true})
  }
  req.body.email = validator.normalizeEmail(req.body.email, { gmail_remove_dots: false });

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  });

  User.findOne({ email: req.body.email }, (err, existingUser) => {
    if (err) { return next(err); }
    if (existingUser) {
      res.send({ msg: 'Account with that email address already exists.', error: true });
    }
    user.save((err) => {
      if (err) { return next(err); }
      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
        res.send(user);
      });
    });
  });
};

exports.getApiLogout = (req, res) => {
  if(req.user) {
    req.logout();
    req.session.destroy((err) => {
      if (err) console.log('Error : Failed to destroy the session during logout.', err);
      req.user = null;
      res.send({ logout: true })
    });
  } else {
    res.send({ msg: "no user to log out" })
  }
};

// sets = [
//   {
//     "_id": "34ygtuy3g4ygt23gygygs",
//     "name": "Second Floor",
//     "groups": [
//         {
//             "_id": "34ygtuy3g4ygt4bgyu34gb",
//             "name": "Washers",
//             "machines": [
//                 {
//                     "_id": "34ygtuy3g4ygt82herg2j",
//                     "name": "Second Floor Washer #1",
//                     "status": {
//                         "timerSeconds": 36000,
//                         "timerStarted": "2020-01-10T00:10:40.787Z",
//                         "currentUser": {
//                             "_id": {
//                                 "$oid": "5e17bcfea0f3150017933639"
//                             },
//                             "tokens": [],
//                             "name": "MikeandIke",
//                             "email": "ikey@gmail.com",
//                             "password": "$2b$10$mbJfQoyNbyjT7E1YD4gzkeGoZ.iLFU26m3kZPR9FqvC770OPQjJq6",
//                             "createdAt": {
//                                 "$date": "2020-01-09T23:53:34.100Z"
//                             },
//                             "updatedAt": {
//                                 "$date": "2020-01-09T23:53:34.100Z"
//                             },
//                             "__v": 0
//                         }
//                     }
//                 },
//                 {
//                     "_id": "34ygtuy3g4ygt82herg2j",
//                     "name": "Second Floor Washer #2",
//                     "status": {
//                         "timerSeconds": null,
//                         "timerStarted": null,
//                         "currentUser": null
//                     }
//                 },
//             ]
//         },
//         {
//             "_id": "34t7y8734ty38hgre34",
//             "name": "Dryers",
//             "machines": [
//                 {
//                     "_id": "567rtyjje56rythe4rt",
//                     "name": "Second Floor Dryer #1",
//                     "vacant": false,
//                     "status": {
//                         "timerSeconds": 36000,
//                         "timerStarted": "2020-01-09T17:10:40.787Z",
//                         "currentUser": {
//                             "_id": {
//                                 "$oid": "5e17bcfea0f3150017933639"
//                             },
//                             "tokens": [],
//                             "name": "MikeandIke",
//                             "email": "ikey@gmail.com",
//                             "password": "$2b$10$mbJfQoyNbyjT7E1YD4gzkeGoZ.iLFU26m3kZPR9FqvC770OPQjJq6",
//                             "createdAt": {
//                                 "date": "2020-01-09T23:53:34.100Z"
//                             },
//                             "updatedAt": {
//                                 "$date": "2020-01-09T23:53:34.100Z"
//                             },
//                             "__v": 0
//                         }
//                     }
//                 },
//                 {
//                     "_id": "w45rthe45rytsergdres5r",
//                     "name": "Second Floor Dryer #2",
//                     "vacant": true,
//                     "status": {
//                         "timerSeconds": 36000,
//                         "timerStarted": "2020-01-09T17:10:40.787Z",
//                         "currentUser": "4wugt5uy4htue45yeurtgf"
//                     },
//                     "timerSeconds": null,
//                     "timerStarted": null
//                 }
//             ]
//         }
//     ]
// }
// ]

exports.getGroup = (req, res) => {
  // EXPAND:   Set.find({ group: req.params.groupID }, function(err, sets) {
  Group.findOne({ _id: req.params.groupID }, function(err, data) {
    res.send(data);
  });
}


exports.getMachine = (req, res) => {
  Group.findOne({
    "sets.groups.machines._id": ObjectId(req.params.machineID)
 }, {
  "sets.groups.machines.$._id": 1
 }, function(err, results) {
   if (err) {
     res.send(err);
   } else {
    if(req.params.machineID === '5e17f7ed72d7dfb65f94a012') {
      // floor 2 washer 1
      res.send(results.toObject().sets[0].groups[0].machines[0]);
    }
    if(req.params.machineID === '5e17fa9172d7dfb65f94a018') {
      // floor 2 washer 2
      res.send(results.toObject().sets[0].groups[0].machines[1]);
    }
    if(req.params.machineID === '5e17f83372d7dfb65f94a014') {
      // floor 2 dryer 1
      res.send(results.toObject().sets[0].groups[1].machines[0]);
    }
    if(req.params.machineID === '5e17fb9872d7dfb65f94a019') {
      // floor 2 dryer 2
      res.send(results.toObject().sets[0].groups[1].machines[1]);
    }
    if(req.params.machineID === '5e17f85d72d7dfb65f94a015') {
      // floor 1 washer 1
      res.send(results.toObject().sets[0].groups[0].machines[0]);
    }
    if(req.params.machineID === '5e17f90b72d7dfb65f94a016') {
      // floor 1 dryer 1
      res.send(results.toObject().sets[0].groups[1].machines[0]);
    }
   }
 })
}

