// import React, { useState } from "react";
// import {
//     FormControl,
//     InputLabel,
//     Select,
//     TextField,
//     Button,
//     Grid
//   } from "@material-ui/core";


// function Main(props) {
  
//   const [actionType, setActionType] = useState("");
//   const [actionLocation, setActionLocation] = useState("");
//   const [actionContext, setActionContext] = useState("");
 

//   function getTime(){
//     let d = new Date();
//     let hours = d.getHours();
//     let minutes = d.getMinutes();
//     return  hours + ":" + minutes;
//   }

//   function handleTypeChange(event) {
//     setActionType(event.target.value);
//   }

//   function handleTextChange(event) {
//     setActionContext(event.target.value);
//   }

//   function handleClick(event) {
//     event.preventDefault();
//     props.addNote(noteTitle, noteContent);
//     setNoteTitle("");
//     setNoteContent("");
//   }

//   function handleTextClick() {
//     setIsExpanded(true);
//   }

//   return (
//     <div>
//       <form action="/add-new-action" method="POST" align="center">
//           <FormControl>
//             <InputLabel htmlFor="email-input">Email address</InputLabel>
//             <Select
//             native
//             value={actionType}
//             onChange={handleTypeChange}
//             inputProps={{
//             name: 'age',
//             id: 'age-native-simple',
//           }}
//             />
//           </FormControl>

//           <FormControl>
//             <InputLabel htmlFor="email-input">Email address</InputLabel>
//             <TextField id="standard-basic" label="Standard"  value={actionContext}
//             onChange={handleContextChange}/>
//           </FormControl>
//         {isExpanded && (
//           <input
//             onChange={handleTitleChange}
//             name="title"
//             placeholder="Title"
//             value={noteTitle}
//           />
//         )}
//         <textarea
//           onChange={handleTextChange}
//           onClick={!isExpanded && handleTextClick}
//           name="content"
//           placeholder="Take a note..."
//           rows={isExpanded ? 3 : 1}
//           value={noteContent}
//         />
//         <Zoom in={isExpanded}>
//           <Fab onClick={handleClick}>
//             <AddIcon />
//           </Fab>
//         </Zoom>
//       </form>
//     </div>
//   );
// }

// export default Main;
