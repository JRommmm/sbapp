import React, {useState} from 'react'
import FormExample from './Temp/FormExample'
import StateExample from './Temp/StateExample'

import EditableText from './Protos/EditableText'
import '../../index.css'

//import Container from 'react-bootstrap/Container'
///import Row from 'react-bootstrap/Row'
//import Col from 'react-bootstrap/Col'
import {Container, Row, Col} from 'react-bootstrap/'
import ListGroup from 'react-bootstrap/ListGroup'
import Collapse from 'react-bootstrap/Collapse'
import Button from 'react-bootstrap/Button'
import Table from 'react-bootstrap/Table'

//import Example from './Example'

const TestPage = ({show}) => {
	const [open, setOpen] = useState(false);

	const [text1, setText1] = useState("EditableText comp") //temporary solution for 1* Folder

	const columns = [{
	  dataField: 'title',
	  text: 'Folder'
	}];

	const outerTextChange = (text: string) =>{
		setText1(text)
	}

	//<div className="row-xs-3 row-sm-3 row-md-3 row-lg-3 testFdRow">
	//d-none d-md-block
	//Folder not resizing - maybe due to size of EditableText component
	// problem: multiple css class in one div. Eventually you should combine the appropriate ones
	return(
	  <div className="mainMargin">


				<div className=" testFdCont leftChild ">
					<div className="row testFdRow flexContainer">
						<div className="col-xs-3 col-sm-3 col-md-3 col-lg-3 folderBackground">
							<div className="row-xs-3 row-sm-3 row-md-3 row-lg-3 testFdRow">
							<EditableText text={text1} outerTextFunction={outerTextChange} />
							</div>
							<div className="row-xs-3 row-sm-3 row-md-3 row-lg-3 testFdRow"> 
							<EditableText text={text1} outerTextFunction={outerTextChange} />
							</div>
						</div>
						<div className=" colBorder colMargin "></div>
						<div className="col-xs-3 col-sm-3 col-md-3 col-lg-3 testFdCol colMargin">
							<div className="testFdRow"> 
							Notes notes notes notes notes notes notes <p> Notes notes notes notes notes notes notes</p>
							</div>
							<div className=" testFdRow"> 
							Notes
							</div>
						</div>

						<div className="col-xs-9 col-sm-9 col-md-6 col-lg-6 testFdCol colMargin">
						3 of 31 of 31 of 31 of 31 of 31 of 3f 31 of 31 of 31 of 31 of 3f 31 of 31 of 31 of 31 of 3
						3 of 31 of 31 of 31 of 31 of 31 of 3f 31 of 31 of 31 of 31 of 3f 31 of 31 of 31 of 31 of 3
						</div>

					</div>
				</div>

	  </div>
	)
}

export default TestPage

/*
<Table striped bordered hover size="sm">
<thead>
	<tr><th>Notes</th></tr>
</thead>
<tbody>
	<tr><td>Note Notes</td></tr>
	<tr><td>Life stuff</td></tr>
	<tr><td>Larry the Bird</td></tr>
</tbody>
</Table>
*/

//{/<div className="row-xs-3 row-sm-3 row-md-3 row-lg-3 testFdRow">/}

/*
	  <div>

		<Container fluid>
		<Row>
			<Col xs={3} sm={3} md={3} lg={3} >

				<div className="container">
					<div className="col-xs-4 col-sm-4 col-md-4 col-lg-4">
						<div className="row-xs-4 row-sm-4 row-md-4 row-lg-4">
						<EditableText text={text1} outerTextFunction={outerTextChange} />
						</div>
						<div className="row-xs-4 row-sm-4 row-md-4 row-lg-4">
						<EditableText text={text1} outerTextFunction={outerTextChange} />
						</div>
					</div>
				</div>
			</Col>
			<Col xs={3} sm={3} md={3} lg={3}>
			<Table striped bordered hover size="sm">
				<thead>
					<tr><th>Notes</th></tr>
				</thead>
				<tbody>
					<tr><td>Note Notes</td></tr>
					<tr><td>Life stuff</td></tr>
					<tr><td>Larry the Bird</td></tr>
				</tbody>
				</Table>
			</Col>
			<Col >3 of 31 of 31 of 31 of 31 of 31 of 3f 31 of 31 of 31 of 31 of 3f 31 of 31 of 31 of 31 of 3</Col>
		</Row>
		</Container>
	  </div>

	*/



/*
				<Table striped bordered hover size="sm">
				<thead>
					<tr><th>
					Folder
					</th></tr>
				</thead>
				<tbody>
					<tr><td>
						<EditableText text={text1} outerTextFunction={outerTextChange} />
					</td></tr>
					<tr><td>				
						<EditableText text={text1} outerTextFunction={outerTextChange} />
					</td></tr>
					<tr><td>
						<Editable defaultValue="Life"><EditablePreview /><EditableInput /></Editable>
					</td></tr>
				</tbody>
				</Table>
*/


/*
	const products = [
		{ title: "200" },
		{ title: "life" },
		{ title: "To Do" },
		{ title: "stuff" },
	]
	const columns = [{
	  dataField: 'title',
	  text: 'Folder'
	}];

	const changed = (x:String):void|undefined => {
		console.log(x)
	}

*/



/*
<>
<Button
	onClick={() => setOpen(!open)}
	aria-controls="example-collapse-text"
	aria-expanded={open}
>
	click
</Button>
Folder
<Collapse in={open}>
	<div id="example-collapse-text">

	</div>
</Collapse>
</>
*/

/*
<p>Hello world</p>
<p> This app will begin with generic functions to begin setup... </p>
<StateExample />
<FormExample />	
*/

/*

			<div className="App">
		<AppBar position="static" color="default">
			<Toolbar>
			<Typography variant="h6" color="inherit">
				Photos
			</Typography>
			</Toolbar>
			<main style={{ position: "relative" }}>
			<SplitPane>
			<div style={{ padding: "0 2rem" }}>
				A
			</div>
			<div style={{ padding: "0 2rem" }}>
				B
			</div>
			</SplitPane>
			</main>
		</AppBar>
		</div>
		*/


		/*
				<Container fluid>
		<Row>
			<Col xs={4} sm={4} md={4} lg={4} >

			 <ListGroup>
				<ListGroup.Item>Folder</ListGroup.Item>
				<ListGroup.Item>
				<>
					<Button
						onClick={() => setOpen(!open)}
						aria-controls="example-collapse-text"
						aria-expanded={open}
					>
						click
					</Button>
					Folder
					<Collapse in={open}>
						<div id="example-collapse-text">
						<ListGroup>
							<ListGroup.Item>Folder</ListGroup.Item>
							<ListGroup.Item>Folder</ListGroup.Item>
						</ListGroup>
						</div>
					</Collapse>
					</>
				</ListGroup.Item>
				<ListGroup.Item>FolderFolderFolder</ListGroup.Item>
				<ListGroup.Item>Folder</ListGroup.Item>
				<ListGroup.Item>Folder</ListGroup.Item>
			 </ListGroup>
			</Col>
			<Col xs={3} sm={3} md={3} lg={3}>
			<ListGroup.Item>Note</ListGroup.Item>
				<ListGroup.Item>NoteNote</ListGroup.Item>
				<ListGroup.Item>NoteNoteNoteNote</ListGroup.Item>
				<ListGroup.Item>Note</ListGroup.Item>
				<ListGroup.Item>Note</ListGroup.Item>
			</Col>
			<Col >3 of 31 of 31 of 31 of 31 of 31 of 3f 31 of 31 of 31 of 31 of 3f 31 of 31 of 31 of 31 of 3</Col>
		</Row>
		</Container>
		*/

		/*
		<Table striped bordered hover size="sm">
				<thead>
					<tr>
					<th>Folder</th>
					</tr>
				</thead>
				<tbody>
					<tr>
					<td>
						<>
						<Button
							onClick={() => setOpen(!open)}
							aria-controls="example-collapse-text"
							aria-expanded={open}
							size="sm"
						>
							`{'>'}`
						</Button>
						Folder
						<Collapse in={open}>
							<div id="example-collapse-text">
								<Table striped bordered hover size="sm">
								<tbody>
									<tr>
									<td>Life stuff</td>
									</tr>
									<tr>
									<td>Life stuff</td>
									</tr>
								</tbody>
							</Table>
							</div>
						</Collapse>
						</>
					</td>
					</tr>
					<tr>
					<td colSpan={2}>Larry the Bird</td>
					</tr>
				</tbody>
				</Table>
			</Col>
			*/


			/*
						<BootstrapTable 
				keyField='id' 
				data={ products } 
				columns={ columns } 
				cellEdit={ cellEditFactory({ mode: 'dbclick' })}/>
				*/



				/*
				import ReactDataGrid from 'react-data-grid';
import BootstrapTable from 'react-bootstrap-table-next';
import cellEditFactory from 'react-bootstrap-table2-editor';
import { Editable, EditableInput, EditablePreview } from "@chakra-ui/react"
import { StringDecoder } from 'string_decoder'
*/


/*
import SplitPane from 'react-split-pane'
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
*/