import { useContext } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { NotesContext } from "../context/NotesContext";
import { AuthContext } from "../context/AuthContext";
import { updateNote } from "../services/notes_service";

const Color = ({ color }) => {
  const { selectedNote, notes, setNotes } = useContext(NotesContext);
  const { userToken } = useContext(AuthContext);

  const changeColor = async () => {
    if (!selectedNote) {
      const toastId = "color-error-toast";
      toast.dismiss(toastId);
      toast.error("You must select a note before changing colors", {
        toastId,
      });
      return;
    }

    const currentNoteIndex = notes.findIndex(
      (note) => note._id === selectedNote._id
    );
    const newNotes = [...notes];
    const updatedNote = {
      ...newNotes[currentNoteIndex],
      colors: color,
    };

    newNotes[currentNoteIndex] = updatedNote;
    setNotes(newNotes);

    try {
      const response = await updateNote(
        selectedNote._id,
        updatedNote,
        userToken
      );

      if (!response.success) {
        throw new Error(response.error);
      }
    } catch (error) {
      setNotes(notes);
      const toastId = "color-error-toast";
      toast.dismiss(toastId);
      toast.error(error.message, {
        toastId,
      });
    }
  };

  return (
    <div
      onClick={changeColor}
      className="color"
      style={{ backgroundColor: color.colorHeader }}
    ></div>
  );
};

Color.propTypes = {
  color: PropTypes.shape({ colorHeader: PropTypes.string }).isRequired,
};

export default Color;
