const mongoose = require('mongoose');

const setSchema = new mongoose.Schema({
  name: String,
  group: String,
  machines: Array
}, { timestamps: true });


const Set = mongoose.model('Set', setSchema);

module.exports = Set;
