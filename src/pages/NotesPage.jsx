import { useContext, useEffect } from "react";
import { Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import NoteCard from "../components/NoteCard";
import { NotesContext } from "../context/NotesContext";
import { AuthContext } from "../context/AuthContext";
import Controls from "../components/Controls";

const NotesPage = () => {
  const { notes, loading, error } = useContext(NotesContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  console.log("In the notes page", loading);
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  return (
    <div>
      {error && <Typography color="error">{error}</Typography>}
      {notes.map((note) => (
        <NoteCard note={note} key={note._id} />
      ))}
      <Controls />
    </div>
  );
};

export default NotesPage;
