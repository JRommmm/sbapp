import React, { useState } from 'react'
import Note from './Note'

const FormExample = () => {

	//form with states example
	const [notes, setNotes] = useState([])
	const [newNote, setNewNote] = useState('')


	const addNote = (event) => {
		event.preventDefault()
		const noteObject = {
		  content: newNote,
		  date: new Date().toISOString(),
		  important: Math.random() > 0.5,
		  id: notes.length + 1,
		}
	  
		setNotes(notes.concat(noteObject))
		setNewNote('')
	  }

	const handleNoteChange = (event) => {
		console.log(event.target.value)
		setNewNote(event.target.value)
	  }
	return(

        <div>
		<h3>Form rendering state list of: </h3>
        <h2>Notes</h2>
		<div>
		</div>      
		<ul>
		{notes.map((note, i) => 
			<Note key={i} note={note} />
		)}
		</ul>
		<form onSubmit={addNote}>
		<input
			value={newNote}
			onChange={handleNoteChange}
		/>
		<button type="submit">save</button>
		</form>

		<p> Some javascript outputs to practice: (see console log)</p>   
		</div>

	)
}

export default FormExample