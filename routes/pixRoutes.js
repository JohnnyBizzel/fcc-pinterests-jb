const db = require('../services/database');
const testAuthorization = require("../services/authorization");


module.exports = (app) => {
  app.get('/', function(req, res){
    console.log(req.user);
    var section = req.query.sect;
    var filter = (section) ? { section: section } : {};
    var skip = 0, limit = 10;
    
    db.getPix(filter, skip, limit, (err, results) => {
       // set up images for displaying to the view
       results.map((pic) => {
         pic.date = new Date(pic.createdAt).toLocaleDateString();
         switch (pic.orientation) {
           case 'LS' :
             pic.orientation = 'land';
             pic.divItemStyle = 'grid-item--width2';
             break;
           case 'PT' :
             pic.orientation = 'port';
             pic.divItemStyle = '';
             break;
           case 'SQ' :
             pic.orientation = 'square';
             pic.divItemStyle = '';
             break;
           default:
             pic.orientation = 'square';
             pic.divItemStyle = '';
             
         }
         switch (pic.section) {
           case 'Nature' :
             pic.sectColour = 'green';
             pic.sectIcon = 'fab fa-pagelines';
             break;
           case 'Sport' :
             pic.sectColour = 'purple';
             pic.sectIcon = 'fas fa-football-ball';
             break;
           case 'Celebs' :
             pic.sectColour = 'pink';
             pic.sectIcon = 'fas fa-star';
             break;
           case 'Food' :
             pic.sectColour = 'red';
             pic.sectIcon = 'fas fa-utensils';
             break;
           case 'Photography' :
             pic.sectColour = 'blue';
             pic.sectIcon = 'fas fa-image';
             break;
           case 'Random' :
             pic.sectColour = 'brown';
             pic.sectIcon = 'fas fa-random';
             break;
            case 'Funny' :
             pic.sectColour = 'amber';
             pic.sectIcon = 'far fa-smile';
             break;
           default:
             pic.sectColour = 'brown';
             pic.sectIcon = 'fas fa-random';
          }
       });     
      // check if logged in
      if (req.user) {         
        res.render('index', { title: "Welcome to Pixterest", user: req.user.displayName, pix: results }); 
      } else {         
        res.render('index', { title: "Welcome to Pixterest", user: null, pix: results }); 
      }

    });
   

  });


  app.get('/addpic', testAuthorization, function(req, res){ 
    res.render('addpic', { errors: null });
  });


  app.post('/addpic',  function(req, res){ 
     console.log(req.user);
    // Save new pic in the db
    db.addPicture(req, res);
        
  });
  
}
