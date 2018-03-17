
module.exports = (req, res, next) => {
  if (!req.isAuthenticated()) {    
    // redirect
    return res.status(401).redirect("/pix");
  }
  next();
};

// function checkAuthentication(req,res,next){
//     if(req.isAuthenticated()){
//         //if user is looged in, req.isAuthenticated() will return true 
//         next();
//     } else{
//         res.redirect("/login");
//     }
// }
