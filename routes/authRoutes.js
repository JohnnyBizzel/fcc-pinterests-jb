const passport = require('passport');
module.exports = (app) => {

  function checkAuthentication(req,res,next){
    if(req.isAuthenticated()){
        //if user is looged in, req.isAuthenticated() will return true 
        next();
    } else{
        res.redirect("/login");
    }
  }
  
  // scope accesses specific details of the user's google acct.
  app.get('/auth/google', passport.authenticate('google', { scope: ['profile','email']}));

  app.get('/auth/google/callback', passport.authenticate('google'),
           (req, res) => {
              res.redirect('/');
        });
  
   // Twitter access routes.
  app.get('/auth/twitter', passport.authenticate('twitter'));

  app.get('/auth/twitter/callback', passport.authenticate('twitter'),
           (req, res) => {
              res.redirect('/');
        });
  
     // Facebook access routes.
  app.get('/auth/fb', passport.authenticate('facebook'));

  app.get('/auth/fb/callback', passport.authenticate('facebook'),
           (req, res) => {
              res.redirect('/');
        });
  
  // GitHub access routes.
  app.get('/auth/gh', passport.authenticate('github'));

  app.get('/auth/gh/callback', passport.authenticate('github'),
           (req, res) => {
              res.redirect('/');
        });
  
  
  app.get('/api/logout', (req, res) => {
    req.logout();        
    res.redirect('/');
  });
  
  app.get('/api/current_user', (req, res) => {
    res.send(req.user);
  });
  
  app.get('/privacy', (req, res) => {
    res.render('privacy-policy');
  });

};


