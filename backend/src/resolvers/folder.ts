const logger = require('../utilities/logger')
const { UserInputError, AuthenticationError, gql } = require('apollo-server')
const User = require('../models/User')
const Folder = require('../models/Folder')
const { ApolloError } = require("apollo-server-core")

//https://www.apollographql.com/blog/modularizing-your-graphql-schema-code-d7f71d5ed5f2/

export const typeDefs = gql`
  type Folder {
    title: String
    user: User
    id: ID!
    rootFolder: Boolean!
    parentFolder: Folder
    generation: Int
    folders: [Folder]
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

  extend type Mutation {
    moveFolder(
      parentFolder: String!
      folder: String!
    ): Folder
  }

  extend type Mutation {
    generationUpdateChildRemoval(
      childFolderID: String!
    ): Boolean
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
              populate: [{
                  path: 'user',
                  model: 'User'
              },
              {
                  path: 'folders',
                  model: 'Folder',
                  populate: [{
                    path: 'user',
                    model: 'User'},
                  {
                    path: 'folders',
                    model: 'Folder',
                    populate: [{
                      path: 'user',
                      model: 'User'},
                    {
                      path: 'folders',
                      model: 'Folder',
                      populate: [{
                        path: 'user',
                        model: 'User'},
                      {
                        path: 'folders',
                        model: 'Folder',
                      }]
                    }]
                  }, ]
              }]}) 

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
          const currentUser = context.currentUser
          //console.log("In add folder: currentuser:", currentUser);
          
          if (!currentUser) { throw new AuthenticationError("not authenticated") } 
          const folder = new Folder({ 
            title: args.title,
            user: currentUser,
            rootFolder: true,
            generation: 0 
          })
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
        //loop through subfolders, make them root (eventually we want to make it add them to a "recycle folder")
        const loopSubFolders = async (folder) => {
          //if this doesnt work, do it again from scratch this time RETURING AN AWAIT VALUE AND WORKIGN WITH THAT VALUE
          folder.folders.map(async (subFolder)=>{
            //console.log("subFolder._id", subFolder._id);
            //subFolder.rootFolder = true

            const dataSubFolder = await Folder.findOne({ _id: subFolder._id }).populate({
              path: 'folders',
              model: 'Folder',})
            
            console.log("dataSubFolder before:", dataSubFolder.title, dataSubFolder.rootFolder, dataSubFolder.parentFolder );
              
            dataSubFolder.rootFolder = true
            dataSubFolder.parentFolder = null
            await dataSubFolder.save().then(()=>{
              resolvers.Mutation.moveFolder(root, args= {parentFolder: "ROOT", folder: dataSubFolder._id}, context)
            })

            console.log("dataSubFolder after:", dataSubFolder.title, dataSubFolder.rootFolder, dataSubFolder.parentFolder);

            //console.log("updated dataSubFolder found:", dataSubFolder);
            //console.log(dataSubFolder.title, dataSubFolder._id, dataSubFolder.rootFolder);     
            // remove this?
          })

        }

        const deleteSequence = async (currentUser, folder_id) => {
          //delete
          //--VV WARNING do not include await with callback, it executes twice!! eg. await Folder.findByIdandDelete...
        
                    // remove CF from CF's PF folders
                    /*
                    const pfolder = await Folder.findById(folder.parentFolder._id);
                    var filteredpfolder = pfolder.folders.filter( x => x._id.toString() !== folderID )
                    pfolder.folders = filteredpfolder
                    pfolder.save();
                    */


          Folder.findByIdAndDelete(folder_id, async function (err, docs) {
            if (err){ 
                console.log(err)
                console.log("first deletion failure")  
            } 
            else{ 
                console.log("Deleted : ", docs);
                console.log("first deletion success");
                /*
                var folderParent = await Folder.findOne({ _id: parentFolderID }).populate({
                  path: 'folders',
                  model: 'Folder',
                }).then(async ()=>{
                  await resolvers.Mutation.generationUpdateChildRemoval(folderParent)
                })
                */
            } 
          });
          console.log("delete b");
          // see E1
          const user = await User.findById(currentUser._id);
          var filteredfolder = user.folders.filter( x => x._id.toString() !== folder_id )
            //console.log(x._id.toString() !== folder_id)
            console.log("delete c");
          user.folders = filteredfolder
          console.log("delete d");
          user.save();
        }
        
        /*
        await loopSubFolders(folder).then(async ()=>{
          // need to update parent's GN
          
          if (folder.parentFolder){
            var parentFolder = await Folder.findByIdAndUpdate(
              {_id: folder.parentFolder}, 
              {"$set": {"generation": 0} },
              { runValidators: true }).then(async ()=>{
                await resolvers.Mutation.generationUpdateChildRemoval(parentFolder)
              })
          }
        })
*/
        console.log("inside deleteFolder - 1");
        if (args._id){ var folder_id = args._id } else { var folder_id = args.id}
        //var folder_id = args._id
        //console.log("inside deleteFolder - 1 args._id", args._id);
        //console.log("inside deleteFolder - 1 args.id", args.id);
        //onsole.log("inside deleteFolder - 1 args.id.toString()", args.id.toString());
        //console.log("inside deleteFolder - 1 context.currentUser", context.currentUser);

        //check authentication
        const currentUser = context.currentUser
        if (!currentUser) { throw new AuthenticationError("not authenticated") }

        var folder = await Folder.findOne({ _id: folder_id }).populate({
          path: 'folders',
          model: 'Folder',
          populate: [{
            path: 'folders',
            model: 'Folder',
          }]
        })
        //console.log("inside deleteFolder - 2", context.currentUser);
        //console.log("folder_id", folder_id);

        //await loopSubFolders(folder)

        //console.log("delete folder.parentFolder", folder.parentFolder); //attempt
        
       
       //this function might be pointless
       /*
        if (folder.parentFolder){
          var folder = await Folder.findOne({ _id: folder.parentFolder }).populate({
            path: 'folders',
            model: 'Folder',
          })
          console.log("delete folder.parentFolder.title", folder.title);
          if (folder.title){await resolvers.Mutation.generationUpdateChildRemoval(folder)}
         }

*/      
        console.log("inside deleteFolder - before loopSubFolders");
        console.log("folder.parentFolder:", folder.parentFolder);
        
          loopSubFolders(folder).then(()=> {
            if (folder.parentFolder){
              console.log("folder.parentFolder true");
              
              // @ts-ignore
             resolvers.Mutation.generationUpdateChildRemoval(folder).then( () => {deleteSequence(currentUser, folder_id)})
             //problem: generationUpdateChildRemoval algorithm doesnt take into account the deletion
            } else{
              console.log("folder.parentFolder true"); 
             deleteSequence(currentUser, folder_id)
            }
          })




        //ROOT OF THE PROBLEM: child still has parent id in parentFolder
        
        /* DELETE
        if (folder.parentFolder){
          var parentFolderID = folder.parentFolder
         }
         */

        console.log("delete a");
        
        //delete
        //--VV WARNING do not include await with callback, it executes twice!! eg. await Folder.findByIdandDelete...

    },
    editFolderTitle: async (root, args, context) => {
      var folder_id = args.id
      const newTitle = args.title
      console.log("edit folder id:", folder_id);
      
      //check authentication
      const currentUser = context.currentUser
      if (!currentUser) { throw new AuthenticationError("not authenticated") }
      //Main list update
      await Folder.findByIdAndUpdate({_id: folder_id}, {title: newTitle}, { runValidators: true })
      //don't need to update at array level (it references the id, and therefore will reference updated information - through populate)
    },
    generationUpdateChildRemoval: async (childFolder) => {
      //only being used in delete
      //check if equivalent with other one
      console.log("RESOLVER GENERATIONUPDATECHILDREMOVAL CALLED");
      
      console.log("14-1");
      if (childFolder.parentFolder){
        var maxGenerations = 6
        var i                                          
        var nextparentID = childFolder.parentFolder._id 
        var lastparent = childFolder

        for (i = 0; i < maxGenerations; i++){
          console.log("14-2 loop", i);
          var currentparent = await Folder.findOne({ _id: nextparentID }).populate({
            path: 'folders',
            model: 'Folder',
          })
          var currentChild = await Folder.findOne({ _id: lastparent }) //temp - fails here, childFolder getting deleted
          console.log("currentparent", currentparent.title, currentparent.generation);
          console.log("currentChild", currentChild.title, currentChild.generation);
          
          //see C5
          //if ((currentparent.generation - minus) === currentChild.generation){ //old if statement - delete

              console.log("currentparent.folders.length", currentparent.folders.length);
              
          
          //if PF.folders < 2, then in the first iteration CF is being removed, PF GN set to 0
          if(currentparent.folders.length <= 1){ 
                  
              // if your moving/deleting the child, you lose all generations
            if(i===0){currentparent.generation=0}else{currentparent.generation = currentparent.generation - 1}

              currentparent.save()
              console.log("14-3 currentparent - 1");
          } else { //check other folders for their GN
 
              var highestGN = 0

              //searching for GN where GF is 1         what if we just moved/delete highest GN?
              currentparent.folders.map((subFolder) => {
                console.log("HEADofLoop~~~~~~~``````--subFolder:", subFolder.title, "currentChild:", currentChild.title );
                console.log("subFolder._id:", subFolder._id, "currentChild._id:", currentChild._id );
                console.log("------matching ids:", subFolder._id.toString() !== currentChild._id.toString());
                console.log("subFolder.generation", subFolder.generation);
                console.log("highestGF", highestGN);
                console.log("higher GN found", subFolder.generation > highestGN);
                
                //find highest GN that doesn't include child being deleted
                if ((subFolder.generation > highestGN) && (subFolder._id.toString() !== currentChild._id.toString())) { 
                  
                  highestGN = subFolder.generation //need to ignore child's GN
                  console.log("new highestGN found in subFolders:", highestGN);
                  
                }
              })
              console.log("-----------FINAL highestGN:", highestGN);
                    
              currentparent.generation = highestGN + 1
              currentparent.save()
              console.log("14-5 currentparent - 1");
            
              //see C6        
          }
      //}
          //new loop check
          if (currentparent.parentFolder){
            lastparent = nextparentID
            nextparentID = currentparent.parentFolder //confusing syntax -- rename parentFolder to parentFolderID
            console.log("14-4 parent found");
          } else { break }
        }
      }
    },

    moveFolder: async(root, args, context) => {
      //GENERATION ADDITION/REMOVAL FUNCTIONS ------------------
      const generationUpdateChildRemoval = async (childFolder) =>{
        console.log("14-1");
        var maxGenerations = 6
        var i
        //initial value starts at grandparent of child 
        var nextparentID = childFolder.parentFolder._id 
        var lastparent = childFolder

        for (i = 0; i < maxGenerations; i++){
          console.log("14-2 loop", i);
          var currentparent = await Folder.findOne({ _id: nextparentID }).populate({
            path: 'folders',
            model: 'Folder',
          })
          var currentChild = await Folder.findOne({ _id: lastparent })
          console.log("currentparent", currentparent.title, currentparent.generation);
          console.log("currentChild", currentChild.title, currentChild.generation);
          
          //compare generation numbers and update
          //quick fix
          var minus
          if (i===0){minus = 1} else {minus = 2}
          console.log(currentparent.generation - minus);
          console.log(currentChild.generation);
          //compare
          if ((currentparent.generation - minus) === currentChild.generation){
              console.log("currentparent.folders.length", currentparent.folders.length);
              // don't lower generation if other folders still present
             if(currentparent.folders.length <= 1){ //what if other folders all have lowered generation?
              currentparent.generation = currentparent.generation - 1
              currentparent.save()
              console.log("14-3 currentparent - 1");
             } else { 
               //what if other folders all have lowered generation?
              var found = false
              currentparent.folders.map((subFolder) => {
                if (currentparent.generation - subFolder.generation === 1) {
                  found = true
                }
              })
              if (!found){
                currentparent.generation = currentparent.generation - 1
                currentparent.save()
                console.log("14-5 currentparent - 1");
              }
            
          }
         }
          //new loop check
          if (currentparent.parentFolder){
            lastparent = nextparentID
            nextparentID = currentparent.parentFolder //confusing syntax -- rename parentFolder to parentFolderID
            console.log("14-4 parent found");
          } else { break }
        }
      }
      /*Algorithm description:
        Requirements: childFolderID, parentFolderID
        Loops up parents GNs to ensure generations are increased by 1
        If GN difference > 1, then updating 
        If GN + 1 = Generation Limit, then limit has been reached (assumes generation limit has never been breached)
        If the parent's GN greater than child's GN by 2 or more, then limit cant be reached (error check ends)
        **This algorithm essencially mocks the GN that will be implemented on folder move
        */
      const generationUpdateChildAddition = async (childFolderID, parentFolderID) =>{
        console.log("8-1");
        var maxGenerations = 6 //FIX <--
        var i
        //initial value starts at grandparent of child
        var nextparentID = parentFolderID
        var lastparentID = childFolderID
        for (i = 0; i < maxGenerations; i++){
          console.log("8-2 loop", i);
          var currentparent = await Folder.findOne({ _id: nextparentID }) 
          var currentChild = await Folder.findOne({ _id: lastparentID })
          console.log("currentparent", currentparent.title, currentparent.generation);
          console.log("currentChild", currentChild.title, currentChild.generation);
          //compare generation numbers and update
           if (currentparent.generation <= currentChild.generation){
             currentparent.generation = currentChild.generation + 1
             currentparent.save()
             console.log("8-3 currentparent + 1");
           }
           //new loop check
          if (currentparent.parentFolder){
            lastparentID = nextparentID
            nextparentID = currentparent.parentFolder //confusing syntax -- rename parentFolder to parentFolderID
            console.log("8-4 parent found");     
          } else { break}
        }
      }
      ////--------------GENERATION FUNCTION END ----------------
      var parentFolderID = args.parentFolder
      var folderID = args.folder
      
      const currentUser = context.currentUser
      if (!currentUser) { throw new AuthenticationError("not authenticated") }

      console.log("0");
      //error catch - child and parent cant be the same folder
      if (folderID.toString() === parentFolderID.toString()) {
        console.log("Error, cant add folder into itself");
        throw new ApolloError("folder move error")
      }

      console.log("1");
      

      var folder = await Folder.findOne({ _id: folderID })

      // SCENARIO: moved to ROOT
      // parent folder would be 'ROOT'
      if (parentFolderID === 'ROOT'){  //GENERATION: ENSURE CF'S PARENT ROOT GETS UPDATED
        //is childFolder already root?
          if (folder.parentFolder){
            //GENERATION: update CF's PFs GNs
            console.log("inside ROOOT");
            console.log(folder.title, folder._id, folder.rootFolder);
            //delete scenario (if true, then you have an *actual* move scenario)
            if (folder.rootFolder === false){generationUpdateChildRemoval(folder)}
            
            //see C3

            //removing child from old parent folder
            const pfolder = await Folder.findById(folder.parentFolder._id);
            var filteredpfolder = pfolder.folders.filter( x => x._id.toString() !== folderID )
            pfolder.folders = filteredpfolder
            pfolder.save();
            //update child at root
            await Folder.findByIdAndUpdate(
              {_id: folderID}, 
              {"$set": {"rootFolder": true, "parentFolder": null} },
              { runValidators: true })
        }
      } else { // no move to ROOT
        var parentFolder = await Folder.findOne({ _id: parentFolderID }).populate({
            path: 'folders',
            model: 'Folder',
        })

        if (folder.parentFolder){
          var folderParentFolder = await Folder.findOne({ _id: folder.parentFolder._id.toString() }).populate({
            path: 'folders',
            model: 'Folder',
          })
        }

        //see T1

        if (parentFolder.generation + folder.generation > 5){
          console.log("Error, too many generations");
          throw new ApolloError("folder move error")
        }

       console.log("2");
        //error catch - cant re-add folder
        if (folder.parentFolder){
          if (folder.parentFolder._id.toString() === parentFolderID.toString()) {
            console.log("Error, cant re-add folder");
            throw new ApolloError("folder move error")
          }
        }
        console.log("3");
        
        //error catch - child cant be parent of its parent
        if (parentFolder.parentFolder){
          if (parentFolder.parentFolder._id.toString() === folderID.toString()){
            console.log("Error, cant make parent folder be your child folder");
            throw new ApolloError("folder move error")
          }
        }
        console.log("4");
        //FIX - create seperate algorithm
        //error catch - child cant be parent of its grandparents
        if (parentFolder.parentFolder){
          //loop through each parent, parent parent, parent parent parent, etc
          // do if statement
          console.log("4-1");
          var maxGenerations = 6 //FIX <---
          var i
          //initial value starts at grandparent of child
          var nextparentID = parentFolder.parentFolder._id //w4 child, tf w3
          for (i = 0; i < maxGenerations; i++){
            //console.log("4-2 loop");
            //console.log("nextparentID - begin", nextparentID);
            var currentparent = await Folder.findOne({ _id: nextparentID })
            //console.log("currentparent", currentparent);
            //console.log("currentparent.parentFolder", currentparent.parentFolder);
            if (currentparent.parentFolder){
              //console.log("4-3 loop-if");
              //console.log("currentparent.parentFolder.toString()", currentparent.parentFolder.toString());
              if (currentparent.parentFolder.toString() === folderID.toString()){
                console.log("Error, child cannot be grandparent");
                throw new ApolloError("folder move error")
              }
              //console.log("currentparent.parentFolderID", currentparent.parentFolder);  
              if (currentparent.parentFolder){
                nextparentID = currentparent.parentFolder
                //console.log("nextparentID - end", nextparentID);
              }
            }
          }
        }
        console.log("5");

        console.log(parentFolderID);
        console.log("6 - generation check begin");
        
        // generation check
        /*Algorithm description:
        Requirements: parentFolder, folder
        Loops up parents to find highest generation number.
        If GN + 1 = Generation Limit, then limit has been reached (assumes generation limit has never been breached)
        If the parent's GN greater than child's GN by 2 or more, then limit cant be reached (error check ends)
        **This algorithm essencially mocks the GN that will be implemented on folder move
        */
        if (folder.generation === 4){ //here the max generation is set <- FIX THIS
          console.log("Error, too many generations");
          throw new ApolloError("folder move error")
        } else{
          console.log("20-1");
          var maxGenerations = 6 // temp fix: this only sets the max loops for our for loop (should be 1 greater than max generation set) see FIX THIS below
          var i
          var generationsFound = 0
          

          //if initial child GN >= initial parent GN, initial GN set to child's GN + 1
          if (parentFolder.generation <= folder.generation){
              generationsFound = folder.generation + 1
          }
          console.log("init generationsFound",generationsFound);
          
          var nextparentID = parentFolderID

          for (i = 0; i < maxGenerations; i++){

            var currentparent = await Folder.findOne({ _id: nextparentID })
            //parentFolder found
            if(i===0){
              //first iteration, we cant assume parent has a parent
              //If no grandparent found (and GN limit not breached), we end error check
              if (generationsFound === 4){ //here the max generation is set <- FIX THIS
                console.log("Error, too many generations");
                throw new ApolloError("folder move error")
              }
              if (currentparent.parentFolder){
                nextparentID = currentparent.parentFolder
              } else {break}
            }else{
              console.log(currentparent.generation, generationsFound, "i", i);
              //generationsFound would be the child's hypothetical new GN to be implemented 
              //(by extension making parent's hypthoetical new GN be GF + 1), if they are the same, the GN difference is 1
              // if difference is not 1, then it must be > 2, then we end error check
              if (currentparent.generation - generationsFound === 0){generationsFound = currentparent.generation + 1} else {break}
              console.log("a");
              
              if (generationsFound === 4){ //here the max generation is set <- FIX THIS
                console.log("Error, too many generations");
                throw new ApolloError("folder move error")
              }
              console.log("b");
              //check if theirs a grandparent, and if not, break
              if (currentparent.parentFolder){
                console.log("c");
                
                nextparentID = currentparent.parentFolder
              } else {break}
            }
          }

          console.log("final generations found", generationsFound);
          
        }
        //see C4
        console.log("6 - generation check complete");
        //scenario, child already has parent, remove child from old parent
        if (folder.parentFolder){ 

          //GENERATION: CF'S PFs GN to be updated
          //GENERATION: update CF's old PFs GNs  //please note - this function is identical
          //see C2
          generationUpdateChildRemoval(folder)

          // remove CF from CF's PF folders
          const pfolder = await Folder.findById(folder.parentFolder._id);
          var filteredpfolder = pfolder.folders.filter( x => x._id.toString() !== folderID )
          pfolder.folders = filteredpfolder
          pfolder.save();

          /* THIS PULL FUNCTION DOES NOT WORK, NEED TO TEST IN LESS COMPLEX ENVIRONEMENT  ^^ WORKAROUND
          await Folder.findByIdAndUpdate( 
            { _id: folder.parentFolder._id.toString() }, 
            { $pull: { folders: { _id: folderID } } }) */

        }
      
        //concat CF in PF's folders
        //GENERATION: update PFs GN
        //GENERATION: update CF's new PFs GNs  //please note - this function modified
        generationUpdateChildAddition(folderID, parentFolderID)
        //see C1

        //potential problem: what if 1 of these methods fails? (code robustness - mongoose has more robust methods)
        await Folder.findByIdAndUpdate(
          {_id: parentFolderID}, 
          {folders: parentFolder.folders.concat(folder)}, //error: already in folder? concats again..
          { runValidators: true })

        //set CF's parentFolder to PF
        await Folder.findByIdAndUpdate(
          {_id: folderID}, 
          {"$set": {"rootFolder": false, "parentFolder": parentFolder} },
          { runValidators: true })

    
           
        console.log("--------END-------");
        //var parentFinal
        //var childFinal
          
        //see T2
      }
    }
  }
}


/* COMMENTS FOOTER -----------------

Retries
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

  R2

          userFolders1 = await User.findOne({ username: currentUser.username })
            userFolders2 = await User.findOne({ username: currentUser.username }).populate({
              path: 'folders',
              model: 'Folder',
            })
            userFolders3 = await User.findOne({ username: currentUser.username }).populate({
              path: 'folders',
              model: 'Folder',
              populate: {
                path: 'user',
                model: 'User'
              }
            })
            console.log("uF1:", userFolders1);
            console.log("uF2:", userFolders2);
            console.log("uF3:", userFolders3);
            console.log("title", userFolders3.folders[0].title);
            console.log("user", userFolders3.folders[0].user.username);
            

Equations
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




Tests
  T1
      //console.log("ID, folder.parentFolder.id:", folder.parentFolder._id); //object type
      //console.log("ID, parentFolderID:", parentFolderID);
      //console.log("compare", folder.parentFolder._id.toString() === parentFolderID.toString());
      
      // error catch - too many generations (child has children)
      // temp solution: child cant have children

      //this is only 1 scenario (what if child doesnt have children put its added to bigger tree?)
      //console.log(folder.folders.length > 0 );
      //console.log(!parentFolder.rootFolder);
  
      to find generations..
      var generations
      while ()

              //TESTING
        //console.log("before, folder:", folder);
        //console.log("before, parentFolder:", parentFolder);
        //console.log("before, folderParentFolder:", folderParentFolder);
        
        //TESTING END
  
  T2
  
          //TESTING
        
        var folder = await Folder.findOne({ _id: folderID })
        var parentFolder = await Folder.findOne({ _id: parentFolderID }).populate({
          path: 'folders',
          model: 'Folder',
        })
        console.log("after, folder:", folder);
        console.log("after, parentFolder:", parentFolder);
        
        //TESTING END

Code
  C1
  
                     console.log("8-1");
                   var maxGenerations = 6
                   var i
                   //initial value starts at grandparent of child
                   var nextparentID = parentFolderID
                   var lastparentID = folderID
                   for (i = 0; i < maxGenerations; i++){
                     console.log("8-2 loop", i);
                     //console.log("nextparentID - begin", nextparentID);
                     //console.log("lastparentID - begin", lastparentID);
                     var currentparent = await Folder.findOne({ _id: nextparentID })
                     var currentChild = await Folder.findOne({ _id: lastparentID })
                     console.log("currentparent", currentparent.title, currentparent.generation);
                     console.log("currentChild", currentChild.title, currentChild.generation);
                     //compare generation numbers and update
         
                     //quick fix
                  
                     
                      if (currentparent.generation <= currentChild.generation){
                        
                        currentparent.generation = currentChild.generation + 1
                        currentparent.save()
                        console.log("8-3 currentparent + 1");
                      }
        
                     if (currentparent.parentFolder){
                       lastparentID = nextparentID
                       nextparentID = currentparent.parentFolder //rename parentFolder to parentFolderID
                       //console.log("new lastparentID", lastparentID);
                       //console.log("new parent ID found", nextparentID);
                       console.log("8-4 parent found");
                       
                     } else {
                       break
                     }
                   }


  C2


                console.log("7-1");
              var maxGenerations = 6
              var i
              //initial value starts at grandparent of child
              var nextparentID = folder.parentFolder._id 
              var lastparentID = folderID
              for (i = 0; i < maxGenerations; i++){
                console.log("7-2 loop", i);
                //console.log("nextparentID - begin", nextparentID);
                //console.log("lastparentID - begin", lastparentID);
                var currentparent = await Folder.findOne({ _id: nextparentID })
                var currentChild = await Folder.findOne({ _id: lastparentID })
                console.log("currentparent", currentparent.title, currentparent.generation);
                console.log("currentChild", currentChild.title, currentChild.generation);
                //compare generation numbers and update

                //quick fix
                var minus
                if (i===0){minus = 1} else {minus = 2}
                console.log(currentparent.generation - minus);
                console.log(currentChild.generation);
                
                
                if ((currentparent.generation - minus) === currentChild.generation){
                    console.log("currentparent.folders.length", currentparent.folders.length);
                    
                   if(currentparent.folders.length === 1){
                    currentparent.generation = currentparent.generation - 1
                    currentparent.save()
                    console.log("7-3 currentparent - 1");
                   }
                }
                if (currentparent.parentFolder){
                  lastparentID = nextparentID
                  nextparentID = currentparent.parentFolder //rename parentFolder to parentFolderID
                  //console.log("new lastparentID", lastparentID);
                  //console.log("new parent ID found", nextparentID);
                  console.log("7-4 parent found");
                } else {
                  break
                }
              }


  C3

               console.log("14-1");
              var maxGenerations = 6
              var i
              //initial value starts at grandparent of child
              var nextparentID = folder.parentFolder._id 
              var lastparentID = folderID
              for (i = 0; i < maxGenerations; i++){
                console.log("14-2 loop", i);
                //console.log("nextparentID - begin", nextparentID);
                //console.log("lastparentID - begin", lastparentID);
                var currentparent = await Folder.findOne({ _id: nextparentID })
                var currentChild = await Folder.findOne({ _id: lastparentID })
                console.log("currentparent", currentparent.title, currentparent.generation);
                console.log("currentChild", currentChild.title, currentChild.generation);
                //compare generation numbers and update

                //quick fix
                var minus
                if (i===0){minus = 1} else {minus = 2}
                console.log(currentparent.generation - minus);
                console.log(currentChild.generation);
                
                
                if ((currentparent.generation - minus) === currentChild.generation){
                    console.log("currentparent.folders.length", currentparent.folders.length);
                    // don't lower generation if other folders still present
                   if(currentparent.folders.length === 1){
                    currentparent.generation = currentparent.generation - 1
                    currentparent.save()
                    console.log("14-3 currentparent - 1");
                   }
                }
                if (currentparent.parentFolder){
                  lastparentID = nextparentID
                  nextparentID = currentparent.parentFolder //rename parentFolder to parentFolderID
                  //console.log("new lastparentID", lastparentID);
                  //console.log("new parent ID found", nextparentID);
                  console.log("14-4 parent found");
                } else {
                  break
                }
              }
            

  C4

         if (parentFolder.parentFolder){ // THIS IS FLAWED
          //loop through each parent, parent parent, parent parent parent, etc
          // do if statement
          console.log("20-1");
          var maxGenerations = 6
          var i
          var generationsFound = 0
          //initial value starts at grandparent of child
          var nextparentID = parentFolder.parentFolder // FLAWED! SHOULDNT RELIE ON GRANDPARENT
          for (i = 0; i < maxGenerations; i++){

            var currentgrandparent = await Folder.findOne({ _id: nextparentID })
            //parentFolder found
            
            generationsFound = currentgrandparent.generation
            console.log(generationsFound);
            if (generationsFound === 3){
              console.log("Error, too many generations");
              throw new ApolloError("folder move error")
            }
            if (currentgrandparent.parentFolder){
              nextparentID = currentgrandparent.parentFolder
            }
            
          }
        } else {
          console.log("other generation check");
          
          if ( folder.generation === 3 ||  parentFolder.generation >= 3) {  //FLawed! IF PARENT GENERATION IS MAX, BUT ADDITIONS TILL ALLOWED (CHILD < 1), THIS WILL BLOCK ADDITION
            console.log("Error, too many generations");
            throw new ApolloError("folder move error")
          }
       }

      C5

                //compare generation numbers and update
          //quick fix
          //var minus
          //if (i===0){minus = 1} else {minus = 1}  //change from 2 to 1
          //console.log(currentparent.generation - minus);
          //console.log(currentChild.generation);
          //compare
          //check if the generation difference GD is 1 (or 2)


      C6

                    
                            var found = false

              //searching for GN where GD is 1         what if we just moved/delete highest GN?
              currentparent.folders.map((subFolder) => {
                if (currentparent.generation - subFolder.generation === 1) {
                  found = true
                }
              })
              if (!found){
                currentparent.generation = currentparent.generation - 1
                currentparent.save()
                console.log("14-5 currentparent - 1");
              }
              
              
*/