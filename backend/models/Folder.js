const mongoose = require('mongoose')

const folderSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: false,
  }
})

module.exports = mongoose.model('Folder', folderSchema)