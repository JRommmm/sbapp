import React, { useState } from 'react'

import { useDrag, useDrop } from 'react-dnd'
//

const ItemTypes = {
    FOLDER: 'folder'
  }

const EditableText1 = (props: {text, outerTextFunction}) => {
	//state example
    const [ clicked, setClicked ] = useState(false)
    const [textField, setTextField] = useState(props.text)

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
        width: '150px', //temp solution
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
        setClickState(1) 
    }

    const secondClick = (e) => {
        e.preventDefault()
        setClickState(2) 
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

    switch(clickState){
        case 0:
            return(
    
                <div onClick={(e)=>firstClick(e)} ref={drag}
                style={{
                  opacity: isDragging ? 0.5 : 1,
                  //cursor: 'move',
                  width: '150px' //temp solution
                  
                }} > <div ref={drop}> {textField} </div> </div> 
                
                )
        case 1:
            return(
    
                <div onClick={(e)=>secondClick(e)} onBlur={(e) => defaultClickState(e)} ref={drag}
                style={{
                  opacity: isDragging ? 0.5 : 1,
                  //cursor: 'move',
                  width: '150px' //temp solution
                  
                }} > <div ref={drop}> {textField} </div> </div> 
                
                )
        case 2:
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

export default EditableText1


//<div onClick={(e)=>clickFunction(e)} style={myStyles} > {textField} </div> 