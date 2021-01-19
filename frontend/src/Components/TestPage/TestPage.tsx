import React, {useState} from 'react'

import { useMutation, useLazyQuery, useQuery } from '@apollo/client'
import { CREATEFOLDER, GETFOLDERS, DELETEFOLDER, UPDATEFOLDER, LOGIN } from '../../queries'
import Folder from '../Folder'

import EditableText21 from './EditableText21'
import LinkDisplay from './LinkDisplay'
import '../../index.css'

import RichEditorExample from './RichSlateEx1'
import FolderCollapsable from './FolderCollapsable'


const TestPage = ({show, setError}) => {
	var finalfolderlist = []
	var text1 = "temp text for LinkDisplay" //temp solution

	//get folders
	const folderlist = useQuery(GETFOLDERS)

	//update folder title
	const [ updateFolderM, result2 ] = useMutation(UPDATEFOLDER, {
		onError: ({ graphQLErrors, networkError }) => {
			if (graphQLErrors[0])   
			setError(graphQLErrors[0].message)
			else if (networkError)
			console.log(`[Network error]: ${networkError}`);
			setError("Network Error occured")
				//setError(networkError)  <-- error
		},
		refetchQueries: [{ query: GETFOLDERS } ]
	})

	const updateFolder = async (event, folder, newtitle) => {
		event.preventDefault()
		var folderId = folder.id
		await updateFolderM({ variables: {id: folderId, title: newtitle}})
	}

	 if (folderlist.loading)  { return <div>loading...</div> }
	 if (folderlist.error) {console.log("folderlist.error", folderlist.error);}
	 if (folderlist.data) { finalfolderlist = folderlist.data.allFolders }

	 //console.log("folderlist", folderlist);
	 //console.log("folderlist.data", folderlist.data);
	 //console.log("finalfolderlist (folderlist.data.allFolders )", finalfolderlist);
	 
	 
	 
	return(
	<div>
	  <div className="nav-main__margin">
		<div className=" nav-main">
			<div className="nav-folder ">
				<ul className="nav-folder__ul">
					{finalfolderlist.map((folder, i) => {
						{/* 
  //@ts-ignore */}	
  						if (folder.rootFolder){
							  {/* 
  //@ts-ignore */}	
							if (folder.folders.length > 0){
								return(
									<div className=" nav-folder__folder " tabIndex={i}>
								<FolderCollapsable key={i} folder={folder} updateFolder={updateFolder} setError={setError} />
									</div>
								)

								return(
									<div className=" nav-folder__folder " tabIndex={i}>
									<div className=" nav-folder__folder__main  " tabIndex={i}>
								<EditableText21 key={i} folder={folder}  updateFolder={updateFolder} setError={setError} /></div>
								<div className="nav-folder__folder__options-button"> <button> B </button></div>
								</div>
								)
							} else {
								return(
									<div className=" nav-folder__folder " tabIndex={i}>
									<div className=" nav-folder__folder__main  " tabIndex={i}>
								<EditableText21 key={i} folder={folder} updateFolder={updateFolder} setError={setError} /></div>
								<div className="nav-folder__folder__options-button"> <button> B </button></div>
								</div>
								)
							}
						}
					   } 
					)}
				</ul>
				
			</div>
			<div className=" nav-link">
				<div className=" nav-link__link"> 
				<LinkDisplay text={text1}  />
				</div>
				<div><hr></hr></div>
				<div className="nav-link__link"> 
				Notes
				</div>
				<div><hr></hr></div>
				<div className="nav-link__link"> 
				Notes notes notes notes notes notes notes <p> Notes notes notes notes notes notes notes</p>
				</div>
				<div><hr></hr></div>
				<div className="nav-link__link"> 
				Notes notes notes notes notes notes notes <p> Notes notes notes notes notes notes notes</p>
				</div>
				<div><hr></hr></div>
				<div className="nav-link__link"> 
				Notes notes notes notes notes notes notes <p> Notes notes notes notes notes notes notes</p>
				</div>
			</div>

			<div className=" nav-text">
				<div className="nav-text__text">
				<RichEditorExample />
				</div>
			</div>
		</div>
	  </div>
	</div>
	)
}

export default TestPage

/*
						<div className="textArea">
						<RichEditorExample />
						</div>
						*/


/*
							
						<textarea className="textArea" >
							3 of 31 of 31 of 31 of 31 of 31 of 3f 31 of 31 of 31 of 31 of 3f 31 of 31 of 31 of 31 of 3
							3 of 31 of 31 of 31 of 31 of 31 of 3f 31 of 31 of 31 of 31 of 3f 31 of 31 of 31 of 31 of 3

						</textarea>


<textarea className="textArea right" >
							3 of 31 of 31 of 31 of 31 of 31 of 3f 31 of 31 of 31 of 31 of 3f 31 of 31 of 31 of 31 of 3
							3 of 31 of 31 of 31 of 31 of 31 of 3f 31 of 31 of 31 of 31 of 3f 31 of 31 of 31 of 31 of 3
							</textarea>



3 of 31 of 31 of 31 of 31 of 31 of 3f 31 of 31 of 31 of 31 of 3f 31 of 31 of 31 of 31 of 3
						3 of 31 of 31 of 31 of 31 of 31 of 3f 31 of 31 of 31 of 31 of 3f 31 of 31 of 31 of 31 of 3</div>
						
						*/








	/*Link Display - tracking which is clicked
	- List of Links
		- usestate for the list of Links
		- usestate keeps track which is clicked
	*/

	/*Folders- tracking which is clicked
	- List of Folders
		- usestate for the list of Folders
		- usestate keeps track which is clicked
	*/


	//<div className="row-xs-3 row-sm-3 row-md-3 row-lg-3 testFdRow">
	//d-none d-md-block
	//Folder not resizing - maybe due to size of EditableText component
	// problem: multiple css class in one div. Eventually you should combine the appropriate ones