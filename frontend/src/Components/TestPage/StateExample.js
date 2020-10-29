import React, { useState } from 'react'

const StateExample = () => {
	//state example
	const [ counter, setCounter ] = useState(0)
	//form with states example
	return(
	  <div>
	    <h3> Component rendering using States: </h3>

	    <div>{counter}</div>
        <button onClick={() => setCounter(counter + 1)}>
          plus
        </button>
        <button onClick={() => setCounter(0)}> 
          zero
        </button>


		
		</div>
	)
}

export default StateExample
