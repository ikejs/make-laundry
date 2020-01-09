/**
 * GET /
 * Home page.
 */
exports.index = (req, res) => {
  if (req.user) {
    res.redirect('/account/machines')
  } else {
    res.render('home', {
      title: 'Home',
      active: { home: true }
    });
  }
};