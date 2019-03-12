const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = mongoose.model('player', new Schema({
  _id: String,
  state: String,
  nickname: String,
  level: Number,
  updatedAt: Date,
  createdAt: Date,
}, {collection: 'player'}));
