const { ApolloServer, UserInputError, gql, AuthenticationError } = require('apollo-server')
const { v1: uuid } = require('uuid')

const mongoose = require('mongoose')

const User = require('./models/User')

const jwt = require('jsonwebtoken')
const JWT_SECRET = 'NEED_HERE_A_SECRET_KEY'

const bcrypt = require('bcrypt')

const configuration = require('./utilities/configurations')
const MONGODB_URI = configuration.MONGODB_URI
//
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })

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
    personCount: Int!
    allPersons: [Person!]!
    findPerson(name: String!): Person
  }
`

const resolvers = {
  Query: {
    me: (root, args, context) => {
    	return context.currentUser
    },  
    personCount: () => persons.length,
    allPersons: () => persons,
    findPerson: (root, args) =>
      persons.find(p => p.name === args.name)
  },
  Mutation: {
    createUser: async (root, args) => { 
      console.log("inside createUser Mutation!!!!")
      const saltRounds = 10
      const passwordHash = await bcrypt.hash(args.password, saltRounds)

	    const user = new User({ username: args.username, passwordHash: passwordHash })

	    return user.save()
	      .catch(error => {
	        throw new UserInputError(error.message, {
	          invalidArgs: args,
	        })
        })
        
      //return { value: "string"}
	},
    login: async (root, args) => {
      console.log("enter login");

      console.log(args.username);
      
      /*const currentUser = context.currentUser
      console.log(currentUser);
      if (currentUser) {
        throw new AuthenticationError("already authenticated")
      }
      */

      console.log("0");
      const user = await User.findOne({ username: args.username })
      const passwordCorrect = user === null
      ? false
      : await bcrypt.compare(args.password, user.passwordHash)
      
      console.log("1");  //check user and password match <----

      if (!(user && passwordCorrect)) {
          throw new UserInputError("wrong credentials")
        }
      
      /*
	    if ( !user || args.password !== 'secred' ) { //<--- args.password !== user.
	      throw new UserInputError("wrong credentials")
      }
      */
      console.log("2"); 
	    const userForToken = {
	      username: user.username,
	      id: user._id,
	    }
      console.log("3"); //convert to web token
	    return { value: jwt.sign(userForToken, JWT_SECRET) }
	  	},
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    console.log("inside context");
    console.log(req.headers.authorization); //decodes the token to give current user info
    const auth = req ? req.headers.authorization : null
    if (auth && auth.toLowerCase().startsWith('bearer ')) {
      const decodedToken = jwt.verify(
        auth.substring(7), JWT_SECRET
      )
      const currentUser = await User.findById(decodedToken.id)
      return { currentUser }
    }
  }
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})