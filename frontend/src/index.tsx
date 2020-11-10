import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

import { ApolloClient, ApolloProvider, HttpLink, InMemoryCache, ApolloLink} from '@apollo/client'
import { onError } from "apollo-link-error";

import { setContext } from '@apollo/link-context'

//https://www.apollographql.com/docs/react/networking/basic-http-networking/
//You can specify the names and values of custom headers to include in every HTTP 
//request to a GraphQL server. To do so, provide the headers parameter to the ApolloClient constructor:
const authLink: ApolloLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('user-token')
  return {
    headers: {
      ...headers,
      authorization: token ? `bearer ${token}` : null,
    }
  }
})

const errorLink = onError(({ graphQLErrors, networkError }) => {
  console.log("in higher order");  
  if (graphQLErrors){ 
    console.log("graphQLErrors in high order error:", graphQLErrors); 
    graphQLErrors.map(({ message }) => {
      console.log("HO message:", message); // if statements for specific graphql errors, u can handle them at a global level
      if (message.includes("not authenticated")){ console.log("HO message - inside includes not authenticated:", message)}
      if (message.includes("wrong credentials")){ console.log("HO message - inside includes wrong credentials:", message);}
    //setError(graphQLErrors[0].message) // local error handling
    //throw new ApolloError("not authenticated") // higher error handling <-- this error goes in the backend!
    })
  }
  else {
    if (networkError){
     console.log(`[Network error in high order]: ${networkError}`);
    } else {
      console.log("unknown");
    }
      //setError(networkError)  <-- error
  }
})


//Apollo Client has built-in support for communicating with a GraphQL server over HTTP. 
//To set up this communication, provide the server's URL as the uri parameter to the ApolloClient constructor:
const httpLink = new HttpLink({
  uri: 'http://localhost:4000',
})


const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: errorLink.concat(authLink.concat(httpLink as any) as any) as any
})


ReactDOM.render( 
    <ApolloProvider client={client}> 
    <App /> 
    </ApolloProvider>, document.getElementById('root'))



/*

const errorLink = onError(({ graphQLErrors, networkError }) => {
  console.log("in higher order");  
  if (graphQLErrors) {
      //console.log("grapherror-2");
      graphQLErrors.map(({ message, locations, path }) => {
        //console.log('In higher order:', 'message', message, 'location', locations);
        if (message.includes("not authenticated")) {
          console.log("in higher order - wrong credentials", message);
          
        }
      }
    )
    }
  }
)
*/