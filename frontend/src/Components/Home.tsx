import React, { useState, useEffect } from 'react'
import { useMutation, useLazyQuery, useQuery } from '@apollo/client'
import { CREATEFOLDER, GETFOLDERS, DELETEFOLDER, UPDATEFOLDER } from '../queries'
import Folder from './Folder'

const Home = ({setError, show}) => {
	const [title, setTitle] = useState('')
	const [newtitle, setNewTitle] = useState('')
	const [getfolderlist, folderlist] = useLazyQuery(GETFOLDERS) //const folderlist1 = useQuery(GETFOLDERS) //PLEASE NOTE 
	//const folderlist1 = useQuery(GETFOLDERS) //PLEASE NOTE ^^
	var finalfolderlist = []


	//catch authentication error and reroute here
	useEffect(() => { // may remove with useQuery(GETFOLDERS) ^^
		getfolderlist();
	}, [folderlist.data]);
	
	//create
	const [ addFolder, result ] = useMutation(CREATEFOLDER, { //use "result" if you want to handle an error because of result, eg. result = null 
		onError: ({ graphQLErrors, networkError }) => {
			if (graphQLErrors[0])   
			  setError(graphQLErrors[0].message)
			else if (networkError)
			   console.log(`[Network error]: ${networkError}`);
			   setError("Network Error occured")
				//setError(networkError)  <-- error
		  },
		refetchQueries: [{ query: GETFOLDERS } ] //<-- note: solution only for user, not other users
	})

	//delete
	const [ deleteFolderM, result1 ] = useMutation(DELETEFOLDER, {
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

	const submitNewFolder = async (event) => {
		event.preventDefault()
		await addFolder({ variables: { title } })
		//await getfolderlist() //unnecessary?
	}

	if (folderlist.loading)  { return <div>loading...</div> }
	if (folderlist.data) { finalfolderlist = folderlist.data.allFolders } 
	
	const deleteFolder = async (event, folder) => {
		event.preventDefault()
		var folderId = folder.id 
		await deleteFolderM({ variables: {id: folderId }}) //<-- make sure formatting is correct
	}

	const updateFolder = async (event, folder, newtitle) => {
		event.preventDefault()
		var folderId = folder.id
		await updateFolderM({ variables: {id: folderId, title: newtitle}})
	}
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
		<Folder key={i} folder={folder} deleteFolder={deleteFolder} updateFolder={updateFolder} />	)}
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


/*
		<div>
			location <input type="text" pattern="[0-9]*"
			value={location}
			onChange={({ target }) => setLocation(target.value)}
			/>
		</div>
*/