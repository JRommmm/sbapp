import React, {useState} from 'react'
import EditableText21 from './EditableText21'
import EditableText2 from './Protos/EditableText2'

import '../../index.css'

const FolderCollapsable = ({key, folder, updateFolder, setError}) => {
    const [expand, setExpand] = useState(false) 
	const expandContract = () => {
        setExpand(!expand)
     }
     console.log("expand", expand);
     
     //console.log("folder.folders", folder); //PROBLEM -> folder.folders not being retrieved properly
     // folder.folders just returns the Folder object as an id type
     // this is supposed to be populated by mongoose

     //multiple generations of folders: - recursive function goes here
     //FolderCollapsable should call FolderCollapsable

     //console.log("folder in FolderCollapsable", folder);
     console.log(folder.title, folder.generation);
     if (expand){
         return(
            <div>
            <div className=" nav-folder__folder_main-dropdown d-flex">
            <button onClick={expandContract} className="nav-folder__sub-button">{">"}</button> <EditableText21 key={key} folder={folder}  updateFolder={updateFolder} setError={setError}/>
            </div>
                <div id="expand-container">
                    <div id="expand-contract.collapsed">
                    <ul className="nav-folder__ul">
                    {folder.folders.map((subFolder, i) => {
                        console.log(subFolder.title, subFolder.generation);
                        
                        if (subFolder.folders) {                     
                            if (subFolder.folders.length > 0){
                            return(<FolderCollapsable key={i} folder={subFolder} updateFolder={updateFolder} setError={setError}/> )
                        } else {
                            return(<EditableText21 key={i} folder={subFolder}  updateFolder={updateFolder} setError={setError}/>)
                        }}
                    })}
                    </ul>
                    </div>
                </div>
            </div>
         )
     }
     //console.log(folder.title, folder.generation);
     
    return(
        <div>
        <div className=" nav-folder__folder_main-dropdown d-flex">
        <button onClick={expandContract} className="nav-folder__sub-button">{">"}</button> <EditableText21 key={key} folder={folder} updateFolder={updateFolder} setError={setError} />
        </div>
            <div id="expand-container">
                <div id="expand-contract">

                <ul className="nav-folder__ul">
                    {folder.folders.map((subFolder, i) => {
                        //console.log("subFolder", subFolder);
                        //problem: subFolder's folders dont have all information 
                        if (subFolder.folders) {    //therefore this will ALWASYS be false     FIX: retrieve this information from mongoose             
                            if (subFolder.folders.length > 0){
                            return(<FolderCollapsable key={i} folder={subFolder} updateFolder={updateFolder} setError={setError}/> )
                        } else {
                            return(<EditableText21 key={i} folder={subFolder}  updateFolder={updateFolder} setError={setError}/>)
                        }}
                    })}
                    </ul>
                </div>
            </div>
        </div>					
    )
}
export default FolderCollapsable