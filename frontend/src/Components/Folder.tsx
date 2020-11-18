import React, { useState } from 'react'

const Folder = ({ folder, deleteFolder, updateFolder }) => {
  const [newtitle, setNewTitle] = useState('')
  return (
    <li>{folder.title} 
    <button onClick={(event) => deleteFolder(event, folder)}>delete</button>
    <button onClick={(event) => updateFolder(event, folder, newtitle)}>update</button>
    <input value={newtitle} onChange={({ target }) => setNewTitle(target.value)} />
    </li>
  )
}

export default Folder