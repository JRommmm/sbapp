export{};
const mongoose = require('mongoose')

const folderSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  }
})

module.exports = mongoose.model('Folder', folderSchema)