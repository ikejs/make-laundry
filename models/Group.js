const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  name: String,
  slug: String,
  manager: String,
  members: Array,
  sets: Array
}, { timestamps: true });


const Group = mongoose.model('Group', groupSchema);

module.exports = Group;
