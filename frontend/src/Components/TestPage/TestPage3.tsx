import React, {useState} from 'react'

import { useMutation, useLazyQuery, useQuery } from '@apollo/client'
import { CREATEFOLDER, GETFOLDERS, DELETEFOLDER, UPDATEFOLDER } from '../../queries'
import Folder from '../Folder'

import EditableText from './Protos/EditableText'
import EditableText1 from './Protos/EditableText1'
import EditableText2 from './Protos/EditableText2'
import EditableText21 from './EditableText21'
import LinkDisplay from './LinkDisplay'
import '../../index.css'

import RichEditorExample from './RichSlateEx1'


const TestPage3 = ({show, setError}) => {
	var finalfolderlist = []
	//const [open, setOpen] = useState(false);
	const [text1, setText1] = useState("EditableText") //temporary solution for 1* Folder
	const outerTextChange = (text: string) =>{
		setText1(text)
	}

	const expandContract = () => {
		const el = document.getElementById("expand-contract")
		if (el){
			el.classList.toggle('expanded')
			el.classList.toggle('collapsed')
		}
	 }

	 const folderlist = useQuery(GETFOLDERS)

	//update
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
	 if (folderlist.data) { finalfolderlist = folderlist.data.allFolders }
	 console.log(finalfolderlist);
	  
	return(
	<div>
		Test Page 3
	  <div className="nav-main__margin">
		 


				
		<div className=" nav-main">
			<div className="nav-folder ">
				
				<ul className="nav-folder__ul">
					{finalfolderlist.map((folder, i) => 
					<div className=" nav-folder__folder">
					<EditableText21 key={i} folder={folder} outerTextFunction={outerTextChange} updateFolder={updateFolder} /></div> )}
				</ul>
				
				<div className=" nav-folder__folder d-flex">
				<button onClick={expandContract} className="nav-folder__sub-button">{">"}</button> <EditableText2 text={text1} outerTextFunction={outerTextChange} />
				</div>
					<div id="expand-container">
						<div id="expand-contract">
					
						<EditableText2 text={text1} outerTextFunction={outerTextChange} />
						<EditableText2 text={text1} outerTextFunction={outerTextChange} />
						</div>
					</div>
				<div className=" nav-folder__folder"> 
				
				<div className="nav-folder__folder-nosubs"> <EditableText2 text={text1} outerTextFunction={outerTextChange} /> </div>
				</div>
			</div>
			<div className=" nav-link">
				<div className=" nav-link__link"> 
				<LinkDisplay text={text1} outerTextFunction={outerTextChange} />
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

export default TestPage3

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