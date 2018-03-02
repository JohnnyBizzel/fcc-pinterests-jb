const passport = require('passport');
module.exports = (app) => {

  // scope accesses specific details of the user's google acct.
  app.get('/auth/google', passport.authenticate('google', { scope: ['profile','email']}));

  app.get('/auth/google/callback', passport.authenticate('google'),
           (req, res) => {
              res.redirect('/pins');
        });
  
   // Twitter access routes.
  app.get('/auth/twitter', passport.authenticate('twitter'));

  app.get('/auth/twitter/callback', passport.authenticate('twitter'),
           (req, res) => {
              res.redirect('/pinst');
        });
  
     // Facebook access routes.
  app.get('/auth/fb', passport.authenticate('facebook'));

  app.get('/auth/fb/callback', passport.authenticate('facebook'),
           (req, res) => {
              res.redirect('/pinsfb');
        });
  
  // GitHub access routes.
  app.get('/auth/gh', passport.authenticate('github'));

  app.get('/auth/gh/callback', passport.authenticate('github'),
           (req, res) => {
              res.redirect('/pinsg');
        });
  
  
  app.get('/api/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });
  
  app.get('/api/current_user', (req, res) => {
    res.send(req.user);
  });

};


