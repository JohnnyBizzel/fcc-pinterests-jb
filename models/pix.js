const mongoose = require('mongoose');
const { Schema } = mongoose;

const reMatchUrl = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;
      

const picSchema = new Schema({
  imgUrl: { type: String, required: [true,  'Please add an image link'], match: [reMatchUrl, '{VALUE} is not a valid link'] },
  imgDescription: { type: String, required: [true,  'Please add a description'] },
  section: { type: String, default: 'Random' },
  orientation: String, 
  likedBy: Array,
  createdBy: {type: Schema.Types.ObjectId, ref: 'users'},
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('pix', picSchema);