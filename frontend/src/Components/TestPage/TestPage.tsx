import React from 'react'
import FormExample from './FormExample'
import StateExample from './StateExample'

const TestPage = ({show}) => {

	return(
	  <div>
	    <p>Hello world</p>
	    <p> This app will begin with generic functions to begin setup... </p>
		<StateExample />
		<FormExample />		
	  </div>
	)
}

export default TestPage