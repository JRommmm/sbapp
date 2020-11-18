const logger = require('../utilities/logger')
const { UserInputError, AuthenticationError } = require('apollo-server')
const User = require('../models/User')
const Folder = require('../models/Folder')
//https://www.apollographql.com/blog/modularizing-your-graphql-schema-code-d7f71d5ed5f2/

export const typeDefs = `
  type Folder {
    title: String
    id: ID!
  }

  extend type Mutation {
    addFolder(
        title: String!
    ): Folder
  }

  extend type Mutation {
    deleteFolder(
        id: String!
    ): Folder
  }

  extend type Mutation {
    editFolderTitle(
        id: String!
        title: String!
    ): Folder
  }

  extend type Query {
    allFolders: [Folder]
  }
`


export const resolvers = {
    Query: {
      allFolders: async (root, args, context) => { 
          logger.resolvers("inside allFolders - allFolder-0", "Q_allFolders")
          const currentUser = context.currentUser
          if (!currentUser) { throw new AuthenticationError("not authenticated") }
          logger.resolvers("allFolder-1 - authentication passed", "Q_allFolders")
          var userFolders
          try {
            //see R1 in comments footer
            userFolders = await User.findOne({ username: currentUser.username }).populate({
              path: 'folders',
              model: 'Folder',
            })  
          } catch (error) {
            //throw new UserInputError(error.message, {invalidArgs: args,})//USE GENERIC APOLLO ERROR HERE
            console.log(error, "retrieving folders failed") 
            //should throw error since "return userFolders.folders" will be invalid 
          }
          logger.resolvers("allFolder-2 - userFolders retrieved - before return", "Q_allFolders")
          return userFolders.folders
      }
      //E2
    },
    Mutation: {
      addFolder: async (root, args, context) => { 
          const folder = new Folder({ 
            title: args.title 
          })
          const currentUser = context.currentUser
          if (!currentUser) { throw new AuthenticationError("not authenticated") }
          try {
            await folder.save() //<-- this saves in the "folder" list
            currentUser.folders = currentUser.folders.concat(folder)
            await currentUser.save() //<-- this saves in the *USER's "folder" list
          } catch (error) {
            throw new UserInputError(error.message, {
              invalidArgs: args,
            })
          }
          return folder    
      },
      deleteFolder: async (root, args, context) => { 
        var folder_id = args.id
        //check authentication
        const currentUser = context.currentUser
        if (!currentUser) { throw new AuthenticationError("not authenticated") }
        //delete
        //--VV WARNING do not include await with callback, it executes twice!! eg. await Folder.findByIdandDelete...
        Folder.findByIdAndDelete(folder_id, function (err, docs) {
          if (err){ 
              console.log(err)
              console.log("first deletion failure")  
          } 
          else{ 
              console.log("Deleted : ", docs);
              console.log("first deletion success");
          } 
        });
        // see E1
        const user = await User.findById(currentUser._id);
        var filteredfolder = user.folders.filter( x => x._id.toString() !== folder_id )
          //console.log(x._id.toString() !== folder_id)
        user.folders = filteredfolder
        user.save();
    },
    editFolderTitle: async (root, args, context) => {
      var folder_id = args.id
      const newTitle = args.title
      //check authentication
      const currentUser = context.currentUser
      if (!currentUser) { throw new AuthenticationError("not authenticated") }
      //Main list update
      await Folder.findByIdAndUpdate({_id: folder_id}, {title: newTitle}, { runValidators: true })
      //don't need to update at array level (it references the id, and therefore will reference updated information - through populate)
    }
  }
}


/* COMMENTS FOOTER -----------------


  R1
          //gets us a result
          // either adding a folder i wrong, or .populate is not working
          //Possibility: in model/User the folder schema there
          //Possibility: await

          //userFolders = currentUser.folders <---    this returns something -------

          //userFolders = currentUser.folders.populate('Folder')
          //userFolders = currentUser.folders.map(folder => folder.populate('Folder'))   
          //userFolders = currentUser.find({}).populate('Folder')

          //userFolders = await currentUser.folders.populate('Folder')
          //userFolders = await currentUser.find({}).populate('Folder')
          //userFolders = await currentUser.folders.map(folder => folder.populate('Folder'))

          //userFolders = await User.populate('Folder')

          //userFolders = await User.findOne({ username: currentUser.username }).populate('Folders')



  E1
  
        
        await User.findByIdAndUpdate( { _id: currentUser._id }, { $pull: { "folders": { _id: folder_id } } }, 
        function(err){
          if (err){
            console.log(err)
            console.log("second deletion failure") 
          } else {
            console.log("second deletion success");
            
          } }
        ) 
 
        

  E2

      personCount: () => persons.length,
      allPersons: () => persons,
      findPerson: (root, args) =>
      persons.find(p => p.name === args.name),

*/