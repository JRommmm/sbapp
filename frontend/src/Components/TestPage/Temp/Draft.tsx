import React from "react";
import { Editor, EditorState } from "draft-js";
import "draft-js/dist/Draft.css";

//mport {Editor, EditorState, RichUtils, convertToRaw, Draft, Immutable} from 'draft-js';



export default function MyEditor() {
  const [editorState, setEditorState] = React.useState(() =>
    EditorState.createEmpty()
  );

  const editor = React.useRef(null);
  function focusEditor() {
      // @ts-ignore
    editor.current.focus();
  }

  return (
    <div
      style={{ border: "1px solid black", minHeight: "6em", cursor: "text" }}
      onClick={focusEditor}
    >
      <Editor
        ref={editor}
        editorState={editorState}
        onChange={setEditorState}
        placeholder="Write something!"
      />
    </div>
  );
}



/*
import React from "react";
import { Editor, EditorState } from "draft-js";
import "draft-js/dist/Draft.css";

export default function MyEditor() {
  const [editorState, setEditorState] = React.useState(() =>
    EditorState.createEmpty()
  );

  const editor = React.useRef(null);
  function focusEditor() {
      // @ts-ignore
    editor.current.focus();
  }

  return (
    <div
      style={{ border: "1px solid black", minHeight: "6em", cursor: "text" }}
      onClick={focusEditor}
    >
      <Editor
        ref={editor}
        editorState={editorState}
        onChange={setEditorState}
        placeholder="Write something!"
      />
    </div>
  );
}
*/


/*
import {Editor, EditorState, RichUtils, convertToRaw, Draft, Immutable} from 'draft-js';



const styleMap = {
	CODE: {
		backgroundColor: 'rgba(0, 0, 0, 0.05)',
		fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
		fontSize: 16,
		padding: 2,
	},
};


function getBlockStyle(block) {
	switch (block.getType()) {
		case 'blockquote': return 'RichEditor-blockquote';
		case 'new-block-type-name':
			return {
				component: CustomComponent,
				editable: false,
			}
		default: return null;
	}
}

const CustomComponent = ({children}) => {
	return (
		<div> 
			<span> 🔥 🔥 🔥 🔥 🔥 🔥 🔥 🔥 🔥  </span> 
				{children}
			<span> 🔥 🔥 🔥 🔥 🔥 🔥 🔥 🔥 🔥  </span>
		</div>
	)
}

const blockRenderMap = Immutable.Map({
	'new-block-type-name': {
		element: CustomComponent
	}
});

const extendedBlockRenderMap = Draft.DefaultDraftBlockRenderMap.merge(blockRenderMap);

const StyleButton = ({style, onToggle, active, label}) => {
	const onMouseDown = (e) => {
			e.preventDefault();
			onToggle(style);
	}
	
	const className = !active ? 'RichEditor-styleButton' : 'RichEditor-styleButton RichEditor-activeButton'
	
	return (
		<span className={className} onMouseDown={onMouseDown}>
			{label}
		</span>
	);

}

const BLOCK_TYPES = [
	{label: 'H1', style: 'header-one'},
	{label: 'H2', style: 'header-two'},
	{label: 'H3', style: 'header-three'},
	{label: 'H4', style: 'header-four'},
	{label: 'H5', style: 'header-five'},
	{label: 'H6', style: 'header-six'},
	{label: 'Blockquote', style: 'blockquote'},
	{label: 'UL', style: 'unordered-list-item'},
	{label: 'OL', style: 'ordered-list-item'},
	{label: 'Code Block', style: 'code-block'},
	{label: 'Fire', style:'new-block-type-name'}
];

const BlockStyleControls = ({editorState, onToggle}) => {
	const selection = editorState.getSelection();
	const blockType = editorState
	.getCurrentContent()
	.getBlockForKey(selection.getStartKey())
	.getType();

	return (
		<div className="RichEditor-controls">
			{BLOCK_TYPES.map((type) =>
							 <StyleButton
								 key={type.label}
								 active={type.style === blockType}
								 label={type.label}
								 onToggle={onToggle}
								 style={type.style}
								 />
							)}
		</div>
	);
};

const INLINE_STYLES = [
	{label: 'Bold', style: 'BOLD'},
	{label: 'Italic', style: 'ITALIC'},
	{label: 'Underline', style: 'UNDERLINE'},
	{label: 'Monospace', style: 'CODE'},
];

const InlineStyleControls = ({editorState, onToggle}) => {
	var currentStyle = editorState.getCurrentInlineStyle();
	return (
		<div className="RichEditor-controls">
			{INLINE_STYLES.map(type =>
							   <StyleButton
								   key={type.label}
								   active={currentStyle.has(type.style)}
								   label={type.label}
								   onToggle={onToggle}
								   style={type.style}
								   />
							  )}
		</div>
	);
};


class RichEditorExample extends React.Component {
	constructor(props) {
		super(props);
        this.state = {editorState: EditorState.createEmpty()};
        // @ts-ignore 
		this.focus = () => this.refs.editor.focus();
	}
	onChange = (editorState) => {
		this.setState({editorState});
	}

	toggleBlockType = (blockType) => {
		this.onChange(
			RichUtils.toggleBlockType(
                // @ts-ignore 
				this.state.editorState,
				blockType
			));
	}

	toggleInlineStyle = (inlineStyle) => {
		this.onChange(
			RichUtils.toggleInlineStyle(
                // @ts-ignore 
				this.state.editorState,
				inlineStyle
			)
		);
	}

	render() {
        // @ts-ignore 
		const {editorState} = this.state;

		// If the user changes block type before entering any text, we can
		// either style the placeholder or hide it. Let's just hide it now.
		let className = 'RichEditor-editor';
		var contentState = editorState.getCurrentContent();
		if (!contentState.hasText()) {
			if (contentState.getBlockMap().first().getType() !== 'unstyled') {
				className += ' RichEditor-hidePlaceholder';
			}
		}

		return (
			<div className="RichEditor-root">
				<BlockStyleControls
					editorState={editorState}
					onToggle={this.toggleBlockType}
					/>
				<InlineStyleControls
					editorState={editorState}
					onToggle={this.toggleInlineStyle}
					/>
                    
  <div className={className} onClick={this.focus}>
  <Editor
      blockStyleFn={getBlockStyle}
      customStyleMap={styleMap}
      editorState={editorState}
      onChange={this.onChange}
      placeholder="Tell a story..."
      ref="editor"
      blockRenderMap={extendedBlockRenderMap}
      />
</div>
</div>
  );
}
}
*/


{/* 
  // @ts-ignore */}