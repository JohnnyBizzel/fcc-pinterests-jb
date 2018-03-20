const Pix = require("../models/pix");
const url = require('url');
const http = require('http');
const https = require('https');
const sizeOf = require('image-size');
const mongoose = require('mongoose');

function continueWithSave(req, res, orient) {
  const newDoc = new Pix({ imgUrl: req.body.inputLink, 
              imgDescription: req.body.inputDesc.trim(),
              section: req.body.selectSection,
              orientation: orient,
              createdBy: req.user._id,
              createdByName: req.user.displayName });
    

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

function processResponse(req, res, httpResponse, dimensions) {
      function checkOrientation(width, height) {
      if (width === height) return 'SQ';
      if (width > height) return 'LS';
      if (width < height) return 'PT';      
      }
  
      const { statusCode } = httpResponse;
        const contentType = httpResponse.headers['content-type'];

        let error;
        if (statusCode !== 200) {
        error = new Error('Request Failed.\n' +
                      `Status Code: ${statusCode}`);
        }
        if (error) {
          console.error(error.message);
          // consume response data to free up memory
           var httpError = { imgUrl : "Error with image save. Is the URL a valid image?" };
          res.render('addpic', { errors: httpError });
          return;
        }
        var chunks = [];
        httpResponse.on('data', function (chunk) {
          chunks.push(chunk);
        }).on('end', function() {
          var buffer = Buffer.concat(chunks);
          // returns an object with image height / width
          // TODO - check for errors
          dimensions = (sizeOf(buffer));
          // check orientation
          let imgOrient = checkOrientation(dimensions.width, dimensions.height);
          continueWithSave(req, res, imgOrient);
        });

}

module.exports = {
  // add picture
  addPicture: (req, res) => {
    

    var imgUrl = req.body.inputLink.trim();
    var orientation = '', dimensions = {};
    // check if image link is http or https
    var options = url.parse(imgUrl);
    console.log(url.parse(imgUrl));
    // check for image file type
    
    var n = imgUrl.split(".");
    var fileExt = n[n.length - 1];
    
    // ok this means  some valid images are not allowed.
    if(!(/(gif|jpe?g|png)/i).test(fileExt)) {
      var UrlError = { imgUrl : "Error with link specified. Permitted image types are JPG|PNG|GIF." };
          res.render('addpic', { errors: UrlError });
      return;
    }
    if (imgUrl.startsWith('https')) {
      https.get(options, function (httpResponse) {
        processResponse(req, res, httpResponse, dimensions);
        
      }).on('error', (e) => {
          console.error(`Got error: ${e.message}`);
          res.render('addpic', { errors: 'Error with link specified. Is the URL a valid image?' });
      });    
    } else {
      http.get(options, function (httpResponse) {
        processResponse(req, res, httpResponse, dimensions);
      }).on('error', (e) => {
        console.error(`Got error: ${e.message}`);

        var httpError = { imgUrl : "Error with link specified. Is the URL a valid image?" };
          res.render('addpic', { errors: httpError });
      });      
    }

  },
  getPix: (param, skipNum, takeNum, callback) => {
    // get all pictures (filtered)
    Pix.find(param).count().exec((e, count) => { 
      if (e) console.log(e);
      console.log('total count = ',count);
      if (skipNum > count) skipNum = 0;
      // todo - make sure skip isn't higher than the collection
      if (param.hasOwnProperty('createdBy')) takeNum= count; // get all images for  user (no paging)
      Pix.find(param).sort({'createdAt': -1}).skip(skipNum).limit(takeNum).exec((err, dataset) => {
        if (err) {
          callback(err, null, null, null);
          return;
        }          
        callback(null, dataset, skipNum, count);
      });
    
    });
       
  },
  addRemoveLike: (req, res) => {
    // add like for user for picture
    Pix.findById({ _id : req.query.pic_id }).exec((e, doc) => { 
      if (e) console.log(e);
      console.log(doc.likedBy);
      // push  req.user._id 
      let likes = doc.likedBy;
      const idx = likes.indexOf(req.user._id);
      console.log('search for liked by: ',idx);
      const objectId = mongoose.Types.ObjectId(req.user._id);
      if (idx < 0) { 
        // adding like        
        likes.push(objectId);
      } else {
        // removing like
        if (idx === 0) {
          likes.shift();
        } else if (idx === likes.length -1) {
          likes.pop();
        } else {
          var back = likes.splice(idx);
          back.shift();
          likes = likes.concat(back);
        }        
      }
      //res.redirect('/');
      console.log('new likes: ',likes);
      doc.likes = likes;
      //console.log(d);
      doc.save(res(e, doc));
      //res(e, d);
    });
  },
  deletePicture: (id, callback) => {
    // delete picture
     const objectId = mongoose.Types.ObjectId(id);
    Pix.findByIdAndRemove(objectId).exec((err) => {
      if (err) {
                callback(err, null);
                return;
      }
      callback(null, null);
    });
  }
    
}
