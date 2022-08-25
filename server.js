const fs = require("fs");
const path = require("path");
const express = require("express");
const app = express();
const noteList = require("./db/db.json");
console.log(noteList)
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/api/notes", (req, res) => {
  res.json(noteList.slice(1));
});
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.post("/api/notes", (req, res) => {
  const newNote = createNote(req.body, noteList);
  res.json(newNote);
});

app.delete("/api/notes/:id", (req, res) => {
  deleteNote(req.params.id, noteList);
  res.json(true);
});


function createNote(body, noteArray) {
  const newNote = body;
  if (!Array.isArray(noteArray)) noteArray[0]++;

  if (noteArray.length === 0) noteArray.push(0);

  body.id = noteArray[0];
  noteArray[0]++;
  
  noteArray.push(newNote);
  fs.writeFile(
    path.join(__dirname, "./db/db.json"),
    JSON.stringify(noteArray, null, 2)
    );
  return newNote;
}

function deleteNote(id, noteArray) {
  for (let i = 0; i < noteArray.length; i++) {
    let notes = noteArray[i];
    
    if (notes.id == id) {
      noteArray.splice(i, 1);
      fs.writeFileSync(
        path.join(__dirname, "./db/db.json"),
        JSON.stringify(noteArray, null, 2)
        );
    }
    break;
  }
}
app.listen(PORT, () => {
  console.log(`Server is running ${PORT}!!`);
});
