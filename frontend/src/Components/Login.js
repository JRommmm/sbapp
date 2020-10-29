import React, { useState, useEffect } from 'react'
import { useMutation } from '@apollo/client'
import { LOGIN, CREATEUSER } from '../queries'

const LoginForm = ({ setError, setToken, show }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [newusername, setnewUsername] = useState('')
  const [newpassword, setnewPassword] = useState('')

  const [ login, result ] = useMutation(LOGIN, {
    onError: (error) => {
      setError(error.graphQLErrors[0].message)
    }
  })

  const [ createUser, resultCreate ] = useMutation(CREATEUSER, {
    onError: (error) => {
      console.log("Error in createuser mutation:", error)
    }
  })

  if (resultCreate.data){
    console.log("user created!")
  }



  console.log('result data', result.data);
  useEffect(() => {
    if ( result.data ) {
      console.log("Inside Token being set");
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
    //console.log("inside submit new", newusername, newpassword);//useless
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