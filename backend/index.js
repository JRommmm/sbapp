const { ApolloServer, UserInputError, gql, AuthenticationError } = require('apollo-server')
const { v1: uuid } = require('uuid')

const mongoose = require('mongoose')

const User = require('./models/User')
const Folder = require('./models/Folder')

const jwt = require('jsonwebtoken')
const JWT_SECRET = 'NEED_HERE_A_SECRET_KEY'

const bcrypt = require('bcrypt')

const configuration = require('./utilities/configurations')
const logger = require('./utilities/logger')

const MONGODB_URI = configuration.MONGODB_URI
//
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })

//global.resolver_logs =[]



const typeDefs = gql`
  type Person {
    name: String!
    phone: String
    street: String!
    city: String! 
    id: ID!
  }

  type User {
    username: String!
    passwordHash: String!
	  id: ID!
  }

  type Token {
  	value: String!
  }

  type Folder {
  	title: String
  }

  type Mutation {

	  createUser(
      username: String!
      password: String!
	  ): User

    login(
	    username: String!
	    password: String!
    ): Token
    
    addFolder(
	    title: String!
	  ): Folder
  }

  type Query {
    me: User
    personCount: Int!
    allPersons: [Person!]!
    findPerson(name: String!): Person
    allFolders: [Folder]
  }
`

const resolvers = {
  Query: {
    me: (root, args, context) => { // use this query to identify current user!
    	return context.currentUser
    },  
    personCount: () => persons.length,
    allPersons: () => persons,
    findPerson: (root, args) =>
      persons.find(p => p.name === args.name),
    allFolders: async (root, args, context) => { 


        console.log("inside allFolders");
        const currentUser = context.currentUser

        if (!currentUser) {
          throw new AuthenticationError("not authenticated")
        }
        //console.log("inside allFolders - authentication passed", currentUser);
        //console.log("currentUser.username:", currentUser.username)
        try {
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

          userFolders = await User.findOne({ username: currentUser.username }).populate({
            path: 'folders',
            model: 'Folder',
          })
          
        } catch (error) {
          /*throw new UserInputError(error.message, {
            invalidArgs: args,
          })
          */
         console.log(error, "retrieving folders failed. Need to handle this error")
        }
        //console.log("inside allFolders - userFolders retrieved - before return", userFolders);
        //console.log("userFolders.folders:", userFolders.folders);
        return userFolders.folders
    }
  },
  Mutation: {
    createUser: async (root, args) => { 
      console.log("enter createUser Mutation")
      const saltRounds = 10
      const passwordHash = await bcrypt.hash(args.password, saltRounds)

	    const user = new User({ username: args.username, passwordHash: passwordHash })

	    return user.save()
	      .catch(error => {
	        throw new UserInputError(error.message, {
	          invalidArgs: args,
	        })
        })
      
	},
    login: async (root, args) => {
      console.log("enter login mutation");
      console.log("args.username:", args.username);

      //check user and password match <----
      const user = await User.findOne({ username: args.username })
      const passwordCorrect = user === null
      ? false
      : await bcrypt.compare(args.password, user.passwordHash)
      
      console.log("login-1: check user and password match"); 
      if (!(user && passwordCorrect)) {
          throw new UserInputError("wrong credentials")
        }


      console.log("login-2: convert to web token"); //convert to web token
	    const userForToken = {
	      username: user.username,
	      id: user._id,
      }
      
      console.log("login-3: return");
	    return { value: jwt.sign(userForToken, JWT_SECRET) }
      },
    addFolder: async (root, args, context) => { 
        const folder = new Folder({ 
          title: args.title 
        })
        const currentUser = context.currentUser

        if (!currentUser) {
          throw new AuthenticationError("not authenticated")
        }
        try {
          await folder.save()
          currentUser.folders = currentUser.folders.concat(folder)
          await currentUser.save()
        } catch (error) {
          throw new UserInputError(error.message, {
            invalidArgs: args,
          })
        }
        return folder    
          
        //return { value: "string"}
    },
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    //console.log("inside context");
    //console.log(req.headers.authorization); //decodes the token to give current user info
    const auth = req ? req.headers.authorization : null
    if (auth && auth.toLowerCase().startsWith('bearer ')) {
      const decodedToken = jwt.verify(
        auth.substring(7), JWT_SECRET
      )
      const currentUser = await User.findById(decodedToken.id)
      //console.log(currentUser)
      return { currentUser }
    }
  }
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})