export {}; //https://medium.com/@muravitskiy.mail/cannot-redeclare-block-scoped-variable-varname-how-to-fix-b1c3d9cc8206
const { ApolloServer, UserInputError, gql, AuthenticationError } = require('apollo-server')
const { ApolloError } = require("apollo-server-core")
const { v1: uuid } = require('uuid')

const mongoose = require('mongoose')

const User = require('./models/User')
const Folder = require('./models/Folder')

const configuration = require('./utilities/configurations')
const logger = require('./utilities/logger')

const jwt = require('jsonwebtoken')
const JWT_SECRET = configuration.JWT_SECRET

const bcrypt = require('bcrypt')

const { merge } = require('lodash');

import { typeDefs as FolderDefs, resolvers as FolderResolvers } from './resolvers/folder.js';

const MONGODB_URI = configuration.MONGODB_URI

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })

logger.resolvers("", "BEGIN")

const typeDefs = gql`

  type User {
    username: String!
    passwordHash: String!
	  id: ID!
  }

  type Token {
  	value: String!
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
  }
  type Query {
    me: User
  }
`
//you can now throw appollo erros like so
//throw new ApolloError("not authenticated")
const resolvers = {
  Query: {
    me: (root, args, context) => { // use this query to identify current user!
    	return context.currentUser
    },  
  },
  Mutation: {
    createUser: async (root, args) => { 
      logger.resolvers("inside createUser Mutation", "M_createUser")
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
      logger.resolvers("inside login mutation - login-0", "M_login")
      //check user and password match <----
      const user = await User.findOne({ username: args.username })
      const passwordCorrect = user === null
      ? false
      : await bcrypt.compare(args.password, user.passwordHash)
      logger.resolvers("login-1: check user and password match", "M_login") 
      if (!(user && passwordCorrect)) {
          throw new UserInputError("wrong credentials") //throw new ApolloError("not authenticated")         
      }
      logger.resolvers("login-2: convert to web token", "M_login")  //convert to web token
	    const userForToken = {
	      username: user.username,
	      id: user._id,
      }
      logger.resolvers("login-3: return", "M_login") 
	    return { value: jwt.sign(userForToken, JWT_SECRET) }
    }
  }
}

const server = new ApolloServer({
  typeDefs: [typeDefs, FolderDefs],
  resolvers: merge(resolvers, FolderResolvers),
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

//logger.resolvers("", "END")
server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
