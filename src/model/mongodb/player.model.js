const mongoose = require('mongoose');

const model = mongoose.model('player', new mongoose.Schema({
  _id: String,
  state: String,
  nickname: String,
  level: Number,
  updatedAt: Date,
  createdAt: Date,
}, {collection: 'player'}));

module.exports = model;
