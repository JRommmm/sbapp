import React, { useState } from 'react'

import { useDrag, useDrop } from 'react-dnd'
//

const ItemTypes = {
    FOLDER: 'folder'
  }

const EditableText21 = (props: {folder, outerTextFunction, updateFolder}) => {
	//state example
    //const [ clicked, setClicked ] = useState(false)
    const originalTitle = props.folder.title
    const [textField, setTextField] = useState(props.folder.title) //2.1 -> folder object being given (props.text is a folder object)

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

    const defaultClickState = (e, folder, updateFolder) => {
        console.log("default state called");
        setClickState(0)
        if (!(textField === originalTitle)){
          updateFolder(e, folder, textField)
        } 
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
            <li>
            <div onClick={(e)=>firstClick(e)} ref={drag}
            style={{
              opacity: isDragging ? 0.5 : 1,
              //cursor: 'move',
              width: '100px' //temp solution
              
            }} > <div ref={drop}> {textField} </div> </div> 
            </li>
            )
    } else {
        return(
          <li>
            <div> <input 
            onBlur={(e) => defaultClickState(e, props.folder, props.updateFolder)} 
            style={inputmyStyles}
            value={textField} 
            onChange={({ target }) => textChangeFunction(target.value)}
            onFocus={handleFocus}
            autoFocus /> </div>
          </li>
            )
    }
}

export default EditableText21