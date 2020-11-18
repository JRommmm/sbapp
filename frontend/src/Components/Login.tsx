import React, { useState, useEffect } from 'react'
import { useMutation } from '@apollo/client'
import { ApolloError } from "apollo-server-core"
//import { onError } from "@apollo/client/link/error";
import { LOGIN, CREATEUSER } from '../queries'
import { GraphQLError } from 'graphql'

const LoginForm = ({ setError, setToken, show}) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [newusername, setnewUsername] = useState('')
  const [newpassword, setnewPassword] = useState('')

  const [ login, result ] = useMutation(LOGIN,  {
    onError: ({ graphQLErrors, networkError }) => {
      if (graphQLErrors[0]){ 
        setError(graphQLErrors[0].message) // local error handling
        //throw new ApolloError("not authenticated") // higher error handling <-- this error goes in the backend!
      }
      else {
        if (networkError){
         setError("Network Error occured")
         //setError(networkError)  <-- error
        } else {
          console.log("unknown");
        }
      }
    }
  })

  const [ createUser, resultCreate ] = useMutation(CREATEUSER, {
    onError: ({ graphQLErrors, networkError }) => {
      if (graphQLErrors[0])   
        setError(graphQLErrors[0].message)
      else if (networkError)
         console.log(`[Network error]: ${networkError}`);
         setError("Network Error occured")
          //setError(networkError)  <-- error
    }
  })

  if (resultCreate.data){
    console.log("user created!")
  }

  useEffect(() => {
    if ( result.data ) {
      const token = result.data.login.value
      setToken(token)
      localStorage.setItem('user-token', token) //EDIT
    }
  }, [result.data]) // eslint-disable-line

  const submit = async (event) => {
    event.preventDefault()

    login({ variables: { username, password } })
  }

  const autoLoggin = async () => {
    setUsername("johnjohnjohn")
    setPassword("12345")
  }

  const submitNew = async (event) => {
    event.preventDefault()
    createUser({ variables: { newusername, newpassword } })
  }

  if (!show) {
    return null
  }

  return (
    <div>
    <div>
      <form onSubmit={submit}>
        <div>
          username <input
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password <input
            type='password'
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type='submit'>login</button>
      </form>
    </div>

    <div>
    <form onSubmit={submitNew}>
      <div>
        username <input
          value={newusername}
          onChange={({ target }) => setnewUsername(target.value)}
        />
      </div>
      <div>
        password <input
          type='password'
          value={newpassword}
          onChange={({ target }) => setnewPassword(target.value)}
        />
      </div>
      <button type='submit'>create account</button>
    </form>
    </div>
    <button onClick={() => autoLoggin()}> Auto Fill</button>
    </div>
  )
}

export default LoginForm



/*
    onError: ({ graphQLErrors, networkError }) => {
      if (graphQLErrors){
        console.log("grapherror-1", graphQLErrors)
        if (graphQLErrors){
          console.log("grapherror-2")
          graphQLErrors.map(({ message, locations, path }) =>
            console.log('message', message, 'location', locations)

            console.log(
              `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
            ),

           );
          }
 
        } else if (networkError)
          setError(networkError[0].message)  
      }
 
      }
    }
    })

*/
  /*
  ORIGINAL LOGIN

    const [ login, result ] = useMutation(LOGIN, {
      onError: (error) => {
        setError(error.graphQLErrors[0].message)
      }
    })
  */



  /* FINAL NEW login::

    const [ login, result ] = useMutation(LOGIN, {
    onError: ({ graphQLErrors, networkError }) => {
      console.log(graphQLErrors[0]);
      
      if (graphQLErrors[0]){ 
        console.log(graphQLErrors[0]); 
        setError(graphQLErrors[0].message)
      }
      else {
        if (networkError){
         console.log(`[Network error]: ${networkError}`);
         setError("Network Error occured")
        } else{
          console.log("unknown");
        }
          //setError(networkError)  <-- error
      }
    }
  })

  */
