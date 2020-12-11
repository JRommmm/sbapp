import React, { useState } from 'react'

import { useDrag, useDrop } from 'react-dnd'
//

const ItemTypes = {
    FOLDER: 'folder'
  }

const EditableText = (props: {text, outerTextFunction}) => {
	//state example
    const [ clicked, setClicked ] = useState(false)
    const [textField, setTextField] = useState(props.text)
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
        width: '150px', //temp solution
      }

    const clickFunction = (e) => {
        e.preventDefault()
        setClicked(!clicked)
    }

    const blurFunction = (e) => {
        setClicked(!clicked)
    }

    const textChangeFunction = (e) => {
        //e.preventDefault()
        setTextField(e)
    }

    const handleFocus = (event) => {
      console.log("On Focus");
      event.target.select();
    }
    console.log(clicked)

    if (clicked){ //first click
        return(
        <div> <input 
        onBlur={(e) => blurFunction(e)} 
        style={inputmyStyles}
        value={textField} 
        onChange={({ target }) => textChangeFunction(target.value)}
        onFocus={handleFocus}
        autoFocus /> </div>
        )
    } else {
	return( 
    
    <div onClick={(e)=>clickFunction(e)} ref={drag}
    style={{
      opacity: isDragging ? 0.5 : 1,
      //cursor: 'move',
      width: '150px' //temp solution
      
    }} > <div ref={drop}> {textField} </div> </div> 
    
    )
    }
}

export default EditableText


//<div onClick={(e)=>clickFunction(e)} style={myStyles} > {textField} </div> 