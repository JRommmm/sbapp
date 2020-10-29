import React, { createContext, useState } from 'react'
import HomePage from './Components/Home'
import TestPage from './Components/TestPage/TestPage'
import LoginForm from './Components/Login'
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom"

import { gql, useQuery, useApolloClient } from '@apollo/client';

const App = () => {
	const [page, setPage] = useState('login')
	const [token, setToken] = useState(null)
	const [errorMessage, setErrorMessage] = useState(null)
	const client = useApolloClient()

	const notify = (message) => {
		setErrorMessage(message)
		setTimeout(() => {
		  setErrorMessage(null)
		}, 5000)
	  }

	const padding = {
		padding: 5
	  }
	
	const logout = () => {
		setToken(null)
		localStorage.clear()
		client.resetStore()
	  }

	const authToken = localStorage.getItem('user-token')

	if (!authToken){
		return (
		//console.log("not logged in")
		<div><LoginForm
		setToken={setToken}
		setError={notify}
		show={page === 'login'}
		/>
		</div> ) } else {
		console.log("logged in");

		return(
			<div>
		  <Router>
			<div>
			  <Link style={padding} to="/">Home</Link>
			  <Link style={padding} to="/testpage">Test Page</Link>
			  <button onClick={() => logout()}>logout</button>
			</div>
	  
			<Switch>
			  <Route path="/testpage">
				<TestPage />
			  </Route>
			  <Route path="/">
				<HomePage />
			  </Route>
			</Switch>
	  
		  </Router>
	
	
	
			</div>
	
		)
	}
}

export default App


//<div> Error: {errorMessage} </div>

//use this space for testing javascript code
/*
function getCoordinates() {
	let x, y, z;
	// do stuff to get coordinates
	x=3
	y=4
	z=6
	return [x, y, z];
  }

const [Ax, Ay, Az] = getCoordinates()
console.log('Ax', Ax)
console.log('Ay', Ay)
console.log('Az', Az)

var x = [0];
if (x) {
	console.log('true statement')
} else {
	console.log('false statement')
}
*/
//^^^^^--------------------------------
