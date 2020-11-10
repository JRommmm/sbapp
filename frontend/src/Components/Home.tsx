import React, { useState, useEffect } from 'react'
import { useMutation, useLazyQuery, useQuery } from '@apollo/client'
import { CREATEFOLDER, GETFOLDERS } from '../queries'
import Folder from './Folder'


const Home = ({setError, show}) => {
	const [title, setTitle] = useState('')
	const [getfolderlist, folderlist] = useLazyQuery(GETFOLDERS) 
	var finalfolderlist = []

	useEffect(() => {
		getfolderlist();
	}, [folderlist.data]);

	//const folderlist1 = useQuery(GETFOLDERS) //PLEASE NOTE 
	
	const [ addFolder, result ] = useMutation(CREATEFOLDER, {
		onError: ({ graphQLErrors, networkError }) => {
			if (graphQLErrors[0])   
			  setError(graphQLErrors[0].message)
			else if (networkError)
			   console.log(`[Network error]: ${networkError}`);
			   setError("Network Error occured")
				//setError(networkError)  <-- error
		  }
		})
	const submitNewFolder = async (event) => {
		event.preventDefault()
	
		await addFolder({ variables: { title } })
		await getfolderlist()
	  }

	if (folderlist.loading)  { return <div>loading...</div> }
	if (folderlist.data) { finalfolderlist = folderlist.data.allFolders } 
	
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