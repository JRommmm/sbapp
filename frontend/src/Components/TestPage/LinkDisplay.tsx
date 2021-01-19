import React, { useState } from 'react'

import { useDrag, useDrop } from 'react-dnd'
//
//change item type to notes
const ItemTypes = {
    FOLDER: 'folder'
  }

const LinkDisplay = (props: {text}) => {
	//state example
    //const [ clicked, setClicked ] = useState(false)
    const [textField, setTextField] = useState(props.text)

    const [clickState, setClickState] = useState(false)
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

    const Click = (e) => {
        e.preventDefault()
        console.log("Text Area is displayed");
        setClickState(true) 
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
 //first click
    return(
    
            <div onClick={(e)=>Click(e)} ref={drag}
            style={{
              opacity: isDragging ? 0.5 : 1,
              //cursor: 'move',
              width: '150px' //temp solution
              
            }} > <div ref={drop}> {textField} </div> </div> 
            
            )

}

export default LinkDisplay