import React, { useState, useEffect } from 'react'
import { useMutation, useLazyQuery, useQuery } from '@apollo/client'
import { CREATEFOLDER, GETFOLDERS } from '../queries'
import Folder from './Folder'


const Home = ({setError}) => {
	const [title, setTitle] = useState('')
	const [getfolderlist, folderlist] = useLazyQuery(GETFOLDERS) 
	var finalfolderlist = []

	useEffect(() => {
		getfolderlist();
	}, [folderlist.data]);

	//const folderlist1 = useQuery(GETFOLDERS) //PLEASE NOTE 
	
	//console.log("folderlist", folderlist);

	const [ addFolder, result ] = useMutation(CREATEFOLDER, {
		onError: (error) => {
		  setError(error.graphQLErrors[0].message)
		}
	  })
	const submitNewFolder = async (event) => {
		event.preventDefault()
	
		await addFolder({ variables: { title } })
		await getfolderlist()
	  }
	if (folderlist.loading)  {
		//console.log("folderlist.loading triggered");
		return <div>loading...</div>
	  }



	if (folderlist.data) {
		//console.log("folderlist.data triggered");
		//console.log("folderlist.data:", folderlist.data.allFolders);
		finalfolderlist = folderlist.data.allFolders
	} 
	


	//console.log("folderlist.data:", typeof(folderlist.data.allFolders));
	//console.log("folderlist1.data:", typeof(folderlist1.data));
	return(
	  <div>
	    <h3> Main App View (under construction) </h3>
		<p> Add Folder: </p>
		<div>
		<form onSubmit={submitNewFolder}>
		<div>
			title <input
			value={title}
			onChange={({ target }) => setTitle(target.value)}
			/>
		</div>
		<button type='submit'>Add Folder</button>
		</form>
		</div>
		<div>
		<ul>
		{finalfolderlist.map((folder, i) => 
		<Folder key={i} folder={folder} />	)}
		</ul>
		</div>	
	  </div>
	)
}

export default Home


//{folderlist1.data.allFolders.map((folder, i) => 
//	<Folder key={i} folder={folder} />	)}

//		{finalfolderlist.map((folder, i) => 
//<Folder key={i} folder={folder} />	)}