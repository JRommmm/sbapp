import React, { useState } from 'react'

import { useDrag, useDrop } from 'react-dnd'
//

const ItemTypes = {
    FOLDER: 'folder'
  }

const EditableText2 = (props: {text, outerTextFunction}) => {
	//state example
    //const [ clicked, setClicked ] = useState(false)
    const [textField, setTextField] = useState(props.text) //2.1 -> folder object being given (props.text is a folder object)

    const [clickState, setClickState] = useState(0)
    //form with states example
    const [{ isDragging }, drag] = useDrag({
        item: { type: ItemTypes.FOLDER },
        collect: (monitor) => ({
          isDragging: !!monitor.isDragging()
        })
      })

    const [{ isOver }, drop] = useDrop({
        accept: ItemTypes.FOLDER,
        drop: () => console.log("drop confirmed!"),
        collect: (monitor) => ({
          isOver: !!monitor.isOver()
        })
      })
/*
    const myStyles = {
        width: '200px',
      }
*/
    const inputmyStyles = {
        width: '100px', //temp solution
      }

      /*
    const clickFunction = (e) => {
        e.preventDefault()
        setClicked(!clicked)
    }
    */

    const firstClick = (e) => {
        e.preventDefault()
        console.log("Notes open function");
        setClickState(clickState + 1) 
    }

    const defaultClickState = (e) => {
        console.log("default state called");
        setClickState(0) 
    }

    const textChangeFunction = (e) => {
        //e.preventDefault()
        setTextField(e)
    }

    const handleFocus = (event) => {
      //console.log("On Focus");
      event.target.select();
    }
    //console.log(clicked)
    if (clickState === 0 || clickState === 1){ //first click
        return(
    
            <div onClick={(e)=>firstClick(e)} ref={drag}
            style={{
              opacity: isDragging ? 0.5 : 1,
              //cursor: 'move',
              width: '100px' //temp solution
              
            }} > <div ref={drop}> {textField} </div> </div> 
            
            )
    } else {
        return(
            <div> <input 
            onBlur={(e) => defaultClickState(e)} 
            style={inputmyStyles}
            value={textField} 
            onChange={({ target }) => textChangeFunction(target.value)}
            onFocus={handleFocus}
            autoFocus /> </div>
            )
    }
}

export default EditableText2
