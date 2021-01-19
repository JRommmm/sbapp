export{};
const mongoose = require('mongoose')

const folderSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  user: { 
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
  },
  rootFolder: {
      type: Boolean,
  },
  parentFolder: { //rename parentFolder to parentFolderID
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Folder'  
  },
  folders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Folder'
    }
  ],
  generation: {
    type: Number
  }
})

module.exports = mongoose.model('Folder', folderSchema)