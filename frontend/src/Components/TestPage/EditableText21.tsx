import React, { useState } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import { useMutation, useLazyQuery, useQuery } from '@apollo/client'
import { MOVEFOLDER } from '../../queries'

const ItemTypes = {
    FOLDER: 'folder'
  }

const EditableText21 = (props: {folder, updateFolder, setError}) => {

    const originalTitle = props.folder.title
    const originalFolder = props.folder
    const [textField, setTextField] = useState(props.folder.title) //2.1 -> folder object being given (props.text is a folder object)
    const [clickState, setClickState] = useState(0)
    //form with states example

  //MOVE FUNCTION FOR DROP
    const [ moveFolderM, result2 ] = useMutation(MOVEFOLDER, {
      onError: ({ graphQLErrors, networkError }) => {
        if (graphQLErrors[0])   
        props.setError(graphQLErrors[0].message)
        else if (networkError)
        console.log(`[Network error]: ${networkError}`);
        props.setError("Network Error occured")
          //setError(networkError)  <-- error
      },
      //refetchQueries: [{ query: GETFOLDERS } ]
    })

    // DRAG DROP HANDLERS
    // @ts-ignore
    const [{ isDragging }, drag] = useDrag({
      // @ts-ignore
        item: { originalFolder, type: ItemTypes.FOLDER },
        // @ts-ignore
        end: async (item: { originalFolder: Folder } | undefined, monitor: DragSourceMonitor) => {
          const dropResult = monitor.getDropResult()
          if (item && dropResult) {
            console.log(item);
            console.log(item.originalFolder);
            console.log(`You dropped ${item.originalFolder.id} into ${dropResult.id}!`);
            await moveFolderM({ variables: {parentFolder: dropResult.id, folder: item.originalFolder.id}})
          
          }
        },
        collect: (monitor) => ({
          isDragging: !!monitor.isDragging()
        })
      })

    const [{ isOver }, drop] = useDrop({
        accept: ItemTypes.FOLDER,
        drop: () => ({ id: originalFolder.id }),
        collect: (monitor) => ({
          isOver: !!monitor.isOver()
        })
      })

      /* CLICK FUNCTIONS*/
      //click function - handles Note opening function
    const firstClick = (e) => {
        e.preventDefault()
        console.log("Notes open function");
        setClickState(clickState + 1) 
    }

     //click function - handles folder name change
    const defaultClickState = (e, folder, updateFolder) => {
        console.log("default state called");
        setClickState(0)
        if (!(textField === originalTitle) && !(textField === "")){
          updateFolder(e, folder, textField)
        }
        if (textField === ""){
          setTextField(originalTitle)
          //error catch - Handle can't be empty 
        } 
    }

    // TEXT / FOCUS STATE HANDLERS
    const textChangeFunction = (e) => {
        //e.preventDefault()
        setTextField(e)
    }
    const handleFocus = (event) => {
      //console.log("On Focus");
      event.target.select();
    }

    const inputmyStyles = {
      width: '100px', //temp solution
    }

    //console.log(clicked)
    if (clickState === 0 ){ //first click
        return(
            <li>
              
            <div onDoubleClick={(e)=>firstClick(e)} ref={drag}
            style={{
              opacity: isDragging ? 0.5 : 1,
              //cursor: 'move',
              width: '100px' //temp solution
              
            }} > <div ref={drop}>  {textField}  </div> </div> 
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


/*

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

const inputmyStyles = {
  width: '100px', //temp solution
}



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

const blur1 = (e) => {
  console.log("blur1")
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
        
      }} > <div ref={drop}>  {textField}  </div> </div> 
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
*/