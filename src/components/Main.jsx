import React, { useState } from "react";
//import AddIcon from "@material-ui/icons/Add";

function Main(props) {
  // const [noteTitle, setNoteTitle] = useState("");
  // const [noteContent, setNoteContent] = useState("");
  // const [isExpanded, setIsExpanded] = useState(false);

  // function handleTitleChange(event) {
  //   setNoteTitle(event.target.value);
  // }

  // function handleTextChange(event) {
  //   setNoteContent(event.target.value);
  // }

  // function handleClick(event) {
  //   event.preventDefault();
  //   props.addNote(noteTitle, noteContent);
  //   setNoteTitle("");
  //   setNoteContent("");
  // }

  // function handleTextClick() {
  //   setIsExpanded(true);
  // }

  // return (
  //   <div>
  //     <form className="create-note">
  //       {isExpanded && (
  //         <input
  //           onChange={handleTitleChange}
  //           name="title"
  //           placeholder="Title"
  //           value={noteTitle}
  //         />
  //       )}
  //       <textarea
  //         onChange={handleTextChange}
  //         onClick={!isExpanded && handleTextClick}
  //         name="content"
  //         placeholder="Take a note..."
  //         rows={isExpanded ? 3 : 1}
  //         value={noteContent}
  //       />
  //       <Zoom in={isExpanded}>
  //         <Fab onClick={handleClick}>
  //           <AddIcon />
  //         </Fab>
  //       </Zoom>
  //     </form>
  //   </div>
  // );
}

export default Main;
