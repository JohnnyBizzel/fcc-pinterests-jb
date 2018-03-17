const Pix = require("../models/pix");
const url = require('url');
const http = require('http');
const https = require('https');
const sizeOf = require('image-size');


function continueWithSave(req, res, orient) {
  const newDoc = new Pix({ imgUrl: req.body.inputLink, 
              imgDescription: req.body.inputDesc.trim(),
              section: req.body.selectSection,
              orientation: orient });
    

    newDoc.save((err) => {
      if (err) { 
        console.log('CB err: ', err.errors);
        const errMsg = "Error submitting picture: " + err.errors.imgUrl;
        console.log(errMsg);
        res.render('addpic', { errors: err.errors });
      } 
      else {
        // res.send(doc);
        res.redirect('/');
      }
    });

}
module.exports = {
  // add picture
  addPicture: (req, res) => {
    
    function checkOrientation(width, height) {
      if (width === height) return 'SQ';
      if (width > height) return 'LS';
      if (width < height) return 'PT';      
    }
    var imgUrl = req.body.inputLink.trim();
    var orientation = '', dimensions = {};
    // check if image link is http or https
    var options = url.parse(imgUrl);
    if (imgUrl.startsWith('https')) {
      https.get(options, function (response) {
        var chunks = [];
        response.on('data', function (chunk) {
          chunks.push(chunk);
        }).on('end', function() {
          var buffer = Buffer.concat(chunks);
          // returns an object with image height / width
          dimensions = (sizeOf(buffer));
          // check orientation
          let imgOrient = checkOrientation(dimensions.width, dimensions.height);
          continueWithSave(req, res, imgOrient);
        });
      });    
      
    } else {
      

      http.get(options, function (response) {
        var chunks = [];
        response.on('data', function (chunk) {
          chunks.push(chunk);
        }).on('end', function() {
          var buffer = Buffer.concat(chunks);
          // returns an object with image height / width
          dimensions = (sizeOf(buffer));
           // check orientation and save
          continueWithSave(req, res, checkOrientation(dimensions.width, dimensions.height));
        });
      });    
    }

  },
  getPix: (param, callback) => {
    // get all pictures (filtered)
    Pix.find(param, (err, dataset) => {
      if (err) {
        callback(err, null);
        return;
      }          
      callback(err, dataset);
    });
  }
  
  // todo:
  // add like for user for picture

// delete picture
  
}





