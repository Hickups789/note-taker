const fs = require("fs");
const path = require("path");
const express = require("express");
const app = express();
const noteList = require("./db/db.json");
console.log(noteList);
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/api/notes", (req, res) => {
  res.json(noteList);
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
  console.log(req.body);
  const newNote = createNote(req.body, noteList);
  res.json(newNote);
});

app.delete("/api/notes/:id", (req, res) => {
  console.log(noteList);
  console.log(req.params.id);
  deleteNote(req.params.id, noteList);
  res.json(true);
});

function createNote(body, noteArray) {
  body.id = noteArray.length;
  const newNote = body;
  noteArray.push(newNote);
  fs.writeFile(
    path.join(__dirname, "./db/db.json"),
    JSON.stringify(noteArray, null, 2),
    (err) => {
      err ? console.log(err) : console.log("Success!");
    }
  );
  return newNote;
};

function deleteNote(id, noteArray) {
  console.log("I'm in my delete note function");
  console.log(noteArray);
  const newNotes = noteArray.filter(function (note) {
    return note.id !== id;
  });
  console.log(newNotes);

  fs.writeFile(
    path.join(__dirname, "./db/db.json"),
    JSON.stringify(newNotes, null, 2),
    (err) => {
      err ? console.log(err) : console.log("Success!");
    }
  );
}

app.listen(PORT, () => {
  console.log(`Server is running ${PORT}!!`);
});
