import React, { createContext, useState } from 'react'
import HomePage from './Components/Home'
import TestPage from './Components/TestPage/TestPage'
import TestPage2 from './Components/TestPage/TestPage2'
import TestPage3 from './Components/TestPage/TestPage3'
import LoginForm from './Components/Login'
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom"

import { gql, useQuery, useApolloClient } from '@apollo/client';
import { resolveModuleName } from 'typescript'

import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

//
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

	const padding = { padding: 5 }
	
	const loginScreen = () => {
		return (	
			<div>
			<Notify errorMessage={errorMessage} />
			<LoginForm
				setToken={setToken}
				setError={notify}
				show={page === 'login'}
				/>
			</div> 
	) }
	
	const logout = () => {

		
		setToken(null)
		localStorage.clear()
		client.resetStore()
		setPage('login')
		return loginScreen()

	}

	const authToken = localStorage.getItem('user-token')

	if (!authToken){
		return loginScreen()
	} else {
		return(
		<div>
		  <Notify errorMessage={errorMessage} />
		  <Router>
			<div>
			  <Link style={padding} to="/">Home</Link>
			  <Link style={padding} to="/testpage">Test Page</Link>
			  <Link style={padding} to="/testpage2">Test Page 2</Link>
			  <Link style={padding} to="/testpage3">Test Page 3</Link>
			  <button onClick={() => logout()}>logout</button>
			</div>
  
			<Switch>
			  <Route path="/testpage3" > 
			  	<DndProvider backend={HTML5Backend}>  
				  {/* 
  //@ts-ignore */}	  
				<TestPage3 setError={notify} show={page === 'test'}/>
				</DndProvider> 
		
			  </Route>
			  <Route path="/testpage2" > 
			  	<DndProvider backend={HTML5Backend}>  
				<TestPage2 show={page === 'test'}/>
				</DndProvider> 
			  </Route>
			  <Route path="/testpage" > 
			  	<DndProvider backend={HTML5Backend}>  
				<TestPage setError={notify} show={page === 'test'}/>
				</DndProvider> 
			  </Route>
			  <Route path="/">
				  {/* 
  //@ts-ignore */}	  
				<HomePage setError={notify} show={page === 'home'}/>
			  </Route>
			</Switch>
		  </Router>
		</div>
		)
	}
}
//show={page === 'test'}
//show={page === 'home'}
//show={page === 'login'}

const Notify = ({errorMessage}) => {
	if ( !errorMessage ) { return null }
	return ( <div style={{color: 'red'}}> {errorMessage} </div> )
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


Typescript excercises:

type arr = Array<string>

const last = <T,>(arr: T[]): T => { //<T, > "is the generic type that can be passed into our function"
	return arr[arr.length -1];
}

const l = last([1,2,3]);

const l2 = last(['a', 'b', 'c']); 

const makeArr = <X, Y>(x: X, y: Y): [X, Y] => {
	return [x, y];
}

const v = makeArr(5, 6);
const v2 = makeArr<string | null, number>(null, 6)

const makeFullName = <T extends { firstName: string; lastName: string}>(obj: T) => {
	return {
		...obj,
		fullName: obj.firstName + " " + obj.lastName
	}
}

const v4 = makeFullName({firstName: 'bob',  lastName: "marley", age: 15});
const v5 = makeFullName({another: 'bob',  lastName: "marley", age: 15});

interface Tab<T> {
	id: string,
	position: number,
	data: T
}

type NumberTab = Tab<number>
type StringTab = Tab<string>

interface Props {
	name: string
}

const HW: React.FC<Props> = ({name}) => {
	const [state] = useState<{ fullname: string | null}>({ fullname: ""});
	state.fullname
}

interface FormProps<T> {
	values: T
	children: (values: T) => JSX.Element
}

const Form = <T extends {}>({ values, children}: FormProps<T>) => {
	return children(values);
}

const App1: React.FC = () => {
	return(
		<div>
			<Form<{ lastName: string | null}> values = {{lastName: 'bob'}}> 
			{ (values) => (
				<div>{values.lastName}</div>
			)}
				</Form>
		</div>
	)
}






*/






//^^^^^--------------------------------
