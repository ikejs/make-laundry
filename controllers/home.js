/**
 * GET /
 * Home page.
 */
exports.index = (req, res) => {
  res.render('home', {
    title: 'Home',
    active: { home: true }
  });
};

/**
 * GET /
 * CSRF Token.
 */
exports.csrf = (req, res) => {
  res.render('csrf', {
    layout: false
  });
};
