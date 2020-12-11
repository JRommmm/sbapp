import React, {useState} from 'react'
import FormExample from './Temp/FormExample'
import StateExample from './Temp/StateExample'

import EditableText from './Protos/EditableText'
import EditableText1 from './Protos/EditableText1'
import EditableText2 from './Protos/EditableText2'
import LinkDisplay from './LinkDisplay'
import '../../index.css'

import {Editor, EditorState} from 'draft-js';
import 'draft-js/dist/Draft.css';

import RichEditorExample from './RichSlateEx1'

//import Container from 'react-bootstrap/Container'
///import Row from 'react-bootstrap/Row'
//import Col from 'react-bootstrap/Col'
import {Container, Row, Col} from 'react-bootstrap/'
import ListGroup from 'react-bootstrap/ListGroup'
import Collapse from 'react-bootstrap/Collapse'
import Button from 'react-bootstrap/Button'
import Table from 'react-bootstrap/Table'

//import Example from './Example'

const TestPage2 = ({show}) => {


	const [open, setOpen] = useState(false);

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
	return(
	<div>
	  <div className="mainMargin">
		 


				<div className="  leftChild ">
					<div className="row flexContainer rowBorder ">
						<div className="folderBackground ">
							<div className=" maxHeightFolder d-flex">
								{/* 
  //@ts-ignore */}	  
							<button onClick={expandContract} className="button">{">"}</button> <EditableText2 text={text1} outerTextFunction={outerTextChange} />
							</div>
								<div id="expand-container">
									<div id="expand-contract">
								
									<EditableText2 text={text1} outerTextFunction={outerTextChange} />
									<EditableText2 text={text1} outerTextFunction={outerTextChange} />
									</div>
								</div>
							<div className=" maxHeightFolder"> 
							{/* 
  //@ts-ignore */}	  
							<div className="nosubs"> <EditableText2 text={text1} outerTextFunction={outerTextChange} /> </div>
							</div>
						</div>
						<div className=" colMargin scrollNotes">
							<div className=" maxHeight"> 
							<LinkDisplay text={text1} outerTextFunction={outerTextChange} />
							</div>
							<div><hr></hr></div>
							<div className="maxHeight"> 
							Notes
							</div>
							<div><hr></hr></div>
							<div className="maxHeight"> 
							Notes notes notes notes notes notes notes <p> Notes notes notes notes notes notes notes</p>
							</div>
							<div><hr></hr></div>
							<div className="maxHeight"> 
							Notes notes notes notes notes notes notes <p> Notes notes notes notes notes notes notes</p>
							</div>
						</div>

						<div className="colMargin textColFix">
							<div className="textArea">
							<RichEditorExample />
							</div>
						</div>

					</div>
				</div>

	  </div>

	</div>
	)
}

export default TestPage2

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