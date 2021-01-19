// creates server with testServer in index
// showing previous attempts

export{}
const { ApolloServer } = require('apollo-server');

const gql = require('graphql-tag')
const { resolvers, typeDefs, FolderDefs, testServer } = require ('../../index');

const createApolloServer = () => {
    // graphql schema definition

    // static list of books
  
    // resolvers: to map queries & mutation to actual functions

    // The ApolloServer constructor
    //console.log("createApolloServer 1");
    //console.log("typeDefs", typeDefs);
    //console.log("FolderDefs", FolderDefs);
    //console.log(typeDefs);
    
    //root of the problem: folders typedefs are different, doesnt have "gql", typedefs in index have this
    const mergetypeDefs2 = [typeDefs, FolderDefs]
    const mergetypeDefs = gql`
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
  //console.log("mergetypeDefs", mergetypeDefs);

  /*
    const server = new ApolloServer({ 
        typeDefs, 
        resolvers,
        
        context: ({ req }) => ({ folders: [],
            _id: '6001050f101a721f96cdffbd',
            username: '99999',
            passwordHash:"$2b$10$8UTFmkORNOZGjUZhnjaFvOyqsfSGkoZEdhoOBPNQmqmk8gdiKP/WG",
            __v: 0 }) 
            
        
        });
        */
       //console.log(test);
    //console.log("testServer", testServer);
    const server = testServer
    //console.log(server);
    
    // we don't run server.listen() here. The server is not yet started.

    console.log("createApolloServer 2");
    return server;
  };

module.exports = createApolloServer;