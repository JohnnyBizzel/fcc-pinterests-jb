const db = require('../services/database');
const mongoose = require('mongoose');
const testAuthorization = require("../services/authorization");


module.exports = (app) => {
  app.get('/', function(req, res){
    var myPics = req.query.mine;
    var myLikes = req.query.likes;
    var section = req.query.sect;
    //console.log(section);
    var filter = (section) ? { section: section } : {};
    var skip = 0, limit = 8;
    
    if (req.query.next)  { 
      skip += Number(req.query.next) + 8;
    }
    if (myPics) {
      
      filter.createdBy = mongoose.Types.ObjectId(req.user._id);
    }
    if (myLikes) {
      filter.likedBy = mongoose.Types.ObjectId(req.user._id);
    }
    //console.log(filter);
    db.getPix(filter, skip, limit, (err, results, newSkip, count) => {
       // set up images for displaying to the view
      console.log(filter.hasOwnProperty('createdBy'));
       results.map((pic) => {
         pic.date = new Date(pic.createdAt).toLocaleDateString();
         //console.log(pic.likedBy, pic.imgDescription);
         if (pic.likedBy.length > 0 && req.user) {
           //console.log(pic.likedBy, pic.imgDescription);
           // only show the likes when the user is logged in and there are some!
           for (let i=0; i< pic.likedBy.length; i++) {
             const userId = (req.user._id);
             if (pic.likedBy[i].equals(userId)) { pic.like = 1};
           }          
         }
         // check if logged in to add delete option for own pics
         if (req.user) {
           if (req.user._id.equals(pic.createdBy))
             pic.canDelete = 1;
         }
         // check the orientation for CSS styling
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
         // check the section for CSS styling
         switch (pic.section) {
           case 'Art' :
             pic.sectColour = 'khaki';
             pic.sectIcon = 'fas fa-paint-brush';
             break;
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
      
      console.log('images for the view ', count);
      // check if logged in
      if (req.user) {         
        res.render('index', { title: "Welcome to Pixterest", 
                             user: { name: req.user.displayName, id: req.user._id },
                             pix: results, 
                             skipping: newSkip, 
                             count: count,
                             section: filter,
                             myPix: filter.hasOwnProperty('createdBy') }); 
      } else {         
        res.render('index', { title: "Welcome to Pixterest", 
                             user: null,
                             pix: results,
                             skipping: newSkip,
                             count: count,
                             section: filter,
                             myPix: filter.hasOwnProperty('createdBy') }); 
      }

    });
   

  });

  // show add picture form
  app.get('/addpic', testAuthorization, function(req, res){ 
    res.render('addpic', { errors: null });
  });


  app.post('/addpic',  function(req, res){ 
    // Save new pic in the db
    db.addPicture(req, res);
        
  });
  
  app.get('/like', testAuthorization, function(req, res){ 
    console.log('api callback');
    // add or remove picture 'like'
    db.addRemoveLike(req, (e,d) => { 
      //console.log('api callback returned', d); 
      res.redirect('/'); 
    });
  });
  
  app.get('/del', testAuthorization, function(req, res){ 
    console.log('api callback remove - ', req.query.pic_id);
    // remove picture
    if (req.query.pic_id) {
      db.deletePicture(req.query.pic_id, (err,d) => { 
        if (err) console.log(err);
        res.redirect('/'); 
      });
    }
  });
  
}
