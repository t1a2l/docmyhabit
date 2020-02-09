import React, { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Login from "./Login";
import Register from "./Register";

function App() {
  const [noteList, setNoteList] = useState([]);

  // function addNote(noteTitle, noteContent) {      
  //   setNoteList(prevNotes => {
  //     return [...prevNotes, {
  //       title: noteTitle,
  //       content: noteContent
  //     }];
  //   })
  // }

  // function deleteNote(id) {
  //   setNoteList(prevNotes => {
  //     return prevNotes.filter((note, index) => {
  //       return index !== id;
  //     })
  //   })
  // }

  return (
    <div>
      <Header></Header>
      <Login></Login>
      {/* <CreateArea addNote={addNote}/>
      {noteList.map((note, index) => {
        return <Note key={Uuidv1()} id={index} title={note.title} content={note.content} deleteNote={deleteNote}/>
      })} */}
      <Footer></Footer>
    </div>
  );
}

export default App;
